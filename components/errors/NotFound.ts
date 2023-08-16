import DefaultError from "./DefaultError";

export default class NotFound extends DefaultError{
    constructor(message: string) {
        super(message, 404);
        this.name = NotFound.name;
    }
}