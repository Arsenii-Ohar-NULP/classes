import React, {useEffect, useState} from 'react';
import {useLogout} from 'components/login/AuthService';
import ProfilePicture from 'components/ProfilePicture';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import {JoinRequest} from "../class/JoinRequest";
import {useAcceptRequestMutation, useDeclineRequestMutation} from "../redux/requestsApi";
import {useGetUserByIdQuery} from "../redux/userApi";

enum ResolvingState {
    NOT_RESOLVING,
    ACCEPTING,
    DECLINING,
}

export default function RequestCard({
                                        request,
                                    }: {
    request: JoinRequest;
}) {
    const {userId} = request;
    const [resolveStatus, setResolveStatus] = useState<ResolvingState>(
        ResolvingState.NOT_RESOLVING
    );
    const [acceptRequest] = useAcceptRequestMutation();
    const [declineRequest] = useDeclineRequestMutation();
    const {data: user,  error: userInfoError} = useGetUserByIdQuery(userId);
    const logout = useLogout();

    useEffect(() => {
        if (userInfoError) {
            if ("status" in userInfoError) {
                const status = userInfoError['status'];
                if (status === 401 || status === 403){
                    logout()
                }
            }
        }
    }, [userInfoError]);

    function accept() {
        setResolveStatus(ResolvingState.ACCEPTING);
        acceptRequest(request).unwrap()
            .catch((error) => {
                if (error instanceof InvalidCredentials) {
                    logout();
                }
            })
            .finally(() => setResolveStatus(ResolvingState.NOT_RESOLVING));
    }

    function decline() {
        setResolveStatus(ResolvingState.DECLINING);

        declineRequest(request)
            .catch((error) => {
                if (error instanceof InvalidCredentials) {
                    logout();
                }
            })
            .finally(() => setResolveStatus(ResolvingState.DECLINING));
    }

    return (
        <div className="card m-2 text-center d-flex flex-row justify-content-center p-3 align-items-center gap-2">
            <ProfilePicture user={user} hoverOn={false}/>
            <div>
                {user?.firstName} {user?.lastName}
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-wrap gap-1">
                <button
                    className="btn btn-success"
                    onClick={accept}
                    disabled={resolveStatus !== ResolvingState.NOT_RESOLVING}
                >
                    Accept
                    {resolveStatus === ResolvingState.ACCEPTING && (
                        <span
                            className="spinner-border spinner-border-sm text-light ms-1"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={decline}
                    disabled={resolveStatus !== ResolvingState.NOT_RESOLVING}
                >
                    Decline
                    {resolveStatus === ResolvingState.DECLINING && (
                        <span
                            className="spinner-border spinner-border-sm text-light ms-1"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    )}
                </button>
            </div>
        </div>
    );
}
