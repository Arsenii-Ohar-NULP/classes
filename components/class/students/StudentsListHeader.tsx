import React from 'react';
import clsx from "clsx";

export function StudentsListHeader() {
    return <thead className={'border px-2'}>
    <tr>
        <th className={'text-uppercase align-middle'} scope={'col'}>
            <div className={'ms-3'}>
            Student
            </div>
        </th>
        <th className={'text-uppercase align-middle'} scope={'col'}>
            Email
        </th>
        <th className={'text-uppercase align-middle'} scope={'col'}>
            Phone Number
        </th>
    </tr>
    </thead>
}