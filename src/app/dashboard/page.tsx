// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Use the relative path for now to avoid any alias issues
import { auth } from '../../lib/firebase';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        console.log("User is logged in:", user.email);
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

  // SIMPLE UI FOR TESTING
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Congratulations! You are logged in.</p>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Log Out
      </button>
    </div>
  );
}