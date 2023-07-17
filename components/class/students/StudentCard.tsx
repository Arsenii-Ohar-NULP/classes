import React, {useState} from 'react';
import User from "../../account/User";
import clsx from "clsx";
import ProfilePicture from "../../ProfilePicture";
import styles from 'components/class/students/students.module.scss';
import {DeleteStudentButton} from "./DeleteStudentButton";
import {VisibleOnHover} from "./VisibleOnHover";

interface StudentCardProps {
    student: User;
    onDelete: VoidFunction
}

export const StudentCard = ({student, onDelete}: StudentCardProps) => {
    const [isHover, setIsHover] = useState<boolean>();
    return <tr
        className={clsx('p-2 w-100 text-start overflow-scroll', styles['neat-text'], styles['student'])}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}>
        <td scope={'row'} className={'d-flex text-center gap-2 align-items-center'}>
            <ProfilePicture user={student} hoverOn={false}/>
            <div>{student.firstName} {student.lastName}</div>
        </td>
        <td scope={'row'}>{student.email}</td>
        <td scope={'row'}>
            <div className={'d-flex gap-3'}>
                {student.phone}
                <VisibleOnHover isHover={isHover}>
                    <DeleteStudentButton onDelete={onDelete}/>
                </VisibleOnHover>
            </div>
        </td>
    </tr>
}