import User, { Role } from 'components/account/User';

export const sampleUser: User = {
    id: 1,
    username: 'seniorohar',
    firstName: 'Arsenii',
    lastName: 'Ohar',
    email: 'arsen.ogar@gmail.com',
    phone: '+380987669293',
    role: Role.Teacher   
}

export const sampleFiveUsers: User[] = [
    {
        id: 1,
        username: 'seniorohar',
        firstName: 'Arsenii',
        lastName: 'Ohar',
        email: 'arsen.ogar@gmail.com',
        phone: '+380987669293',
        role: Role.Student
    },
    {
        id: 2,
    username: 'vitalikpikh',
    firstName: 'Vitalik',
    lastName: 'Pikhotskiy',
    email: 'vitaliipik@gmail.com',
    phone: '+380967629253',
    role: Role.Student
    },
    {
        id: 3,
    username: 'svyatoslavshainoha',
    firstName: 'Svyatoslav',
    lastName: 'Shainoha',
    email: 'vitaliipik@gmail.com',
    phone: '+380967629253',
    role: Role.Student
    },
      {
        id: 4,
    username: 'olehrysin',
    firstName: 'Oleh',
    lastName: 'Rysin',
    email: 'olehrysin@gmail.com',
    phone: '+380967323273',
    role: Role.Student
    },
    {
        id: 5,
    username: 'johnadams',
    firstName: 'John',
    lastName: 'Adams',
    email: 'johnadams@gmail.com',
    phone: '+380967723273',
    role: Role.Student
    }
]