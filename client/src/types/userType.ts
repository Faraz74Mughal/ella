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

export interface GoogleJwtPayload {
  sub: string;            
  name: string;
  given_name: string;
  family_name: string;
  picture: string;       
  email: string;
  email_verified: boolean;
  role?:string

}


export interface FacebookJwtPayload {
  firstName: string;
  lastName?: string;
  picture?: string;       
  email: string;
  role?:string
}

export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}
