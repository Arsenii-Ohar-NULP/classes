import React from 'react';
import User from "../../account/User";

interface StudentsStatsProps{
    students: User[];
}


export const StudentsStats = ({students}: StudentsStatsProps) => {
    const studentsNumber = students?.length;

    if (!studentsNumber) return null;
    return (<div className={'text-end p-2'}>
        {studentsNumber} students
    </div>)
}