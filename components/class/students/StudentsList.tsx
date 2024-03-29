import React, {useState} from 'react';
import User from "components/account/User";
import {StudentCard} from "components/class/students/StudentCard";
import {StudentsListHeader} from "components/class/students/StudentsListHeader";
import clsx from "clsx";
import styles from 'components/class/students/students.module.scss';
import DeleteStudentModal from "./DeleteStudentModal";

interface StudentsListProps {
    students: User[];
    isLoading: boolean;
    cls: number;
    onDelete: (student: number) => void;
}

export const StudentsList = ({students, isLoading, cls, onDelete}: StudentsListProps) => {
    const [deleteStudentId, setDeleteStudentId] = useState<number>(-1);
    if (isLoading) return null;

    return (<div className={'container'}>
        {students?.length == 0 ? <p className={'text-center'} data-testid={'no-students'}>There are no students in this class.</p> :
            <div className={clsx('overflow-scroll', styles['hide-scrollbar'], styles['smooth-shadow'])}>
                <table className={'table shadow m-0'}>
                    <StudentsListHeader/>
                    <tbody>
                    {students?.map((student) =>
                        <StudentCard key={student.id} student={student}
                                     onDelete={() => setDeleteStudentId(student.id)}/>)}
                    </tbody>
                </table>
                <DeleteStudentModal
                    classUser={{student: deleteStudentId, class: cls}}
                    show={deleteStudentId != -1}
                    onDelete={() => onDelete(deleteStudentId)}
                    close={() => setDeleteStudentId(-1)}/>
            </div>
        }
    </div>)
}