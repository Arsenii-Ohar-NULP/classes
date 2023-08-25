import React from "react";

interface JoinedBadge {
    isJoined: boolean;
}

export default function JoinedBadge({isJoined}: JoinedBadge) {
    if (!isJoined) {
        return null;
    }

    return <span className="badge badge-primary align-middle text-dark bg-primary fs-6 me-2">
                Joined
              </span>;
}