import Class from 'components/classes/Class';
import React, {FunctionComponent, useState} from 'react';
import {EditClassInfoForm} from "./EditClassInfoForm";
import TitleInfo from "components/class/TitleInfo";
import NameInfo from "components/class/NameInfo";
import DescriptionInfo from "components/class/DescriptionInfo";
import TeacherButtons from "./TeacherButtons";
import StudentsNumberInfo from "./StudentsNumberInfo";

interface ClassInfoProps {
    classInfo: Class;
    isJoined: boolean;
}


const ClassInfo: FunctionComponent<ClassInfoProps> = ({classInfo, isJoined}) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    // const logout = useLogout();

    if (editMode) {
        return (
            <EditClassInfoForm cls={classInfo} joined={isJoined} stop={() => setEditMode(false)}/>
        )
    }

    return (
        <div className="d-flex flex-column align-items-start flex-grow-1 px-3">
            <TitleInfo classInfo={classInfo} isJoined={isJoined}/>
            <NameInfo classInfo={classInfo}/>
            <StudentsNumberInfo classInfo={classInfo}/>
            <DescriptionInfo classInfo={classInfo}/>
            <TeacherButtons classInfo={classInfo} switchEditMode={() => setEditMode(!editMode)}/>
        </div>
    );
};

export default ClassInfo;
