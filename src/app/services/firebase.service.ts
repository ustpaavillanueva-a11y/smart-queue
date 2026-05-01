import { Injectable } from '@angular/core';
import { auth, db } from '../config/firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentUser = signal<any>(null);
  userRole = signal<'patient' | 'staff' | 'admin' | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    this.initAuthListener();
  }

  // Listen for auth state changes
  initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser.set(user);
      if (user) {
        await this.getUserRole(user.uid);
      } else {
        this.userRole.set(null);
      }
    });
  }

  // Get user role from Firestore
  async getUserRole(userId: string) {
    try {
      // Use document ID directly (which is the UID) for faster lookup
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        this.userRole.set(userData['role']);
        console.log(`✅ User role fetched: ${userData['role']}`);
      } else {
        console.warn(`⚠️ No user document found for UID: ${userId}`);
        this.userRole.set(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      this.userRole.set(null);
    }
  }

  // Initialize default admin account
  async initializeDefaultAdmin() {
    try {
      console.log('🔄 Checking for existing admin account...');
      // Check if any admin exists
      const adminDocs = await getDocs(query(collection(db, 'users'), where('role', '==', 'admin')));
      
      if (adminDocs.empty) {
        console.log('⏳ No admin found. Creating default admin account...');
        const defaultEmail = 'admin@hospital.com';
        const defaultPassword = 'admin123456';

        try {
          const result = await createUserWithEmailAndPassword(auth, defaultEmail, defaultPassword);
          console.log('✅ Admin auth account created, UID:', result.user.uid);
          
          // Create user document with admin role
          await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email: defaultEmail,
            name: 'Administrator',
            role: 'admin',
            createdAt: new Date(),
            isDefault: true
          });
          
          console.log('✅ Default admin account created successfully!');
          console.log('📧 Email: admin@hospital.com');
          console.log('🔐 Password: admin123456');
          console.log('🆔 UID:', result.user.uid);
          
          // Sign out to keep user logged out
          await signOut(auth);
          
        } catch (createError: any) {
          if (createError.code === 'auth/email-already-in-use') {
            console.log('⚠️ Admin account already exists in Auth. Checking Firestore...');
            
            // Account exists in auth, try to log in and create Firestore doc if missing
            try {
              const authUser = await signInWithEmailAndPassword(auth, defaultEmail, defaultPassword);
              console.log('✅ Signed in as existing admin, UID:', authUser.user.uid);
              
              // Check if Firestore doc exists
              const userDocs = await getDocs(query(collection(db, 'users'), where('uid', '==', authUser.user.uid)));
              
              if (userDocs.empty) {
                console.log('📝 Creating missing admin document in Firestore...');
                // User exists in auth but not in Firestore, create document
                await setDoc(doc(db, 'users', authUser.user.uid), {
                  uid: authUser.user.uid,
                  email: defaultEmail,
                  name: 'Administrator',
                  role: 'admin',
                  createdAt: new Date(),
                  isDefault: true
                });
                console.log('✅ Created admin document in Firestore');
              } else {
                console.log('✅ Admin document already exists in Firestore');
              }
              
              // Sign out to keep user logged out
              await signOut(auth);
            } catch (err: any) {
              console.error('❌ Error handling existing admin:', err);
            }
          } else {
            console.error('❌ Error creating admin account:', createError.message);
          }
        }
      } else {
        console.log('✅ Admin account already exists');
      }
    } catch (error) {
      console.error('❌ Error initializing default admin:', error);
    }
  }

  // Register new user as patient
  async registerUser(email: string, password: string) {
    try {
      this.isLoading.set(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document with patient role
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: email,
        role: 'patient',
        createdAt: new Date()
      });
      
      this.errorMessage.set('');
      return result.user;
    } catch (error: any) {
      this.errorMessage.set(error.message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Admin creates staff account
  async createStaffAccount(email: string, password: string, staffName: string) {
    try {
      this.isLoading.set(true);
      
      // Check if current user is admin
      if (this.userRole() !== 'admin') {
        throw new Error('Only admins can create staff accounts');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document with staff role
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: email,
        name: staffName,
        role: 'staff',
        createdAt: new Date(),
        createdBy: this.currentUser()?.uid
      });
      
      this.errorMessage.set('');
      return result.user;
    } catch (error: any) {
      this.errorMessage.set(error.message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Login user
  async loginUser(email: string, password: string) {
    try {
      this.isLoading.set(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.errorMessage.set('');
      return result.user;
    } catch (error: any) {
      this.errorMessage.set(error.message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Logout user
  async logoutUser() {
    try {
      await signOut(auth);
      this.userRole.set(null);
      this.errorMessage.set('');
    } catch (error: any) {
      this.errorMessage.set(error.message);
      throw error;
    }
  }

  // Add appointment to Firestore
  async addAppointment(appointmentData: any) {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        createdAt: new Date(),
        userId: this.currentUser()?.uid || 'anonymous'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  }

  // Get all appointments
  async getAppointments() {
    try {
      const snapshot = await getDocs(collection(db, 'appointments'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Get user's appointments
  async getUserAppointments(userId: string) {
    try {
      const q = query(collection(db, 'appointments'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  }

  // Update appointment
  async updateAppointment(appointmentId: string, data: any) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Delete appointment
  async deleteAppointment(appointmentId: string) {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  // Get all staff members
  async getAllStaff() {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'staff'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  // Delete staff account (admin only)
  async deleteStaffAccount(staffId: string) {
    try {
      if (this.userRole() !== 'admin') {
        throw new Error('Only admins can delete staff accounts');
      }
      await deleteDoc(doc(db, 'users', staffId));
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
}
