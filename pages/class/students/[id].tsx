import React, {useEffect, useMemo, useState} from 'react';
import {StudentsList} from "components/class/students/StudentsList";
import {useRouter} from "next/router";
import {useLogout} from "../../../components/login/AuthService";
import {getStudents} from "../../../components/class/students/StudentsService";
import InvalidCredentials from "../../../components/errors/InvalidCredentials";
import User from "../../../components/account/User";
import {StudentsStats} from "../../../components/class/students/StudentsStats";
import {StudentsSearchBar} from "../../../components/class/students/StudentsSearchBar";
import {searchStudents} from "../../../components/classes/StudentsSearch";
import {useAppSelector} from "../../../components/redux/store";
import {BackButton} from "../../../components/class/students/BackButton";
import Head from "next/head";

export default function StudentsPage() {
    const router = useRouter();
    const classId = Number.parseInt(router.query.id as string);
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
        <StudentsSearchBar />
        <StudentsList students={students} isLoading={isLoading} cls={classId} onDelete={onDelete}/>
        <StudentsStats students={students}/>
    </div>
        </>
}