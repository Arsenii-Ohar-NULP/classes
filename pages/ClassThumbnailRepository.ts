export default class ClassThumbnailRepository{
    private getEndpointUrl(id: number){
        const apiUrl = process.env["NEXT_PUBLIC_API_URL"];
        return `${apiUrl}/api/v1/class/img/${id}`;
    }

    private getHeaders(): HeadersInit{
        return {
            'Content-Type': 'application/json',
        };
    }
    
    private async fetchThumbnail(id: number){
        const url = this.getEndpointUrl(id);
        const headers = this.getHeaders();
        const response = await fetch(
            url,
            {
                method: 'GET',
                headers: headers
            }
        )

        return response;
    }

    public async findClassThumbnail(id: number): Promise<string>{
        const response = await this.fetchThumbnail(id);

        if (!response.ok){
            throw new Error(`Couldn't get image of a class ${id}`)
        }

        try{
            const json = await response.json();
            
            return json['thumbnail'];
        }
        catch(e){
            throw new Error(`Couldn't get JSON data from the response of thumbnail request of class ${id}`);
        }
    }
}