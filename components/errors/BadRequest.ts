import DefaultError from './DefaultError';

export class BadRequest extends DefaultError{
    constructor(message: string){
        super(message, 400);
    }
}