export type TLogin = {
  username: string;
  password: string;
};

export type TSignUp = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type JwtPayload = {
  sub: string;
  username: string;
  role: string;
};

export type TUser = {
  id: string;
  username: string;
  account: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  addressDetail: string | null;
  role: 'admin' | 'customer' | 'farmer' | 'shipper' | 'user';
  createdAt: string;
  updatedAt: string;
};
