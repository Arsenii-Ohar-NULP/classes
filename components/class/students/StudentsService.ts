import {getAccessToken} from "components/login/AuthService";
import InvalidCredentials from "components/errors/InvalidCredentials";
import {request} from "components/utils/Service";
import User from "../../account/User";

export interface ClassUserDTO{
        class: number;
        student: number;
}

const getAuthHeaders = (): HeadersInit => {
    const token = getAccessToken();
    console.log(token);

    if (!token) {
        throw new InvalidCredentials('You should be signed in to access user classes.');
    }

    return {
        'Content-Type': 'application/json', Authorization: `Bearer ${token}`,
    };
};

const fetchStudents = async ({classId}: {classId: number})=> {
    const endpointUrl = `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/${classId}/student`
    const headers = getAuthHeaders();

    return await fetch(endpointUrl,
        {
            method: 'GET',
            headers
        })
}
const deleteStudentFromClass = async (classUser: ClassUserDTO) =>{
    const endpoint = `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/class/student`;
    const headers = getAuthHeaders();

    return await fetch(
        endpoint,
        {
            method: 'DELETE',
            headers,
            body: JSON.stringify(classUser)
        },
    )
}
export const getStudents = async (classId: number): Promise<User[]> => {
    return await request<User[]>(
        {
            fetchFunction: fetchStudents,
            errors: {
                InvalidCredentials: "You should be logged in to fetch students",
                Forbidden: "You have no right to fetch students of this class",
                Error: "Something went wrong while fetching students of a class",
                JsonError: "Couldn't fetch JSON from the response of fetching students.",
                NotFound: "No such class has been found"
            },
            args: {classId}

})
}


export const removeStudentFromClass = async (classUser: ClassUserDTO) => {
        return await request(
            {
            fetchFunction: deleteStudentFromClass,
                errors: {
                    InvalidCredentials: `You have to log in to delete a student from a class=${classUser.class}`,
                    Forbidden: `You have no right to remove a user from a class=${classUser.class}`,
                    Error: `Something went wrong while deleting a student from a class=${classUser.class}`,
                    JsonError: `Something went wrong while parsing JSON from a response of deleting a student from a class=${classUser.class}`,
                    NotFound: `Can't find such class and student`
                },
                args: classUser
            }
        )
}