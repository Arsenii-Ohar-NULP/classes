import InvalidCredentials from 'pages/errors/InvalidCredentials';

interface Credentials{
    username: string;
    password: string;
}
class AuthService{
    accessTokenKey: string;

    constructor(accessTokenKey: string){
        this.accessTokenKey = accessTokenKey;
    }

    private getApiUrl(): string{
        return process.env["NEXT_PUBLIC_API_URL"]; 
    }

    private getLoginUrl(): string {
        return this.getApiUrl() + "/api/v1/user/login";
    }

    private getLoginHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json'
        };
    }

    private async auth(credentials: Credentials){
        const url = this.getLoginUrl();
        const headers = this.getLoginHeaders();
        const response = await fetch(
                url,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(credentials) 
                }
            );

        return response;
    }

    private async getErrorMessage(response: Response): Promise<string>{
        const typicalMessage = "Something is wrong, try again later";
        let message: string;
        try{
            const json = await response.json();
            message = json?.msg ? json.msg : typicalMessage;
        }
        catch(e){
            message = typicalMessage;
        }
        throw new InvalidCredentials(message);
    }

    public getAccessToken() : string {
        const localToken = localStorage.getItem(this.accessTokenKey);
        const sessionToken = sessionStorage.getItem(this.accessTokenKey);

        return localToken ? localToken : sessionToken;
    }

    public async login(credentials: Credentials){
        const response = await this.auth(credentials);
        
        if (!response.ok){
            await this.getErrorMessage(response);
        }

        return (await response.json())['access_token'];
    }
}

class TokenPersistanceService{
    accessTokenKey: string;
    constructor(accessTokenKey: string){
        this.accessTokenKey = accessTokenKey;
    }

    private saveInSession(token) {
        sessionStorage.setItem(this.accessTokenKey, token);
    }
    
    private saveInLocal(token){
        localStorage.setItem(this.accessTokenKey, token);
    }
    
    public saveToken(token, remember) {
        if (!remember){
            this.saveInSession(token);
            return;
        }

        this.saveInLocal(token);
    }

    public removeToken(){
        if (sessionStorage.getItem(this.accessTokenKey)){
            sessionStorage.removeItem(this.accessTokenKey);
        }

        if (localStorage.getItem(this.accessTokenKey)){
            localStorage.removeItem(this.accessTokenKey);
        }
    }
}
export { AuthService, TokenPersistanceService };