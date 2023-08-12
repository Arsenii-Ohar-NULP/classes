import {sampleFiveUsers} from "../../data/user";
import {mockFetch} from "../../mockFetch";
import {getStudents} from "../../../components/class/students/StudentsService";
import {getAccessToken} from "../../../components/login/AuthService";
import InvalidCredentials from "../../../components/errors/InvalidCredentials";

    mockFetch();
jest.mock('components/login/AuthService');

describe('Students Service', () => {
    it('should return students, when students are fetched', async () => {
        const students = sampleFiveUsers;
        jest.mocked(getAccessToken).mockReturnValue('ABCD1234');
        jest.mocked(fetch).mockResolvedValue({
            json: () => Promise.resolve(students),
            ok: true,
            status: 200} as any);
        const classId = 0;

        const serviceStudents = await getStudents(classId);
        expect(serviceStudents).toEqual(students);
    })

    it('should throw InvalidCredentials, when service returns 401', () => {
        const students = sampleFiveUsers;
        jest.mocked(getAccessToken).mockReturnValue('ABCD1234');
        jest.mocked(fetch).mockResolvedValue({
            json: () => Promise.resolve(students),
            ok: false,
            status: 401} as any);
        const classId = 0;

        const serviceStudents = getStudents(classId);
        expect(serviceStudents).rejects.toThrow(InvalidCredentials);
    })

    it('should throw InvalidCredentials, when access token is not given', () => {
        const students = sampleFiveUsers;
        jest.mocked(getAccessToken).mockReturnValue(null);
        jest.mocked(fetch).mockResolvedValue({
            json: () => Promise.resolve(students),
            ok: false,
            status: 401} as any);
        const classId = 0;

        const serviceStudents = getStudents(classId);
        expect(serviceStudents).rejects.toThrow(InvalidCredentials);
    })
})