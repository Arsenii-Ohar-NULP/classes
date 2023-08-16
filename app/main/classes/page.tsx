'use client';
import React from "react";
import {useLoginRedirect} from "../../../components/utils/hooks";
import {useAppSelector} from "../../../components/redux/store";
import ClassSearchBar from "../../../components/classes/ClassSearchBar";
import RecommendedClasses from "../../../components/classes/RecommendedClasses";
import UserClasses from "../../../components/classes/UserClasses";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Classes'
}

export default function Classes(): React.ReactNode {
  useLoginRedirect();

  return (
    <div>
      {/* {user && <Greeting firstName={user?.firstName}/>} */}
      <div className="p-2 m-2 text-center">
        <ClassSearchBar />
        <RecommendedClasses />
        <UserClasses />
      </div>
    </div>
  );
}
