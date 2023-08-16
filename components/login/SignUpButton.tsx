import React from "react";
import {useRouter} from "next/navigation";

interface SignUpButtonProps {
    router: ReturnType<typeof useRouter>,
    getUsername: () => string
}

export function SignUpButton({router, getUsername}: SignUpButtonProps) {
    return (
        <button
            className="btn btn-secondary rounded-pill px-3"
            type="button"
            onClick={() => {
                const username = getUsername();
                if (username) {
                    router.push(`/auth/signUp/?username=${username}`);
                } else {
                    router.push("/auth/signUp");
                }
            }}
        >
            Sign up
        </button>
    );
}