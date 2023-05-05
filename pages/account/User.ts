export enum Role{
    Teacher, Student
}

export default interface User{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;   
}
