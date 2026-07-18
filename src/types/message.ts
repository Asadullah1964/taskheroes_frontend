import { User } from "./conversation";

export interface Message {
  _id: string;

  conversation: string;

  sender: User;

  receiver: string;

  text: string;

  image: string;

  seen: boolean;

  createdAt: string;

  updatedAt: string;
}