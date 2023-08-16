import React, {useEffect, useState} from 'react';
import Class from "components/classes/Class";
import User from "components/account/User";
import clsx from "clsx";
import {getClassStudents} from "./ClassService";
import ProfilePicture from "../ProfilePicture";

interface ClassStudentsProps {
    cls: Class
}

export const ClassStudents = ({cls}: ClassStudentsProps) => {
    const [students, setStudents] = useState<User[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const stub = 5;
        getClassStudents(cls.id, 5)
            .then((fetchedStudents) => setStudents(fetchedStudents))
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return <div className={clsx('d-flex flex-wrap justify-content-center align-items-center')}>
        {students?.map((student) =>
            (<div key={student.id} className={clsx('d-flex flex-column my-2 mx-1 align-items-center')}>
                <ProfilePicture user={student} hoverOn={false}/>
                <p>{student.firstName} {student.lastName}</p>
            </div>)
            )
        }
    </div>
}