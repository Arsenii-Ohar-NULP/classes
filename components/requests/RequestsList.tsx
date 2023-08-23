import RequestCard from "./RequestCard";
import React from "react";
import {JoinRequest} from "../class/JoinRequest";

interface RequestsListProps {
    requests: JoinRequest[];
}

export default function RequestsList({requests}: RequestsListProps) {
    return <div className="d-flex justify-content-center">
        {requests?.map((request, index) => {
            return (
                <RequestCard
                    key={`${request?.userId}-${request?.classId}`}
                    request={request}
                />
            );
        })}
    </div>;
}