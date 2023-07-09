import { editUser, getUserInfo  } from 'components/account/UserService';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import { mockFetch } from './mockFetch';
import { sampleUser } from './data/user';
import Forbidden from 'components/errors/Forbidden';

describe('getUserInfo test', () => {
    mockFetch();
    it('if no token provided, throw InvalidCredentials', () => {
        expect(getUserInfo(null)).rejects.toThrow(InvalidCredentials);
    })

    it('if user exists, return such user', async () => {
        jest.mocked(fetch).mockResolvedValueOnce({
            json: () => Promise.resolve(sampleUser),
            status: 200,
            ok: true
        } as any);
        expect(getUserInfo('ABCD1234')).resolves.toEqual(sampleUser);
    })

    it('if forbidden, throw Forbidden exception', async () => {
        jest.mocked(fetch).mockResolvedValueOnce({
            json: () => Promise.resolve('Forbidden to fetch user data'),
            status: 403,
            ok: false
        } as any);
        expect(getUserInfo('ABCD1234')).rejects.toThrow(Forbidden);
    })

    it('if invalid or expired token, throw InvalidCredentials', async () => {
        jest.mocked(fetch).mockResolvedValueOnce({
            json: () => Promise.resolve('Expired token has been encountered'),
            status: 401,
            ok: false
        } as any);
        expect(getUserInfo('ABCD1234')).rejects.toThrow(InvalidCredentials);
    })
})