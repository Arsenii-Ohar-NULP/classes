"use client";
import React, {useEffect, useMemo, useState} from "react";
import User from "components/account/User";
import {useAppSelector} from "components/redux/store";
import {useLogout} from "components/login/AuthService";
import {searchStudents} from "components/classes/StudentsSearch";
import {getStudents} from "components/class/students/StudentsService";
import InvalidCredentials from "components/errors/InvalidCredentials";
import Head from "next/head";
import {BackButton} from "components/class/students/BackButton";
import {StudentsSearchBar} from "components/class/students/StudentsSearchBar";
import {StudentsList} from "components/class/students/StudentsList";
import {StudentsStats} from "components/class/students/StudentsStats";

export default function StudentsPage({params: {id}}: {params: {id: number}}) {
    const classId = id;
    const [fetchedStudents, setFetchedStudents] = useState<User[]>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const search = useAppSelector((state) => state?.search?.students);
    const logout = useLogout();

    const students = useMemo(() => {
        if (!fetchedStudents) return;
        return searchStudents(fetchedStudents, search);
    }, [fetchedStudents, search])

    useEffect(() => {
        setIsLoading(true);
        getStudents(classId)
            .then((students) => {
                setFetchedStudents(students.sort((a, b) => a.lastName.localeCompare(b.lastName)));
            })
            .catch((error) => {
                if (error instanceof InvalidCredentials) {
                    logout();
                }
            })
            .finally(() => setIsLoading(false));
    }, [classId]);

    const onDelete = (deleteStudentId: number) => {
        setFetchedStudents(fetchedStudents.filter((student) => student.id !== deleteStudentId));
    }

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
            <StudentsList students={students} isLoading={isLoading} cls={classId} onDelete={onDelete}/>
            <StudentsStats students={students}/>
        </div>
    </>
}