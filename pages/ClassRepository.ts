import { AuthService } from 'pages/login/authService';
import Class from 'pages/classes/Class';
import InvalidCredentials from './errors/InvalidCredentials';
import Forbidden from './errors/Forbidden';

export default class ClassRepository {
  private authManager: AuthService;
  private classesEndpoint = '/api/v1/class';
  constructor(authService: AuthService) {
    this.authManager = authService;
  }

  private getApiUrl() {
    return process.env['NEXT_PUBLIC_API_URL'];
  }

  private getJsonHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  private getClassesUrl(): string {
    return this.getApiUrl() + this.classesEndpoint;
  }

  private async getAllClasses(): Promise<Response> {
    const getClassesEndpoint = this.getClassesUrl();
    const getClassesHeader = this.getJsonHeaders();

    return await fetch(getClassesEndpoint, {
      method: 'GET',
      headers: getClassesHeader,
    });
  }
  private getClassEndpoint(id: number): string {
    return this.getApiUrl() + this.classesEndpoint + `/${id}`;
  }

  private async getClass({ id }: { id: number }): Promise<Response> {
    const getClassEndpoint = this.getClassEndpoint(id);
    const getClassHeader = this.getJsonHeaders();

    return await fetch(getClassEndpoint, {
      method: 'GET',
      headers: getClassHeader,
    });
  }

  private async request({
    fetchFunction,
    errorMessage,
    jsonErrorMessage,
    args,
  }: {
    fetchFunction:
      | (() => Promise<Response>)
      | ((o: object) => Promise<Response>);
    errorMessage: string;
    jsonErrorMessage: string;
    args?: object;
  }) {
    const response = args
      ? await this[fetchFunction.name](args)
      : await this[fetchFunction.name]();

    if (!response.ok) {
      // TODO: You better change this to a custom one
      if (response.status == 401){
        throw new InvalidCredentials("You have to log in to see a class.");
      }
      
      if (response.status == 403){
        throw new Forbidden("You don't have rights to access this class. You might want to join it.")
      }

      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (e) {
      // TODO: Change this to a custom Error if possible
      throw new Error(jsonErrorMessage);
    }
  }

  public async findAll(): Promise<Class[]> {
    return await this.request({
      fetchFunction: this.getAllClasses,
      errorMessage: "Couldn't get any classes. Try again later",
      jsonErrorMessage: "Couldn't get json from classes response.",
    });
  }

  public async find(id: number): Promise<Class> {
    return await this.request({
      fetchFunction: this.getClass,
      errorMessage: "Couldn't get a class. Try again later",
      jsonErrorMessage: "Couldn't get json from class response",
      args: { id: id },
    });
  }
}
