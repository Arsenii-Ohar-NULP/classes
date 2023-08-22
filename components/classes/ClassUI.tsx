import React, {Suspense} from 'react';
import Class from 'components/classes/Class';

import ClassThumbnail from './ClassThumbnail';
import {Loading} from "../class/Loading";

export function ClassUI({cls}: { cls: Class }) {
    return (
        <div className={'text-center m-3 p-1'} title={cls.title}>
            <ClassThumbnail cls={cls}/>

            <h5 className="text-wrap mt-3">{cls.title}</h5>
        </div>
    );
}