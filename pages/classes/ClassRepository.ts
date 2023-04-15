import { AuthService } from '../authService';
import { ApiUrlEnvKey } from '../contexts';
import Class from "./Class";

export default class ClassRepository{
    private authManager: AuthService;
    private getClassesEndpoint = "/api/v1/class";
    constructor(authService: AuthService){
        this.authManager = authService;
    }


    private getHeaders(): HeadersInit{
        const accessToken = this.authManager.getAccessToken();
        if (!accessToken){
            throw new Error("Access Token is missing somehow.")
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        } 
    }

    private getEndpointUrl(): string{
        return process.env["NEXT_PUBLIC_API_URL"] + this.getClassesEndpoint;
    }

    private async getAllClasses(): Promise<Response> {
        const getClassesEndpoint = this.getEndpointUrl();
        const getClassesHeader = this.getHeaders();

        return await fetch(
            getClassesEndpoint,
            {
                method: 'GET',
                headers: getClassesHeader
            }
        );
    }
    
    public async findAll(): Promise<Class[]> {
        const response = await this.getAllClasses();
        
        if (!response.ok){
            // TODO: You better change this to a custom one
            throw new Error("Couldn't get any classes. Try again later");
        }
        
        try{
            return await response.json();
        }
        catch(e){
            // TODO: Change this to a custom Error if possible
            throw new Error("Couldn't get json from classes response.");
        }
    }
}