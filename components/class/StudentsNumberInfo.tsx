import React from "react";
import Class from "components/classes/Class";

interface StudentsNumberInfo {
    classInfo: Class;
}

export default function StudentsNumberInfo({classInfo}: StudentsNumberInfo) {

    function getStudentsNumber() {
        const noun = classInfo?.students_number == 1
            ? 'student' :
            'students';
        return `${classInfo?.students_number} ` +
            `${noun}`;
    }

    return <div>
        <p>{getStudentsNumber()}</p>
    </div>
}