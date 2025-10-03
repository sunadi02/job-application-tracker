'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { JobApplication } from '@/types';

export default function ApplicationList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  console.log('Fetching applications for user:', user.uid);

    const q = query(
    collection(db, 'applications'),
    where('userId', '==', user.uid),
    orderBy('appliedDate', 'desc') 
  );

    
    const unsubscribe = onSnapshot(
    q, 
    (querySnapshot) => {
      const apps: JobApplication[] = [];
      querySnapshot.forEach((doc) => {
        console.log('Found application:', doc.id, doc.data());
        apps.push({ id: doc.id, ...doc.data() } as JobApplication);
      });
      

      apps.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
      
      setApplications(apps);
      setIsLoading(false);
      console.log('Total applications found:', apps.length);
    },
    (error) => {
      console.error('Error fetching applications:', error);
      setIsLoading(false);
    }
  );
    
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Job Applications</h2>
        <p className="text-gray-600">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Job Applications ({applications.length})</h2>
      
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No applications yet. Add your first job application above!</p>
          <div className="text-sm text-gray-400">
            {/* <p>💡 Tip: Your applications are saved in Firebase Firestore</p>
            <p>but will appear here once we fetch them.</p> */}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{app.company}</h3>
                  <p className="text-gray-600">{app.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                {app.note && (
                  <span className="text-gray-400">Note: {app.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}