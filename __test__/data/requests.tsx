import { JoinRequest } from 'components/class/JoinRequest'

export const getRequestsWithClassId = (classId: number, number: number) => {
    const requests: JoinRequest[] = []
    for (let i = 0; i < number; i++){
        requests.push(
            {
                userId: i + 1,
                classId: classId
            }
        )
    }

    return requests;
}