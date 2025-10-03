
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import AddApplicationForm from '@/components/AddApplicationForm'; 
import ApplicationList from '@/components/ApplicationList';
import type { User } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState<User | null>(null);
  

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/login');
    } else {
      console.log('User is logged in:', user);
      setUser(user);
      setUserEmail(user.email || '');
    }
  });
  return () => unsubscribe();
}, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        console.log('User is logged in:', user.email);
        setUserEmail(user.email || '');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
  
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">JobTracker Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-700">Welcome, {user?.displayName || userEmail.split('@')[0]}</p>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddApplicationForm />
        <ApplicationList /> 
      </main>
    </div>
  );
}