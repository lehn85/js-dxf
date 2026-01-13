import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";

class Table extends DatabaseObject {
    name: string;
    elements: DatabaseObject[];

    constructor(name: string) {
        super("AcDbSymbolTable");
        this.name = name;
        this.elements = [];
    }

    add(element: DatabaseObject): void {
        element.ownerObjectHandle = this.handle;
        this.elements.push(element);
    }

    tags(manager: TagsManager): void {
        manager.push(0, "TABLE");
        manager.push(2, this.name);
        super.tags(manager);
        manager.push(70, this.elements.length);

        this.elements.forEach((element) => {
            element.tags(manager);
        });

        manager.push(0, "ENDTAB");
    }
}

export default Table;
