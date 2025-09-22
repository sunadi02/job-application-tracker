// src/components/AddApplicationForm.tsx
'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Use your correct import path
import { JobApplication } from '@/types'; // Use your correct import path

export default function AddApplicationForm() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<JobApplication['status']>('Applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in!');
      return;
    }

    // Create a new application object
    const newApplication: Omit<JobApplication, 'id'> = {
      company,
      role,
      status,
      appliedDate,
      note,
      userId: user.uid, // The most important part: link to the user
    };

    try {
      // Add a new document to the "applications" collection in Firestore
      const docRef = await addDoc(collection(db, 'applications'), newApplication);
      console.log('Document written with ID: ', docRef.id);

      // Reset the form
      setCompany('');
      setRole('');
      setStatus('Applied');
      setNote('');
      // Keep the date as today for quick adding another
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">➕ Add New Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role/Title *
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobApplication['status'])}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          <div>
            <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date Applied *
            </label>
            <input
              type="date"
              id="appliedDate"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Application'}
        </button>
      </form>
    </div>
  );
}