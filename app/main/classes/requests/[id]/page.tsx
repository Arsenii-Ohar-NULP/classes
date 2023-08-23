"use client";
import {notFound, useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {logout} from 'components/login/AuthService';
import Head from 'next/head';
import {Loading} from 'components/class/Loading';
import {useAppSelector} from 'components/redux/store';
import {Role} from 'components/account/User';
import {useGetRequestsQuery} from "components/redux/requestsApi";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import RequestsList from "components/requests/RequestsList";

export default function RequestsPage({params: {id}}: { params: { id: string } }) {
    const role = useAppSelector((state) => state?.auth?.user?.role);
    const router = useRouter();
    const {data: requests, error, isLoading} = useGetRequestsQuery(Number.parseInt(id));
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            if ('status' in error) {
                const status = (error as FetchBaseQueryError).status;
                if (status === 404)
                    notFound();
                if (status === 401) {
                    logout(dispatch, router);
                }
            }
        }
    }, [error]);

    useEffect(() => {
        if (role !== Role.Teacher && role !== undefined) {
            notFound()
        }

    }, [role]);

    if (isLoading) {
        return <div className='flex justify-content-center w-100 align-items-center'>
            <Loading/>;
        </div>
    }

    return (
        <div>
            <Head>
                <title>Requests for class</title>
            </Head>
            <div>
                <h4 className="m-3 fs-2 text-center">Requests</h4>
                {requests?.length !== 0 ? (
                    <RequestsList requests={requests}/>
                ) : <div className='text-center fs-4 align-items-center align-middle' data-testid={'no-join-requests'}>
                    There are no join requests.
                </div>}
            </div>
        </div>
    );
}
