import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Point extends DatabaseObject {
    x: number;
    y: number;
    // @ts-ignore - layer is assigned by Layer.addShape, assuming it exists when tags() is called
    layer: Layer;

    constructor(x: number, y: number) {
        super(["AcDbEntity", "AcDbPoint"]);
        this.x = x;
        this.y = y;
    }

    tags(manager: TagsManager): void {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/point_al_u05_c.htm
        manager.push(0, "POINT");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
    }
}

export default Point;
