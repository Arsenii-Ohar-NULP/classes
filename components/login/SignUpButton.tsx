import {NextRouter} from "next/router";
import React from "react";

export function SignUpButton({router, getUsername}: { router: NextRouter, getUsername: () => string }) {
    return (
        <button
            className="btn btn-secondary rounded-pill px-3"
            type="button"
            onClick={() => {
                const username = getUsername();
                if (username) {
                    router.push(`signUp/?username=${username}`);
                } else {
                    router.push("/signUp");
                }
            }}
        >
            Sign up
        </button>
    );
}