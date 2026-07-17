export interface WorkerProfile {
  title: string;
  bio: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  availability: string;
  completedJobs: number;
  rating: number;
  totalReviews?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "worker";
  profileImage: string;
  location: string;
  isProfileCompleted: boolean;
  workerProfile: WorkerProfile | null;
}

export interface Worker {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  location?: string;
  workerProfile?: WorkerProfile;
}