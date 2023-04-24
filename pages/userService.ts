import User from './User';
import InvalidCredentials from './errors/InvalidCredentials';

export default class UserService{
    private getEndpointUrl(){
        return process.env["NEXT_PUBLIC_API_URL"] + "/api/v1/user";
    }

    private getEndpointHeaders(token: string): HeadersInit{
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    private async fetchUserInfo(token: string){
        const endpointUrl = this.getEndpointUrl();
        const headers = this.getEndpointHeaders(token);

        return await fetch(
            endpointUrl,
            {
                method: 'GET',
                headers: headers,
            }
        );

    }
    public async getUserInfo(token: string): Promise<User>{
        const response = await this.fetchUserInfo(token);

        if (!response.ok){
            if (response.status == 401){
                throw new InvalidCredentials("Couldn't get user info due");
            }

            throw new Error("Couldn't get user info");
        }

        return await response.json();
    }
}

