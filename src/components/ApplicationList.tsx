'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { JobApplication } from '@/types';

export default function ApplicationList() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    let unsubscribeFromSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        setApplications([]);
        setIsLoading(false);
        if (unsubscribeFromSnapshot) {
          unsubscribeFromSnapshot();
          unsubscribeFromSnapshot = null;
        }
        return;
      }

      const q = query(
        collection(db, 'applications'),
        where('userId', '==', user.uid),
        orderBy('appliedDate', 'desc')
      );

      if (unsubscribeFromSnapshot) unsubscribeFromSnapshot();

      unsubscribeFromSnapshot = onSnapshot(
        q,
        (querySnapshot) => {
          const apps: JobApplication[] = [];
          querySnapshot.forEach((doc) => {
            apps.push({ id: doc.id, ...(doc.data() as Omit<JobApplication, 'id'>) } as JobApplication);
          });

          apps.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
          setApplications(apps);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching applications:', error);
          setIsLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFromSnapshot) unsubscribeFromSnapshot();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteDoc(doc(db, 'applications', id));
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: JobApplication['status']) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied': return '📝';
      case 'Interview': return '📞';
      case 'Offer': return '🎉';
      case 'Rejected': return '❌';
      default: return '📄';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <p className="text-sm text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-400">
          <p className="text-sm text-gray-600 font-medium">Applied</p>
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-600 font-medium">Interview</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.interview}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-400">
          <p className="text-sm text-gray-600 font-medium">Offers</p>
          <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-400">
          <p className="text-sm text-gray-600 font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Main Applications List */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {filteredApplications.length} {filter !== 'all' ? filter : 'total'}
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">No applications found</p>
            <p className="text-gray-400 text-sm">
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Add your first job application above!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-1">{app.company}</h3>
                    <p className="text-gray-600 text-lg">{app.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app.id!, e.target.value as JobApplication['status'])}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(app.status)}`}
                    >
                      <option value="Applied">📝 Applied</option>
                      <option value="Interview">📞 Interview</option>
                      <option value="Offer">🎉 Offer</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDelete(app.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete application"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Applied: {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {app.note && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{app.note}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}