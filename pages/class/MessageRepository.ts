import Forbidden from 'pages/errors/Forbidden';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { AuthService } from 'pages/login/authService';

export default class MessageRepository {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private getApiUrl() {
    return process.env['NEXT_PUBLIC_API_URL'];
  }

  private getMessagesHeader(): HeadersInit {
    const token = this.authService.getAccessToken();

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  private getMessagesEndpoint(classId: number) {
    return this.getApiUrl() + `/api/v1/class/messages/${classId}`;
  }

  private handleErrors(response: Response) {
    if (response.status == 401) {
      throw new InvalidCredentials('Please log in to see the messages');
    }
    if (response.status == 403){
      throw new Forbidden("Join this class to see the messages");
    }

    throw new Error("Couldn't get messages. Please try again later");
  }

  private async fetchMessages(classId: number) {
    const messagesEndpoint = this.getMessagesEndpoint(classId);
    const messagesHeader = this.getMessagesHeader();

    return await fetch(messagesEndpoint, {
      method: 'GET',
      headers: messagesHeader,
    });
  }

  public async getMessages({
    classId,
  }: {
    classId: number;
  }): Promise<Message[]> {
    const response = await this.fetchMessages(classId);

    if (!response.ok) {
      this.handleErrors(response);
    }

    return (await response.json()) as Message[];
  }
}
