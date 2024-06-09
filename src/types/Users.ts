export interface User {
    name: {
      first: string;
      last: string;
    };
    picture: {
      thumbnail: string;
    };
    location: {
      state: string;
      city: string;
    };
    email: string;
    registered: {
      date: string;
    };
  }
  