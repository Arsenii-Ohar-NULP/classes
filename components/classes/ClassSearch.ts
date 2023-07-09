import Class from './Class';
import Fuse from 'fuse.js';

export const searchClasses = (currentClasses: Class[], search: string) => {
    if (!search) return currentClasses;
    const options = {
      includeScore: true,
      // Search in `author` and in `tags` array
      keys: [{name: 'title', weight: 3}, {name: 'description', weight: 1}, ],
    };

    const fuse = new Fuse(currentClasses, options);
    const result = fuse.search(search);
    return result.map((resultItem) => resultItem.item);
  };