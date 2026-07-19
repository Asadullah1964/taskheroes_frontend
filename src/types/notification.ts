export interface Notification {
  _id: string;

  receiver: string;

  sender?: {
    _id: string;
    name: string;
    profileImage?: string;
  };

  type:
    | "APPLICATION"
    | "APPLICATION_ACCEPTED"
    | "APPLICATION_REJECTED"
    | "MESSAGE"
    | "REVIEW";

  title: string;

  message: string;

  link?: string;

  isRead: boolean;

  createdAt: string;
}