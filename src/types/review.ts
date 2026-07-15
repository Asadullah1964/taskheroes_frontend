export interface Review {
  _id: string;

  rating: number;

  comment: string;

  createdAt: string;

  client: {
    _id: string;
    name: string;
    profileImage?: string;
  };

  worker: {
    _id: string;
    name: string;
    profileImage?: string;
  };

  task?: {
    _id: string;
    title: string;
  };
}