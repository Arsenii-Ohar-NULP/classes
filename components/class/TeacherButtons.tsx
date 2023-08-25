import {useAppSelector} from "../redux/store";
import Class from "components/classes/Class";
import EditClassButton from "./EditClassButton";
import {StudentsButton} from "./StudentsButton";
import React from "react";

interface TeacherButtonsProps{
    classInfo: Class;
    switchEditMode: VoidFunction;
}

export default function TeacherButtons({classInfo, switchEditMode}: TeacherButtonsProps){
    const userId = useAppSelector(state => state?.auth?.user?.id);
    if (userId != classInfo?.teacher_id){
        return;
    }

    return <div className={'d-flex flex-row align-items-center'}>
                            <EditClassButton handleClick={switchEditMode}/>
                            <StudentsButton classId={classInfo?.id}/>
                        </div>
}