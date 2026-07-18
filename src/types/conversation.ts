export interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

export interface Task {
  _id: string;
  title: string;
  status: string;
  category: string;
}

export interface Conversation {
  _id: string;
  client: User;
  worker: User;
  task: Task;

  lastMessage: string;

  lastMessageAt: string;

  createdAt: string;

  updatedAt: string;
}