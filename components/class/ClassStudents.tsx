import React from 'react';
import Class from "components/classes/Class";
import clsx from "clsx";
import ProfilePicture from "../ProfilePicture";
import {useGetStudentsByIdQuery} from "../redux/classesApi";

interface ClassStudentsProps {
    cls: Class
}

export const ClassStudents = ({cls}: ClassStudentsProps) => {
    const {data: students} = useGetStudentsByIdQuery(cls?.id);

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