export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  location?: string;
  workerProfile?: {
    completedJobs?: number;
    rating?: number;
    totalReviews?: number;
    [key: string]: unknown;
  };
}

export type ApplicationStatus =
  | "Pending"
  | "Accepted"
  | "Rejected";

export interface Application {
  _id: string;
  proposal: string;
  expectedPrice: number;
  status: ApplicationStatus;
  createdAt: string;

  worker: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
}

export type TaskStatus =
  | "Open"
  | "Assigned"
  | "Completed"
  | "Cancelled";

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  deadline: string;
  status: TaskStatus;

  client: User;

  applications: Application[];

  assignedWorker?: {
    _id: string;
    name: string;
    profileImage?: string;
  };

  paymentStatus?: "unpaid" | "in_escrow" | "released" | "refunded";
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  city?: string;

  hasReviewed?: boolean;
  createdAt: string;
  updatedAt: string;
}