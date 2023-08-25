import React from "react";
import Class from "components/classes/Class";

interface DescriptionInfoProps{
    classInfo: Class;
}

export default function DescriptionInfo({classInfo}: DescriptionInfoProps){
    return <div>
                <p className="fs-6">{classInfo.description}</p>
            </div>
}