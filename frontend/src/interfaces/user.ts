export interface Users{
    ID?:number,
    name:string,
    password:string,
    email:string,
    status:boolean,
    role: "admin" |"user"
}