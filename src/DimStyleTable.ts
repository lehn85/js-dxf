import DatabaseObject from "./DatabaseObject.js";
import Table from "./Table.js";
import TagsManager from "./TagsManager.js";

class DimStyleTable extends Table {
    constructor(name: string) {
        super(name);
        this.subclassMarkers.push("AcDbDimStyleTable");
    }

    tags(manager: TagsManager): void {
        manager.push(0, "TABLE");
        manager.push(2, this.name);
        // Call explicit prototype method from DatabaseObject to match JS behavior or just call generic super.tags(manager) but we need to insert specific table headers first?
        // JS was: DatabaseObject.prototype.tags.call(this, manager);
        // Typescript can access grandparent method via casting or just rely on Table inheriting it?
        // Wait, Table overrides tags(). The JS code bypassed Table.tags() and called DatabaseObject.tags() directly!
        // This effectively ignores Table.tags logic.
        // We can do `super.tags(manager)` if Table.tags didn't exist or we want Table's logic.
        // But Table.tags does `manager.push(0, "TABLE");` etc which is duplicated here.
        // So the intent is to use DatabaseObject's tags (handle, owner, markers) but NOT Table's implementation.
        // In TS we can't easily skip one level of inheritance for super calls.
        // We can refactor Table to separate the metadata tags from the structure tags.
        // Or we just re-implement the logic of DatabaseObject.tags here.

        // Re-implementing DatabaseObject.tags logic:
        manager.push(5, this.handle);
        manager.push(330, this.ownerObjectHandle);
        for (const s of this.subclassMarkers) {
            manager.push(100, s);
        }

        manager.push(70, this.elements.length);
        /* DIMTOL */
        manager.push(71, 1);

        for (const e of this.elements) {
            e.tags(manager);
        }

        manager.push(0, "ENDTAB");
    }
}

export default DimStyleTable;
