import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class Viewport extends DatabaseObject {
    name: string;
    height: number;

    constructor(name: string, height: number) {
        super(["AcDbSymbolTableRecord", "AcDbViewportTableRecord"]);
        this.name = name;
        this.height = height;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "VPORT");
        super.tags(manager);
        manager.push(2, this.name);
        manager.push(40, this.height);
        /* No flags set */
        manager.push(70, 0);
    }
}

export default Viewport;
