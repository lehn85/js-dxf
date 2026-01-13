import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Face extends DatabaseObject {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
    x3: number;
    y3: number;
    z3: number;
    x4: number;
    y4: number;
    z4: number;
    // @ts-ignore
    layer: Layer;

    constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number) {
        super(["AcDbEntity", "AcDbFace"]);
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
        this.x4 = x4;
        this.y4 = y4;
        this.z4 = z4;
    }

    tags(manager: TagsManager): void {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/3dface_al_u05_c.htm
        manager.push(0, "3DFACE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x1, this.y1, this.z1);

        manager.push(11, this.x2);
        manager.push(21, this.y2);
        manager.push(31, this.z2);

        manager.push(12, this.x3);
        manager.push(22, this.y3);
        manager.push(32, this.z3);

        manager.push(13, this.x4);
        manager.push(23, this.y4);
        manager.push(33, this.z4);
    }
}

export default Face;
