import LogoPic from "components/utils/Logo";
import Image from "next/image";
import smilingFace from "public/images/Slightly Smiling Face.svg";
import React from "react";

export function TopSection() {
    return <>
        <div className='p-2'>
            <div className='d-flex justify-content-center align-items-center p-2'>
                <LogoPic/>
            </div>
            <hr className='w-100'/>
        </div>
        <p className="fs-5 position-relative"><b>Hi, please log in </b>
            <Image width="28" height="28"
                   src={smilingFace}
                   alt="Smiling Face"/>
        </p></>
}