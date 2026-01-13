import Handle from "./Handle.js";
import TagsManager from "./TagsManager.js";

class DatabaseObject {
    handle: string;
    ownerObjectHandle: string;
    subclassMarkers: string[];
    layer?: any;

    constructor(subclass: string | string[] | null = null) {
        this.handle = Handle.next();
        this.ownerObjectHandle = "0";
        this.subclassMarkers = [];
        if (subclass) {
            if (Array.isArray(subclass)) {
                this.subclassMarkers.push(...subclass);
            } else {
                this.subclassMarkers.push(subclass);
            }
        }
    }

    /**
     *
     * @param {TagsManager} manager
     */
    tags(manager: TagsManager): void {
        manager.push(5, this.handle);
        manager.push(330, this.ownerObjectHandle);
        for (const s of this.subclassMarkers) {
            manager.push(100, s);
        }
    }
}

export default DatabaseObject;
