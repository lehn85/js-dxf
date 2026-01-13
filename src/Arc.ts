import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Arc extends DatabaseObject {
    x: number;
    y: number;
    r: number;
    startAngle: number;
    endAngle: number;
    // @ts-ignore
    layer: Layer;

    /**
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degree
     * @param {number} endAngle - degree
     */
    constructor(x: number, y: number, r: number, startAngle: number, endAngle: number) {
        super(["AcDbEntity", "AcDbCircle"]);
        this.x = x;
        this.y = y;
        this.r = r;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    tags(manager: TagsManager): void {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/line_al_u05_c.htm
        manager.push(0, "ARC");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
        manager.push(40, this.r);
        manager.push(100, "AcDbArc");
        manager.push(50, this.startAngle);
        manager.push(51, this.endAngle);
    }
}

export default Arc;
