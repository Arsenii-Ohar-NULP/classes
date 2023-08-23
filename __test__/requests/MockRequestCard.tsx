import * as React from 'react';
import {JoinRequest} from "../../components/class/JoinRequest";

export function MockRequestCard({
    request
                                }: {
    request: JoinRequest
}){
    return <div>
        {request?.userId}-{request?.classId}
    </div>;
}
