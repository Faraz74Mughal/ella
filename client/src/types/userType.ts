export type TSignIn  ={
    email:string;
    password:string
}

export type TSignUp  =TSignIn&{
    firstName:string;
    lastName:string
}