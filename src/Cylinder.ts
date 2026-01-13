import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Cylinder extends DatabaseObject {
    x: number;
    y: number;
    z: number;
    r: number;
    thickness: number;
    extrusionDirectionX: number;
    extrusionDirectionY: number;
    extrusionDirectionZ: number;
    // @ts-ignore
    layer: Layer;

    /**
     * @param {number} x - Center x
     * @param {number} y - Center y
     * @param {number} z - Center z
     * @param {number} r - radius
     * @param {number} thickness - thickness
     * @param {number} extrusionDirectionX - Extrusion Direction x
     * @param {number} extrusionDirectionY - Extrusion Direction y
     * @param {number} extrusionDirectionZ - Extrusion Direction z
     */
    constructor(
        x: number,
        y: number,
        z: number,
        r: number,
        thickness: number,
        extrusionDirectionX: number,
        extrusionDirectionY: number,
        extrusionDirectionZ: number
    ) {
        super(["AcDbEntity", "AcDbCircle"]);
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.thickness = thickness;
        this.extrusionDirectionX = extrusionDirectionX;
        this.extrusionDirectionY = extrusionDirectionY;
        this.extrusionDirectionZ = extrusionDirectionZ;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "CIRCLE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y, this.z);
        manager.push(40, this.r);
        manager.push(39, this.thickness);
        manager.push(210, this.extrusionDirectionX);
        manager.push(220, this.extrusionDirectionY);
        manager.push(230, this.extrusionDirectionZ);
    }
}

export default Cylinder;
