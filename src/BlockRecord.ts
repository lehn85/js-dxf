import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class BlockRecord extends DatabaseObject {
    name: string;

    constructor(name: string) {
        super(["AcDbSymbolTableRecord", "AcDbBlockTableRecord"]);
        this.name = name;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "BLOCK_RECORD");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
        /* Block explodability */
        manager.push(280, 0);
        /* Block scalability */
        manager.push(281, 1);
    }
}

export default BlockRecord;
