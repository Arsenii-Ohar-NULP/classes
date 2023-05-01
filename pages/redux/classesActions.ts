import { findUserClasses, getUserJoinRequests } from 'pages/class/ClassService';
import { classesActions } from './classes';




export function fetchUserData(userId: number) {
    return async dispatch => {
        const fetchUserClasses = async (dispatch) => {
            const userClasses = await findUserClasses(userId);
            dispatch(classesActions.putUserClasses(userClasses));
        }

        const fetchJoinRequests = async (dispatch) => {
            const joinRequests = await getUserJoinRequests();
            dispatch(classesActions.putJoinRequests(joinRequests));
        }

        await fetchUserClasses(dispatch);
        await fetchJoinRequests(dispatch);
    }
}