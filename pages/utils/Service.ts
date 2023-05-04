import Forbidden from '../errors/Forbidden';
import InvalidCredentials from '../errors/InvalidCredentials';

interface IErrors {
  InvalidCredentials: string;
  Forbidden: string;
  Error: string;
  JsonError: string;
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
    const response = args
      ? await fetchFunction(args)
      : await (fetchFunction as () => Promise<Response>)();
  
    if (!response.ok) {
      // TODO: You better change this to a custom one
      if (response.status == 401) {
        throw new InvalidCredentials(errors[InvalidCredentials.name]);
      }
  
      if (response.status == 403) {
        throw new Forbidden(errors[Forbidden.name]);
      }
  
      throw new Error(errors[Error.name]);
    }
  
    try {
      return await response.json();
    } catch (e) {
      // TODO: Change this to a custom Error if possible
      throw new Error(errors['JsonError']);
    }
  };