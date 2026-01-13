import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Line extends DatabaseObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    // @ts-ignore
    layer: Layer;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(["AcDbEntity", "AcDbLine"]);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    tags(manager: TagsManager): void {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        manager.push(0, "LINE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x1, this.y1);

        manager.push(11, this.x2);
        manager.push(21, this.y2);
        manager.push(31, 0);
    }
}

export default Line;
