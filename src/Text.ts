import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Layer from "./Layer.js";
import { HorizontalAlignment, VerticalAlignment } from "./Types.js";

const H_ALIGN_CODES = ["left", "center", "right"];
const V_ALIGN_CODES = ["baseline", "bottom", "middle", "top"];

class Text extends DatabaseObject {
    x: number;
    y: number;
    height: number;
    rotation: number;
    value: string;
    hAlign: HorizontalAlignment;
    vAlign: VerticalAlignment;
    // @ts-ignore
    layer: Layer;

    /**
     * @param {number} x - x
     * @param {number} y - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
     * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
     */
    constructor(
        x: number,
        y: number,
        height: number,
        rotation: number,
        value: string,
        horizontalAlignment: HorizontalAlignment = "left",
        verticalAlignment: VerticalAlignment = "baseline"
    ) {
        super(["AcDbEntity", "AcDbText"]);
        this.x = x;
        this.y = y;
        this.height = height;
        this.rotation = rotation;
        this.value = value;
        this.hAlign = horizontalAlignment;
        this.vAlign = verticalAlignment;
    }

    tags(manager: TagsManager): void {
        //https://www.autodesk.com/techpubs/autocad/acadr14/dxf/text_al_u05_c.htm
        manager.push(0, "TEXT");
        super.tags(manager);
        manager.push(8, this.layer.name);
        manager.point(this.x, this.y);
        manager.push(40, this.height);
        manager.push(1, this.value);
        manager.push(50, this.rotation);

        if (
            H_ALIGN_CODES.includes(this.hAlign) ||
            V_ALIGN_CODES.includes(this.vAlign)
        ) {
            manager.push(72, Math.max(H_ALIGN_CODES.indexOf(this.hAlign), 0));

            manager.push(11, this.x);
            manager.push(21, this.y);
            manager.push(31, 0);

            /* AutoCAD needs this one more time, yes, exactly here. */
            manager.push(100, "AcDbText");
            manager.push(73, Math.max(V_ALIGN_CODES.indexOf(this.vAlign), 0));
        } else {
            /* AutoCAD needs this one more time. */
            manager.push(100, "AcDbText");
        }
    }
}

export default Text;
