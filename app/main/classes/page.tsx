"use client";
import React from "react";
import ClassSearchBar from "components/classes/ClassSearchBar";
import RecommendedClasses from "components/classes/RecommendedClasses";
import UserClasses from "components/classes/UserClasses";
import {useAppSelector} from "components/redux/store";

export default function Classes(): React.ReactNode {
    const userId = useAppSelector(state => state?.auth?.user?.id);

    if (!userId){
        return;
    }

    return (
        <div>
            {/* {user && <Greeting firstName={user?.firstName}/>} */}
            <div className="p-2 m-2 text-center">
                <ClassSearchBar/>
                <RecommendedClasses/>
                <UserClasses/>
            </div>
        </div>
    );
}
