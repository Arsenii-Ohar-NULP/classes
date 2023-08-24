import {getAccessToken} from "../account/TokenService";

export const CLASSES_API_URL = `${process.env["NEXT_PUBLIC_API_URL"]}/api/v1`;


export function authHeaders(headers: Headers) {
    const token = getAccessToken()
    if (token) {
        headers.set("authorization", `Bearer ${token}`)
    }

    return headers;
}

