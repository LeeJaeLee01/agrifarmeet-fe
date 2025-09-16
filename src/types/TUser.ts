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
