import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class Dictionary extends DatabaseObject {
    children: Record<string, DatabaseObject>;

    constructor() {
        super("AcDbDictionary");
        this.children = {};
    }

    /**
     *
     * @param {string} name
     * @param {DatabaseObject} dictionary
     */
    addChildDictionary(name: string, dictionary: DatabaseObject): void {
        dictionary.ownerObjectHandle = this.handle;
        this.children[name] = dictionary;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "DICTIONARY");
        super.tags(manager);
        /* Duplicate record cloning flag - keep existing */
        manager.push(281, 1);

        const entries = Object.entries(this.children);
        for (const entry of entries) {
            const [name, dic] = entry;
            manager.push(3, name);
            manager.push(350, dic.handle);
        }

        const children = Object.values(this.children);
        for (const c of children) {
            c.tags(manager);
        }
    }
}

export default Dictionary;
