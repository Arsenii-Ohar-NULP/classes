import User from "../account/User";
import Fuse from "fuse.js";

const fuseSearch = (students: User[], search: string) => {
    const options = {
        includeScore: true,
        keys: [
            {name: 'firstName', weight: 3},
            {name: 'lastName', weight: 3},
            {name: 'username', weight: 2},
            {name: 'email', weight: 2},
            {name: 'phone', weight: 5}
        ],
    };

    const fuse = new Fuse(students, options);
    const result = fuse.search(search);
    return result.map((resultItem) => resultItem.item);
}

export const searchStudents = (students: User[], search: string) => {
    if (!search) return students;
    return fuseSearch(students, search);
}