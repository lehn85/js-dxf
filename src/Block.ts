import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class Block extends DatabaseObject {
    name: string;
    end: DatabaseObject;
    recordHandle: string | null;

    constructor(name: string) {
        super(["AcDbEntity", "AcDbBlockBegin"]);
        this.name = name;
        this.end = new DatabaseObject(["AcDbEntity", "AcDbBlockEnd"]);
        this.recordHandle = null;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "BLOCK");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
        /* Block top left corner */
        manager.point(0, 0);
        manager.push(3, this.name);
        /* xref path name - nothing */
        manager.push(1, "");

        //XXX dump content here

        manager.push(0, "ENDBLK");
        this.end.tags(manager);
    }
}

export default Block;
