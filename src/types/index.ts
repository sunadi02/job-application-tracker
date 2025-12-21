export interface JobApplication {
  id?: string; 
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; 
  appliedDate: string; 
  note?: string; 
  userId: string; 
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt?: string;
}