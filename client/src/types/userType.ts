export type TSignIn = {
  email: string;
  password: string;
};

export type TSignUp = TSignIn & {
  firstName: string;
  lastName: string;
};
export type TToken = {
  token: string;
};

export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}
