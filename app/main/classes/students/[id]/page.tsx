"use client";
import React, {useEffect, useMemo} from "react";
import {useAppSelector} from "components/redux/store";
import {useLogout} from "components/login/AuthService";
import {searchStudents} from "components/classes/StudentsSearch";
import Head from "next/head";
import {BackButton} from "components/class/students/BackButton";
import {StudentsSearchBar} from "components/class/students/StudentsSearchBar";
import {StudentsList} from "components/class/students/StudentsList";
import {StudentsStats} from "components/class/students/StudentsStats";
import {useGetStudentsByIdQuery} from "components/redux/classesApi";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";

export default function StudentsPage({params: {id}}: { params: { id: number } }) {
    const classId = id;
    const {data: fetchedStudents, isLoading, error} = useGetStudentsByIdQuery(classId);
    const search = useAppSelector((state) => state?.search?.students);
    const logout = useLogout();

    const students = useMemo(() => {
        if (!fetchedStudents) return;
        const sortedStudents = fetchedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
        return searchStudents(sortedStudents, search);
    }, [fetchedStudents, search])

    useEffect(() => {
        if (error) {
            if ('status' in error) {
                const status = (error as FetchBaseQueryError).status;

                if (status === 401) {
                    logout();
                }
            }
        }
    }, [error]);

    return <>
        <Head>
            <title>Students</title>
        </Head>
        <div className={'container'}>
            <div className={'hstack flex-wrap'}>
                <BackButton/>
                <div className={'fs-2 text-center my-2 flex-grow-1'}>
                    Students
                </div>
            </div>
            <StudentsSearchBar/>
            <StudentsList students={students} isLoading={isLoading} cls={classId} onDelete={() => {
                return;
            }}/>
            <StudentsStats students={students}/>
        </div>
    </>
}