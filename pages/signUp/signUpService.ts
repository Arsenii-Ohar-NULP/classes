import User from 'pages/User';

export default class SignUpService{
    private getHeaders(): HeadersInit{
        return {
            "Content-Type": 'application/json'
        };
    }

    private getEndpointUrl(): string{
        return process.env['NEXT_PUBLIC_API_URL'] + '/api/v1/user';
    }

    private async getErrorMessage(response){
        const typicalMessage = "Something is wrong, try again later";
        let message: string;
        try{
            const json = await response.json();
            message = json?.msg ? json.msg : typicalMessage;
        }
        catch(e){
            message = typicalMessage;
        }

        throw new Error(message);
    }

    public async signUp(user: User){
        const endpointUrl = this.getEndpointUrl();
        const headers = this.getHeaders();

        const response = await fetch(
            endpointUrl,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(user)
            }
        );
        
        if (!response.ok){
            await this.getErrorMessage(response);
        }
    }
}