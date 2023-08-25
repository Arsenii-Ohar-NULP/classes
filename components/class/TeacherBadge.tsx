import React from "react";
import Class from "components/classes/Class";
import {useAppSelector} from "../redux/store";

interface TeacherBadgeProps{
    classInfo: Class;
}

export default function TeacherBadge({classInfo}: TeacherBadgeProps) {
    const userId = useAppSelector(state => state?.auth?.user?.id);

    if (userId != classInfo.teacher_id) {
        return;
    }

    return <span className="badge badge-primary align-middle text-dark bg-primary fs-6">
                Teacher
              </span>;
}