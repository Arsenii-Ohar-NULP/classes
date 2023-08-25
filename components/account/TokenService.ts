export const accessTokenKey = 'accessToken';

export function getAccessToken(): string {
    const localToken = localStorage.getItem(accessTokenKey);
    const sessionToken = sessionStorage.getItem(accessTokenKey);

    return localToken ? localToken : sessionToken;
}