import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Vertex extends DatabaseObject {
    x: number;
    y: number;
    z: number;
    // @ts-ignore
    layer: Layer;

    /**
     *
     * @param {number} x The X coordinate
     * @param {number} y The Y coordinate
     * @param {number} z The Z coordinate
     */
    constructor(x: number, y: number, z: number) {
        super(["AcDbEntity", "AcDbVertex", "AcDb3dPolylineVertex"]);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "VERTEX");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y, this.z);
        manager.push(70, 32);
    }
}

export default Vertex;
