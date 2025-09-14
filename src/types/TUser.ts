export type TLogin = {
  username: string;
  password: string;
};

export type TSignUp = {
  email: string;
  password: string;
  phone: string;
  province: string | null;
  district: string | null;
  ward: string | null;
  addressDetail: string;
  address: string;
};

export type JwtPayload = {
  sub: string;
  username: string;
  role: string;
};
