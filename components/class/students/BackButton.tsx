import React from 'react';
import {useRouter} from "next/router";
import {Button} from "react-bootstrap";
import backIcon from 'icons/back.svg';
import Image from "next/image";

export const BackButton = () => {
    const router = useRouter();

    const goBack = async () => {
        router.back();
    }

    return <Button variant={'outline-light'} className={'p-1 rounded-pill'} onClick={goBack}>
        <Image src={backIcon} alt={'Back'} height={24} width={24} />
    </Button>
}