export default class Forbidden extends Error{
    constructor(message: string){
        super(message); 
    }
}