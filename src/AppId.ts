import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class AppId extends DatabaseObject {
    name: string;

    constructor(name: string) {
        super(["AcDbSymbolTableRecord", "AcDbRegAppTableRecord"]);
        this.name = name;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "APPID");
        super.tags(manager);
        manager.push(2, this.name);
        /* No flags set */
        manager.push(70, 0);
    }
}

export default AppId;
