import DefaultError from 'components/errors/DefaultError';
import Forbidden from '../errors/Forbidden';
import InvalidCredentials from '../errors/InvalidCredentials';
import {BadRequest} from 'components/errors/BadRequest';
import NotFound from "../errors/NotFound";

interface IErrors {
    InvalidCredentials?: string;
    Forbidden?: string;
    Error?: string;
    JsonError?: string;
    BadRequest?: string;
    NotFound?: string;
}

export const request = async <T>({
                                     fetchFunction,
                                     errors,
                                     args,
                                 }: {
    fetchFunction: (() => Promise<Response>) | ((o: object) => Promise<Response>);
    errors: IErrors;
    args?: object;
}): Promise<T> => {
    const throwError = (error: DefaultError) => {
        throw error;
    };

    const getDefaultMessages = () => {
        return {
            400: 'Bad Request: something is wrong with the client request',
            json: 'Server Error',
            404: 'Not Found: no such resource exists'
        };
    };

    const getStatusImplementations = (errorMessages) => {
        const defaultMessages = getDefaultMessages();

        return {
            401: () =>
                throwError(
                    new InvalidCredentials(
                        errorMessages[InvalidCredentials.name]
                            ? errorMessages[InvalidCredentials.name]
                            : defaultMessages[401]
                    )
                ),
            403: () =>
                throwError(
                    new Forbidden(
                        errorMessages[Forbidden.name]
                            ? errorMessages[Forbidden.name]
                            : defaultMessages[403]
                    )
                ),
            400: () =>
                throwError(
                    new BadRequest(
                        errorMessages[BadRequest.name]
                            ? errorMessages[BadRequest.name]
                            : defaultMessages[400]
                    )
                ),
            404: () =>
                throwError(
                    new NotFound(
                        errorMessages[NotFound.name]
                            ? errorMessages[NotFound.name]
                            : defaultMessages[404]))
        };
    };

    const response = args
        ? await fetchFunction(args)
        : await (fetchFunction as () => Promise<Response>)();

    if (!response.ok) {
        const statusImplementations = getStatusImplementations(errors);
        if (Object.hasOwn(statusImplementations, response.status)) {
            statusImplementations[response.status]();
        } else {
            throw new Error(errors[Error.name]);
        }
    }

    try {
        return await response.json();
    } catch (e) {
        const defaultMessages = getDefaultMessages();
        const message = errors['JsonError']
            ? errors['JsonError']
            : defaultMessages.json;

        throw new Error(message);
    }
};
