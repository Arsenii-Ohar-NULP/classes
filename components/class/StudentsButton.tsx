import React, {MouseEvent} from 'react';
import {useRouter} from "next/navigation";
import {Button} from "react-bootstrap";
import Image from "next/image";
import people from 'icons/people.svg';

interface StudentsButtonProps{
    classId: number;
}
export const StudentsButton = ({classId}: StudentsButtonProps) => {
    const router = useRouter();
    const navigateToStudentsPage = (e: MouseEvent<HTMLButtonElement>) => {
        router.push(`students/${classId}`);
    }
    return <div>
        <Button onClick={navigateToStudentsPage}>
            <Image src={people} alt={'Students Icon'} width={28} height={28}/>
            {' '} Students
        </Button>
    </div>
}