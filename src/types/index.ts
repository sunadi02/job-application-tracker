
export interface JobApplication {
  id?: string; 
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer'; 
  appliedDate: string; 
  note?: string; 
  userId: string; 
}