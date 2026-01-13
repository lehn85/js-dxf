import DatabaseObject from "./DatabaseObject.js";
import TagsManager from "./TagsManager.js";
import Block from "./Block.js";

class Layer extends DatabaseObject {
    name: string;
    colorNumber: number;
    lineTypeName: string | null;
    shapes: DatabaseObject[];
    trueColor: number;

    constructor(name: string, colorNumber: number, lineTypeName: string | null = null) {
        super(["AcDbSymbolTableRecord", "AcDbLayerTableRecord"]);
        this.name = name;
        this.colorNumber = colorNumber;
        this.lineTypeName = lineTypeName;
        this.shapes = [];
        this.trueColor = -1;
    }

    tags(manager: TagsManager): void {
        manager.push(0, "LAYER");
        super.tags(manager);
        manager.push(2, this.name);
        if (this.trueColor !== -1) manager.push(420, this.trueColor);
        else manager.push(62, this.colorNumber);

        manager.push(70, 0);
        if (this.lineTypeName) manager.push(6, this.lineTypeName);

        /* Hard-pointer handle to PlotStyleName object; seems mandatory, but any value seems OK,
         * including 0.
         */
        manager.push(390, 1);
    }

    setTrueColor(color: number): void {
        this.trueColor = color;
    }

    addShape(shape: DatabaseObject): void {
        this.shapes.push(shape);
        shape.layer = this;
    }

    getShapes(): DatabaseObject[] {
        return this.shapes;
    }

    shapesTags(space: Block, manager: TagsManager): void {
        for (const shape of this.shapes) {
            shape.ownerObjectHandle = space.handle;
            shape.tags(manager);
        }
    }
}

export default Layer;
