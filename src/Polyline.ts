import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";

class Polyline extends DatabaseObject {
    points: number[][]; // [x, y, bulge?]
    closed: boolean;
    startWidth: number;
    endWidth: number;
    elevation: number;
    // @ts-ignore
    layer: Layer;

    /**
     * @param {array} points - Array of points like [ [x1, y1], [x2, y2, bulge]... ]
     * @param {boolean} closed
     * @param {number} startWidth
     * @param {number} endWidth
     * @param {number} elevation
     */
    constructor(points: number[][], closed: boolean = false, startWidth: number = 0, endWidth: number = 0, elevation: number = 0) {
        super(["AcDbEntity", "AcDbPolyline"]);
        this.points = points;
        this.closed = closed;
        this.startWidth = startWidth;
        this.endWidth = endWidth;
        this.elevation = elevation;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "LWPOLYLINE");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.push(6, "ByLayer");
        manager.push(62, 256);
        manager.push(370, -1);
        manager.push(90, this.points.length);
        manager.push(70, this.closed ? 1 : 0);
        manager.push(38, this.elevation);

        this.points.forEach((point) => {
            const [x, y, z] = point;
            manager.push(10, x);
            manager.push(20, y);
            if (this.startWidth !== 0 || this.endWidth !== 0) {
                manager.push(40, this.startWidth);
                manager.push(41, this.endWidth);
            }
            if (z !== undefined) manager.push(42, z);
        });
    }
}

export default Polyline;
