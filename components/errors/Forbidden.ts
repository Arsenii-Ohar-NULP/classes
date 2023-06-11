import DefaultError from './DefaultError';

export default class Forbidden extends DefaultError{
    constructor(message: string){
        super(message, 403);
    }
}