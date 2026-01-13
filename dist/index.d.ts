type Point2D$1 = [number, number];
type Point3D$1 = [number, number, number];
type HeaderValue = [number, number | string];
type Unit = "Unitless" | "Inches" | "Feet" | "Miles" | "Millimeters" | "Centimeters" | "Meters" | "Kilometers" | "Microinches" | "Mils" | "Yards" | "Angstroms" | "Nanometers" | "Microns" | "Decimeters" | "Decameters" | "Hectometers" | "Gigameters" | "Astronomical units" | "Light years" | "Parsecs";
type HorizontalAlignment = "left" | "center" | "right";
type VerticalAlignment = "baseline" | "bottom" | "middle" | "top";

declare class TagsManager {
    lines: (string | number)[];
    constructor();
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    point(x: number, y: number, z?: number): void;
    /**
     *
     * @param {string} name The name of the section
     */
    start(name: string): void;
    end(): void;
    addHeaderVariable(name: string, tagsElements: HeaderValue[]): void;
    push(code: number | string, value: string | number): void;
    toDxfString(): string;
}

declare class DatabaseObject {
    handle: string;
    ownerObjectHandle: string;
    subclassMarkers: string[];
    layer?: any;
    constructor(subclass?: string | string[] | null);
    /**
     *
     * @param {TagsManager} manager
     */
    tags(manager: TagsManager): void;
}

declare class LineType extends DatabaseObject {
    name: string;
    description: string;
    elements: number[];
    /**
     * @param {string} name
     * @param {string} description
     * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
     */
    constructor(name: string, description: string, elements: number[]);
    tags(manager: TagsManager): void;
    getElementsSum(): number;
}

declare class Block extends DatabaseObject {
    name: string;
    end: DatabaseObject;
    recordHandle: string | null;
    constructor(name: string);
    tags(manager: TagsManager): void;
}

declare class Layer extends DatabaseObject {
    name: string;
    colorNumber: number;
    lineTypeName: string | null;
    shapes: DatabaseObject[];
    trueColor: number;
    constructor(name: string, colorNumber: number, lineTypeName?: string | null);
    tags(manager: TagsManager): void;
    setTrueColor(color: number): void;
    addShape(shape: DatabaseObject): void;
    getShapes(): DatabaseObject[];
    shapesTags(space: Block, manager: TagsManager): void;
}

declare class Table extends DatabaseObject {
    name: string;
    elements: DatabaseObject[];
    constructor(name: string);
    add(element: DatabaseObject): void;
    tags(manager: TagsManager): void;
}

declare class Dictionary extends DatabaseObject {
    children: Record<string, DatabaseObject>;
    constructor();
    /**
     *
     * @param {string} name
     * @param {DatabaseObject} dictionary
     */
    addChildDictionary(name: string, dictionary: DatabaseObject): void;
    tags(manager: TagsManager): void;
}

declare class Drawing {
    layers: {
        [key: string]: Layer;
    };
    activeLayer: Layer | null;
    lineTypes: {
        [key: string]: LineType;
    };
    headers: {
        [key: string]: any;
    };
    tables: {
        [key: string]: Table;
    };
    blocks: {
        [key: string]: Block;
    };
    dictionary: Dictionary;
    modelSpace: Block;
    constructor();
    /**
     * @param {string} name
     * @param {string} description
     * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
     */
    addLineType(name: string, description: string, elements: number[]): Drawing;
    addLayer(name: string, colorNumber: number, lineTypeName: string): Drawing;
    setActiveLayer(name: string): Drawing;
    addTable(name: string): Table;
    /**
     *
     * @param {string} name The name of the block.
     * @returns {Block}
     */
    addBlock(name: string): Block;
    drawLine(x1: number, y1: number, x2: number, y2: number): Drawing;
    drawLine3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): Drawing;
    drawPoint(x: number, y: number): Drawing;
    drawRect(x1: number, y1: number, x2: number, y2: number, cornerLength?: number, cornerBulge?: number): Drawing;
    /**
     * Draw a regular convex polygon as a polyline entity.
     *
     * @see [Regular polygon | Wikipedia](https://en.wikipedia.org/wiki/Regular_polygon)
     *
     * @param {number} x - The X coordinate of the center of the polygon.
     * @param {number} y - The Y coordinate of the center of the polygon.
     * @param {number} numberOfSides - The number of sides.
     * @param {number} radius - The radius.
     * @param {number} rotation - The  rotation angle (in Degrees) of the polygon. By default 0.
     * @param {boolean} circumscribed - If `true` is a polygon in which each side is a tangent to a circle.
     * If `false` is a polygon in which all vertices lie on a circle. By default `false`.
     *
     * @returns {Drawing} - The current object of {@link Drawing}.
     */
    drawPolygon(x: number, y: number, numberOfSides: number, radius: number, rotation?: number, circumscribed?: boolean): Drawing;
    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     * @param {number} startAngle - degree
     * @param {number} endAngle - degree
     */
    drawArc(x1: number, y1: number, r: number, startAngle: number, endAngle: number): Drawing;
    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} r - radius
     */
    drawCircle(x1: number, y1: number, r: number): Drawing;
    /**
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} z1 - Center z
     * @param {number} r - radius
     * @param {number} thickness - thickness
     * @param {number} extrusionDirectionX - Extrusion Direction x
     * @param {number} extrusionDirectionY - Extrusion Direction y
     * @param {number} extrusionDirectionZ - Extrusion Direction z
     */
    drawCylinder(x1: number, y1: number, z1: number, r: number, thickness: number, extrusionDirectionX: number, extrusionDirectionY: number, extrusionDirectionZ: number): Drawing;
    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} height - Text height
     * @param {number} rotation - Text rotation
     * @param {string} value - the string itself
     * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
     * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
     */
    drawText(x1: number, y1: number, height: number, rotation: number, value: string, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment): Drawing;
    /**
     * @param {[number, number][]} points - Array of points like [ [x1, y1], [x2, y2]... ]
     * @param {boolean} closed - Closed polyline flag
     * @param {number} startWidth - Default start width
     * @param {number} endWidth - Default end width
     * @param {number} elevation - Default elevation
     */
    drawPolyline(points: number[][], closed?: boolean, startWidth?: number, endWidth?: number, elevation?: number): Drawing;
    /**
     * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z1]... ]
     */
    drawPolyline3d(points: [number, number, number][]): Drawing;
    /**
     *
     * @param {number} trueColor - Integer representing the true color, can be passed as an hexadecimal value of the form 0xRRGGBB
     */
    setTrueColor(trueColor: number): Drawing;
    /**
     * Draw a spline.
     * @param {[Array]} controlPoints - Array of control points like [ [x1, y1], [x2, y2]... ]
     * @param {number} degree - Degree of spline: 2 for quadratic, 3 for cubic. Default is 3
     * @param {[number]} knots - Knot vector array. If null, will use a uniform knot vector. Default is null
     * @param {[number]} weights - Control point weights. If provided, must be one weight for each control point. Default is null
     * @param {[Array]} fitPoints - Array of fit points like [ [x1, y1], [x2, y2]... ]
     */
    drawSpline(controlPoints: number[][], degree?: number, knots?: number[] | null, weights?: number[] | null, fitPoints?: number[][]): Drawing;
    /**
     * Draw an ellipse.
     * @param {number} x1 - Center x
     * @param {number} y1 - Center y
     * @param {number} majorAxisX - Endpoint x of major axis, relative to center
     * @param {number} majorAxisY - Endpoint y of major axis, relative to center
     * @param {number} axisRatio - Ratio of minor axis to major axis
     * @param {number} startAngle - Start angle
     * @param {number} endAngle - End angle
     */
    drawEllipse(x1: number, y1: number, majorAxisX: number, majorAxisY: number, axisRatio: number, startAngle?: number, endAngle?: number): Drawing;
    /**
     * @param {number} x1 - x
     * @param {number} y1 - y
     * @param {number} z1 - z
     * @param {number} x2 - x
     * @param {number} y2 - y
     * @param {number} z2 - z
     * @param {number} x3 - x
     * @param {number} y3 - y
     * @param {number} z3 - z
     * @param {number} x4 - x
     * @param {number} y4 - y
     * @param {number} z4 - z
     */
    drawFace(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number, x4: number, y4: number, z4: number): Drawing;
    _ltypeTable(): Table;
    _layerTable(): Table;
    /**
     * @see https://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
     * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
     *
     * @param {string} variable
     * @param {array} values Array of "two elements arrays". [  [value1_GroupCode, value1_value], [value2_GroupCode, value2_value]  ]
     */
    header(variable: string, values: any[]): Drawing;
    /**
     *
     * @param {string} unit see Drawing.UNITS
     */
    setUnits(unit: Unit): Drawing;
    /** Generate additional DXF metadata which are required to successfully open resulted document
     * in AutoDesk products. Call this method before serializing the drawing to get the most
     * compatible result.
     */
    generateAutocadExtras(): void;
    _tagsManager(): TagsManager;
    toDxfString(): string;
    static ACI: {
        [key: string]: number;
    };
    static LINE_TYPES: {
        name: string;
        description: string;
        elements: number[];
    }[];
    static LAYERS: {
        name: string;
        colorNumber: number;
        lineTypeName: string;
    }[];
    static UNITS: {
        [key: string]: number;
    };
}

type Point2D = Point2D$1;
type Point3D = Point3D$1;
type UnitType = Unit;
type HAlign = HorizontalAlignment;
type VAlign = VerticalAlignment;

export { type HAlign, type Point2D, type Point3D, type UnitType, type VAlign, Drawing as default };
