export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface User_State {
  username: string;
  token: string;
}

export interface Conversations {
  id: number;
  person: string;
  avatar: string;
  caption: string;
  time: string;
  sent: boolean;
}
