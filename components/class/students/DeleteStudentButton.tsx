import React from 'react';
import {Button} from "react-bootstrap";
import deleteIcon from 'icons/delete.svg';
import Image from "next/image";

interface DeleteStudentButtonProps {
    onDelete: VoidFunction
}

export const DeleteStudentButton = ({onDelete}: DeleteStudentButtonProps) => {
    return <Button onClick={onDelete} variant={'danger'} className={'p-1'}>
        <Image src={deleteIcon} alt={'Delete Icon'} height={24} width={24}/>
    </Button>
}