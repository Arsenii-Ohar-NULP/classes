import React from 'react';
import styles from 'components/classes/classes.module.scss';
import unknownPic from 'public/images/unknown.jpg';
import Class from './Class';
import clsx from "clsx";
import {useGetClassThumbnailQuery} from "../redux/classesApi";
import {Loading} from "../class/Loading";

export default function ClassThumbnail({cls}: { cls: Class }) {
    const {data, isLoading, error} = useGetClassThumbnailQuery(cls?.id);
    const image = data ? `data:image/png; base64, ${data.thumbnail}` : unknownPic.src;

    if (isLoading)
        return <Loading/>

    return (
        !isLoading && <div>
            <img
                className={
                    clsx('rounded text-center border border-dark shadow', styles['thumbnail'])
                }
                alt={cls.title}
                src={image}
                data-testid={'thumbnail'}
            />
        </div>
    );
}
