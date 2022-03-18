export interface User_State {
  access_token: string;
  user: {
    username: string;
  };
}

export interface Conversations {
  id: number;
  person: string;
  avatar: string;
  caption: string;
  time: string;
  sent: boolean;
}
