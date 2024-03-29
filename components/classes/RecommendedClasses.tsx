"use client"
import React, {useDeferredValue, useMemo} from 'react';
import Link from 'next/link';
import styles from 'components/classes/classes.module.scss';
import Class from 'components/classes/Class';
import {ClassUI} from 'components/classes/ClassUI';
import {useAppSelector} from 'components/redux/store';
import clsx from 'clsx';
import {searchClasses} from './ClassSearch';
import {useGetClassesQuery, useGetUserClassesQuery} from "../redux/classesApi";
import {Loading} from "../class/Loading";

export default function RecommendedClasses() {
    const userId = useAppSelector(state => state?.auth?.user?.id);
    const {
        data: loadedClasses,
        isLoading: isLoadingClasses,
        error: classesError} = useGetClassesQuery();
    const {
        data: userClasses,
        isLoading: isLoadingUserClasses,
        error: userClassesError} = useGetUserClassesQuery(userId);
    const search = useAppSelector((state) => state?.search?.classes);
    const deferredSearch = useDeferredValue(search);

    const classes = useMemo<Class[]>(() => {
        if (isLoadingClasses || isLoadingUserClasses ||
            classesError || userClassesError)
            return null;

        const currentClasses = loadedClasses.filter(
            (cls) => !userClasses?.some((userCls) => userCls.id === cls.id)
        );

        return searchClasses(currentClasses, deferredSearch);
    }, [loadedClasses, deferredSearch, userClasses]);

    if (isLoadingClasses || isLoadingUserClasses){
        return <Loading/>;
    }

    if (classes?.length === 0) {
        return <div data-testid={'recommended-classes-empty'}>
            There are no classes available for you! Wait for new ones, please.
        </div>
    }

    return (
        <div>
            <div
                className={'d-flex flex-wrap justify-content-center'}
                data-testid={'recommended-div'}
            >
                {classes &&
                    classes.map((cls) => (
                        <Link
                            className={clsx(
                                'text-decoration-none text-dark',
                                styles['class-block'],
                                styles['class-flex']
                            )}
                            key={cls.id}
                            href={`/main/classes/${cls.id}`}
                        >
                            <ClassUI key={cls.id} cls={cls}/>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
