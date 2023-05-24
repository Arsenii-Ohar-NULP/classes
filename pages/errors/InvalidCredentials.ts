import DefaultError from './DefaultError';

export default class InvalidCredentials extends DefaultError{
    constructor(message: string){
        super(message, 401);
        this.name = InvalidCredentials.name;
    }
}