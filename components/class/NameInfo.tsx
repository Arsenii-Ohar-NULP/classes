import React from "react";
import Class from "components/classes/Class";

interface NameInfoProps {
    classInfo: Class;
}

export default function NameInfo({classInfo}: NameInfoProps) {
    function getFullName(){
        return `${classInfo['teacher_first_name']} ${classInfo['teacher_last_name']}`;
    }

    return <div>
        <p className="fs-5 my-0">
            {getFullName()}
        </p>
    </div>
}
