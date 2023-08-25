"use client";
import React from 'react';
import Head from 'next/head';
import {useState} from 'react';
import {notFound} from 'next/navigation';
import {useLoginRedirect, useSocket} from 'components/utils/hooks';
import {MessagesBar} from 'components/class/messages/MessagesBar';
import ClassThumbnail from 'components/classes/ClassThumbnail';
import {Loading} from 'components/class/Loading';
import ClassInfo from 'components/class/ClassInfo';
import ClassInfoManagement from 'components/class/ClassInfoManagement';
import {useGetClassByIdQuery} from "components/redux/classesApi";

export default function ClassPage({params: {id}}: { params: { id: string } }) {
    const {data: cls, error, isLoading} = useGetClassByIdQuery(Number.parseInt(id));
    const [joined, setJoined] = useState<boolean>(false);

    useLoginRedirect();
    useSocket();


    if (error) {
        console.log(error);
        notFound();
    }

    if (isLoading)
        return (
            <div className="h-100 d-flex justify-content-center align-items-center">
                <Loading/>
            </div>
        );

    return (
        <div>
            <Head>
                <title>Classes - {cls?.title ? cls.title : 'loading'}</title>
            </Head>
            <div className="container">
                <div className="container card bg-secondary text-white w-auto rounded shadow mt-sm-1 py-2">
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                        <ClassThumbnail cls={cls}/>
                        <ClassInfo
                            classInfo={cls}
                            isJoined={joined}
                        />
                        <ClassInfoManagement cls={cls}/>
                    </div>
                </div>

                <MessagesBar cls={cls} onForbidden={() => setJoined(false)}/>
            </div>
        </div>
    );
}
