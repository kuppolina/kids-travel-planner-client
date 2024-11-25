export type Organizer = {
  username: string;
  name: string;
  password: string;
  token: string;
  id: number;
  notes: string;
  tasks: string;
  address: string;
  email: string;
  image: string;
};

export type Trip = {
  id: string;
  title: string;
  status: string;
  address: string;
  numberOfKids: string;
  organizerId: number;
  description: string;
  image: string;
};

export type Participant = {
  address: string;
  name: string;
  id: number;
  image: string;
  age: string;
  notes: string;
  dateOfBirth: string;
};
