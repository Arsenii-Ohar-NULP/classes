import Class from './Class';
import Fuse from 'fuse.js';

const fuseSearch = (currentClasses: Class[], search: string) => {
    const options = {
        includeScore: true, keys: [
            {name: 'title', weight: 3},
            {name: 'description', weight: 1},],
    };

    const fuse = new Fuse(currentClasses, options);
    const result = fuse.search(search);
    return result.map((resultItem) => resultItem.item);
}

export const searchClasses = (currentClasses: Class[], search: string) => {
    if (!search) return currentClasses;
    return fuseSearch(currentClasses, search);
};