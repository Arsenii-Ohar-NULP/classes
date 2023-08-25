import React from 'react';
import Class from "components/classes/Class";
import JoinedBadge from "./JoinedBadge";
import TeacherBadge from "./TeacherBadge";

interface TitleProps {
    classInfo: Class,
    isJoined: boolean;
}


export default function TitleInfo({classInfo, isJoined}: TitleProps) {
    return <div className="pt-lg-3 pb-0">
        <p className="m-0 fs-3">
            {classInfo.title + ' '}

            <JoinedBadge isJoined={isJoined}/>
            <TeacherBadge classInfo={classInfo}/>
        </p>
    </div>;
}