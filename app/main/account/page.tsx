"use client";
import {useUserData} from "../../../components/utils/hooks";
import PersonalInfoBar from "../../../components/account/PersonalInfoBar";
import Link from "next/link";
import React from "react";

export default function AccountPage() {
  const user = useUserData();

  if (!user){
    return <></>;
  }
  return (
    <div className="container">
      <h1 className="p-2 text-center">Personal Information</h1>
      <div className="d-flex justify-content-center">
        <PersonalInfoBar user={user}/>
      </div>
      <div className="text-center">
        <Link href={'/main/account/edit'}>
          <button className="btn btn-primary">Edit</button>
        </Link>
      </div>
    </div>
  );
}
