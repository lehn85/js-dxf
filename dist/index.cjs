"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/Handle.ts
var Handle = class _Handle {
  static seed = 0;
  static next() {
    return (++_Handle.seed).toString(16).toUpperCase();
  }
  static peek() {
    return (_Handle.seed + 1).toString(16).toUpperCase();
  }
};
var Handle_default = Handle;

// src/DatabaseObject.ts
var DatabaseObject = class {
  handle;
  ownerObjectHandle;
  subclassMarkers;
  layer;
  constructor(subclass = null) {
    this.handle = Handle_default.next();
    this.ownerObjectHandle = "0";
    this.subclassMarkers = [];
    if (subclass) {
      if (Array.isArray(subclass)) {
        this.subclassMarkers.push(...subclass);
      } else {
        this.subclassMarkers.push(subclass);
      }
    }
  }
  /**
   *
   * @param {TagsManager} manager
   */
  tags(manager) {
    manager.push(5, this.handle);
    manager.push(330, this.ownerObjectHandle);
    for (const s of this.subclassMarkers) {
      manager.push(100, s);
    }
  }
};
var DatabaseObject_default = DatabaseObject;

// src/LineType.ts
var LineType = class extends DatabaseObject_default {
  name;
  description;
  elements;
  /**
   * @param {string} name
   * @param {string} description
   * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
   */
  constructor(name, description, elements) {
    super(["AcDbSymbolTableRecord", "AcDbLinetypeTableRecord"]);
    this.name = name;
    this.description = description;
    this.elements = elements;
  }
  tags(manager) {
    manager.push(0, "LTYPE");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(3, this.description);
    manager.push(70, 0);
    manager.push(72, 65);
    manager.push(73, this.elements.length);
    manager.push(40, this.getElementsSum());
    this.elements.forEach((element) => {
      manager.push(49, element);
      manager.push(74, 0);
    });
  }
  getElementsSum() {
    return this.elements.reduce((sum, element) => {
      return sum + Math.abs(element);
    }, 0);
  }
};
var LineType_default = LineType;

// src/Layer.ts
var Layer = class extends DatabaseObject_default {
  name;
  colorNumber;
  lineTypeName;
  shapes;
  trueColor;
  constructor(name, colorNumber, lineTypeName = null) {
    super(["AcDbSymbolTableRecord", "AcDbLayerTableRecord"]);
    this.name = name;
    this.colorNumber = colorNumber;
    this.lineTypeName = lineTypeName;
    this.shapes = [];
    this.trueColor = -1;
  }
  tags(manager) {
    manager.push(0, "LAYER");
    super.tags(manager);
    manager.push(2, this.name);
    if (this.trueColor !== -1) manager.push(420, this.trueColor);
    else manager.push(62, this.colorNumber);
    manager.push(70, 0);
    if (this.lineTypeName) manager.push(6, this.lineTypeName);
    manager.push(390, 1);
  }
  setTrueColor(color) {
    this.trueColor = color;
  }
  addShape(shape) {
    this.shapes.push(shape);
    shape.layer = this;
  }
  getShapes() {
    return this.shapes;
  }
  shapesTags(space, manager) {
    for (const shape of this.shapes) {
      shape.ownerObjectHandle = space.handle;
      shape.tags(manager);
    }
  }
};
var Layer_default = Layer;

// src/Table.ts
var Table = class extends DatabaseObject_default {
  name;
  elements;
  constructor(name) {
    super("AcDbSymbolTable");
    this.name = name;
    this.elements = [];
  }
  add(element) {
    element.ownerObjectHandle = this.handle;
    this.elements.push(element);
  }
  tags(manager) {
    manager.push(0, "TABLE");
    manager.push(2, this.name);
    super.tags(manager);
    manager.push(70, this.elements.length);
    this.elements.forEach((element) => {
      element.tags(manager);
    });
    manager.push(0, "ENDTAB");
  }
};
var Table_default = Table;

// src/DimStyleTable.ts
var DimStyleTable = class extends Table_default {
  constructor(name) {
    super(name);
    this.subclassMarkers.push("AcDbDimStyleTable");
  }
  tags(manager) {
    manager.push(0, "TABLE");
    manager.push(2, this.name);
    manager.push(5, this.handle);
    manager.push(330, this.ownerObjectHandle);
    for (const s of this.subclassMarkers) {
      manager.push(100, s);
    }
    manager.push(70, this.elements.length);
    manager.push(71, 1);
    for (const e of this.elements) {
      e.tags(manager);
    }
    manager.push(0, "ENDTAB");
  }
};
var DimStyleTable_default = DimStyleTable;

// src/TextStyle.ts
var TextStyle = class extends DatabaseObject_default {
  fontFileName = "txt";
  name;
  constructor(name) {
    super(["AcDbSymbolTableRecord", "AcDbTextStyleTableRecord"]);
    this.name = name;
  }
  tags(manager) {
    manager.push(0, "STYLE");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(70, 0);
    manager.push(40, 0);
    manager.push(41, 1);
    manager.push(50, 0);
    manager.push(71, 0);
    manager.push(42, 1);
    manager.push(3, this.fontFileName);
    manager.push(4, "");
  }
};
var TextStyle_default = TextStyle;

// src/Viewport.ts
var Viewport = class extends DatabaseObject_default {
  name;
  height;
  constructor(name, height) {
    super(["AcDbSymbolTableRecord", "AcDbViewportTableRecord"]);
    this.name = name;
    this.height = height;
  }
  tags(manager) {
    manager.push(0, "VPORT");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(40, this.height);
    manager.push(70, 0);
  }
};
var Viewport_default = Viewport;

// src/AppId.ts
var AppId = class extends DatabaseObject_default {
  name;
  constructor(name) {
    super(["AcDbSymbolTableRecord", "AcDbRegAppTableRecord"]);
    this.name = name;
  }
  tags(manager) {
    manager.push(0, "APPID");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(70, 0);
  }
};
var AppId_default = AppId;

// src/Block.ts
var Block = class extends DatabaseObject_default {
  name;
  end;
  recordHandle;
  constructor(name) {
    super(["AcDbEntity", "AcDbBlockBegin"]);
    this.name = name;
    this.end = new DatabaseObject_default(["AcDbEntity", "AcDbBlockEnd"]);
    this.recordHandle = null;
  }
  tags(manager) {
    manager.push(0, "BLOCK");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(70, 0);
    manager.point(0, 0);
    manager.push(3, this.name);
    manager.push(1, "");
    manager.push(0, "ENDBLK");
    this.end.tags(manager);
  }
};
var Block_default = Block;

// src/BlockRecord.ts
var BlockRecord = class extends DatabaseObject_default {
  name;
  constructor(name) {
    super(["AcDbSymbolTableRecord", "AcDbBlockTableRecord"]);
    this.name = name;
  }
  tags(manager) {
    manager.push(0, "BLOCK_RECORD");
    super.tags(manager);
    manager.push(2, this.name);
    manager.push(70, 0);
    manager.push(280, 0);
    manager.push(281, 1);
  }
};
var BlockRecord_default = BlockRecord;

// src/Dictionary.ts
var Dictionary = class extends DatabaseObject_default {
  children;
  constructor() {
    super("AcDbDictionary");
    this.children = {};
  }
  /**
   *
   * @param {string} name
   * @param {DatabaseObject} dictionary
   */
  addChildDictionary(name, dictionary) {
    dictionary.ownerObjectHandle = this.handle;
    this.children[name] = dictionary;
  }
  tags(manager) {
    manager.push(0, "DICTIONARY");
    super.tags(manager);
    manager.push(281, 1);
    const entries = Object.entries(this.children);
    for (const entry of entries) {
      const [name, dic] = entry;
      manager.push(3, name);
      manager.push(350, dic.handle);
    }
    const children = Object.values(this.children);
    for (const c of children) {
      c.tags(manager);
    }
  }
};
var Dictionary_default = Dictionary;

// src/Line.ts
var Line = class extends DatabaseObject_default {
  x1;
  y1;
  x2;
  y2;
  // @ts-ignore
  layer;
  constructor(x1, y1, x2, y2) {
    super(["AcDbEntity", "AcDbLine"]);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  tags(manager) {
    manager.push(0, "LINE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x1, this.y1);
    manager.push(11, this.x2);
    manager.push(21, this.y2);
    manager.push(31, 0);
  }
};
var Line_default = Line;

// src/Line3d.ts
var Line3d = class extends DatabaseObject_default {
  x1;
  y1;
  z1;
  x2;
  y2;
  z2;
  // @ts-ignore
  layer;
  constructor(x1, y1, z1, x2, y2, z2) {
    super(["AcDbEntity", "AcDbLine"]);
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
  }
  tags(manager) {
    manager.push(0, "LINE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x1, this.y1, this.z1);
    manager.push(11, this.x2);
    manager.push(21, this.y2);
    manager.push(31, this.z2);
  }
};
var Line3d_default = Line3d;

// src/Arc.ts
var Arc = class extends DatabaseObject_default {
  x;
  y;
  r;
  startAngle;
  endAngle;
  // @ts-ignore
  layer;
  /**
   * @param {number} x - Center x
   * @param {number} y - Center y
   * @param {number} r - radius
   * @param {number} startAngle - degree
   * @param {number} endAngle - degree
   */
  constructor(x, y, r, startAngle, endAngle) {
    super(["AcDbEntity", "AcDbCircle"]);
    this.x = x;
    this.y = y;
    this.r = r;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }
  tags(manager) {
    manager.push(0, "ARC");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y);
    manager.push(40, this.r);
    manager.push(100, "AcDbArc");
    manager.push(50, this.startAngle);
    manager.push(51, this.endAngle);
  }
};
var Arc_default = Arc;

// src/Circle.ts
var Circle = class extends DatabaseObject_default {
  x;
  y;
  r;
  // @ts-ignore
  layer;
  /**
   * @param {number} x - Center x
   * @param {number} y - Center y
   * @param {number} r - radius
   */
  constructor(x, y, r) {
    super(["AcDbEntity", "AcDbCircle"]);
    this.x = x;
    this.y = y;
    this.r = r;
  }
  tags(manager) {
    manager.push(0, "CIRCLE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y);
    manager.push(40, this.r);
  }
};
var Circle_default = Circle;

// src/Cylinder.ts
var Cylinder = class extends DatabaseObject_default {
  x;
  y;
  z;
  r;
  thickness;
  extrusionDirectionX;
  extrusionDirectionY;
  extrusionDirectionZ;
  // @ts-ignore
  layer;
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
  constructor(x, y, z, r, thickness, extrusionDirectionX, extrusionDirectionY, extrusionDirectionZ) {
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
  tags(manager) {
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
};
var Cylinder_default = Cylinder;

// src/Text.ts
var H_ALIGN_CODES = ["left", "center", "right"];
var V_ALIGN_CODES = ["baseline", "bottom", "middle", "top"];
var Text = class extends DatabaseObject_default {
  x;
  y;
  height;
  rotation;
  value;
  hAlign;
  vAlign;
  // @ts-ignore
  layer;
  /**
   * @param {number} x - x
   * @param {number} y - y
   * @param {number} height - Text height
   * @param {number} rotation - Text rotation
   * @param {string} value - the string itself
   * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
   * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
   */
  constructor(x, y, height, rotation, value, horizontalAlignment = "left", verticalAlignment = "baseline") {
    super(["AcDbEntity", "AcDbText"]);
    this.x = x;
    this.y = y;
    this.height = height;
    this.rotation = rotation;
    this.value = value;
    this.hAlign = horizontalAlignment;
    this.vAlign = verticalAlignment;
  }
  tags(manager) {
    manager.push(0, "TEXT");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y);
    manager.push(40, this.height);
    manager.push(1, this.value);
    manager.push(50, this.rotation);
    if (H_ALIGN_CODES.includes(this.hAlign) || V_ALIGN_CODES.includes(this.vAlign)) {
      manager.push(72, Math.max(H_ALIGN_CODES.indexOf(this.hAlign), 0));
      manager.push(11, this.x);
      manager.push(21, this.y);
      manager.push(31, 0);
      manager.push(100, "AcDbText");
      manager.push(73, Math.max(V_ALIGN_CODES.indexOf(this.vAlign), 0));
    } else {
      manager.push(100, "AcDbText");
    }
  }
};
var Text_default = Text;

// src/Polyline.ts
var Polyline = class extends DatabaseObject_default {
  points;
  // [x, y, bulge?]
  closed;
  startWidth;
  endWidth;
  elevation;
  // @ts-ignore
  layer;
  /**
   * @param {array} points - Array of points like [ [x1, y1], [x2, y2, bulge]... ]
   * @param {boolean} closed
   * @param {number} startWidth
   * @param {number} endWidth
   * @param {number} elevation
   */
  constructor(points, closed = false, startWidth = 0, endWidth = 0, elevation = 0) {
    super(["AcDbEntity", "AcDbPolyline"]);
    this.points = points;
    this.closed = closed;
    this.startWidth = startWidth;
    this.endWidth = endWidth;
    this.elevation = elevation;
  }
  tags(manager) {
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
      if (z !== void 0) manager.push(42, z);
    });
  }
};
var Polyline_default = Polyline;

// src/Vertex.ts
var Vertex = class extends DatabaseObject_default {
  x;
  y;
  z;
  // @ts-ignore
  layer;
  /**
   *
   * @param {number} x The X coordinate
   * @param {number} y The Y coordinate
   * @param {number} z The Z coordinate
   */
  constructor(x, y, z) {
    super(["AcDbEntity", "AcDbVertex", "AcDb3dPolylineVertex"]);
    this.x = x;
    this.y = y;
    this.z = z;
  }
  tags(manager) {
    manager.push(0, "VERTEX");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y, this.z);
    manager.push(70, 32);
  }
};
var Vertex_default = Vertex;

// src/Polyline3d.ts
var Polyline3d = class extends DatabaseObject_default {
  verticies;
  seqendHandle;
  // @ts-ignore
  layer;
  /**
   * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z2]... ]
   */
  constructor(points) {
    super(["AcDbEntity", "AcDb3dPolyline"]);
    this.verticies = points.map((point) => {
      const [x, y, z] = point;
      const vertex = new Vertex_default(x, y, z);
      vertex.ownerObjectHandle = this.handle;
      return vertex;
    });
    this.seqendHandle = Handle_default.next();
  }
  tags(manager) {
    manager.push(0, "POLYLINE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.push(66, 1);
    manager.push(70, 0);
    manager.point(0, 0);
    this.verticies.forEach((vertex) => {
      vertex.layer = this.layer;
      vertex.tags(manager);
    });
    manager.push(0, "SEQEND");
    manager.push(5, this.seqendHandle);
    manager.push(100, "AcDbEntity");
    manager.push(8, this.layer.name);
  }
};
var Polyline3d_default = Polyline3d;

// src/Face.ts
var Face = class extends DatabaseObject_default {
  x1;
  y1;
  z1;
  x2;
  y2;
  z2;
  x3;
  y3;
  z3;
  x4;
  y4;
  z4;
  // @ts-ignore
  layer;
  constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
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
  tags(manager) {
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
};
var Face_default = Face;

// src/Point.ts
var Point = class extends DatabaseObject_default {
  x;
  y;
  // @ts-ignore - layer is assigned by Layer.addShape, assuming it exists when tags() is called
  layer;
  constructor(x, y) {
    super(["AcDbEntity", "AcDbPoint"]);
    this.x = x;
    this.y = y;
  }
  tags(manager) {
    manager.push(0, "POINT");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y);
  }
};
var Point_default = Point;

// src/Spline.ts
var Spline = class extends DatabaseObject_default {
  controlPoints;
  knots;
  weights;
  fitPoints;
  degree;
  type;
  // @ts-ignore
  layer;
  /**
   * Creates a spline. See https://www.autodesk.com/techpubs/autocad/acad2000/dxf/spline_dxf_06.htm
   * @param {[Array]} controlPoints - Array of control points like [ [x1, y1], [x2, y2]... ]
   * @param {number} degree - Degree of spline: 2 for quadratic, 3 for cubic. Default is 3
   * @param {[number]} knots - Knot vector array. If null, will use a uniform knot vector. Default is null
   * @param {[number]} weights - Control point weights. If provided, must be one weight for each control point. Default is null
   * @param {[Array]} fitPoints - Array of fit points like [ [x1, y1], [x2, y2]... ]
   */
  constructor(controlPoints, degree = 3, knots = null, weights = null, fitPoints = []) {
    super(["AcDbEntity", "AcDbSpline"]);
    if (controlPoints.length < degree + 1) {
      throw new Error(
        `For degree ${degree} spline, expected at least ${degree + 1} control points, but received only ${controlPoints.length}`
      );
    }
    if (knots == null) {
      knots = [];
      for (let i = 0; i < degree + 1; i++) {
        knots.push(0);
      }
      for (let i = 1; i < controlPoints.length - degree; i++) {
        knots.push(i);
      }
      for (let i = 0; i < degree + 1; i++) {
        knots.push(controlPoints.length - degree);
      }
    }
    if (knots.length !== controlPoints.length + degree + 1) {
      throw new Error(
        `Invalid knot vector length. Expected ${controlPoints.length + degree + 1} but received ${knots.length}.`
      );
    }
    this.controlPoints = controlPoints;
    this.knots = knots;
    this.fitPoints = fitPoints;
    this.degree = degree;
    this.weights = weights;
    const closed = 0;
    const periodic = 0;
    const rational = this.weights ? 1 : 0;
    const planar = 1;
    const linear = 0;
    this.type = closed * 1 + periodic * 2 + rational * 4 + planar * 8 + linear * 16;
  }
  tags(manager) {
    manager.push(0, "SPLINE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.push(210, 0);
    manager.push(220, 0);
    manager.push(230, 1);
    manager.push(70, this.type);
    manager.push(71, this.degree);
    manager.push(72, this.knots.length);
    manager.push(73, this.controlPoints.length);
    manager.push(74, this.fitPoints.length);
    manager.push(42, 1e-7);
    manager.push(43, 1e-7);
    manager.push(44, 1e-10);
    this.knots.forEach((knot) => {
      manager.push(40, knot);
    });
    if (this.weights) {
      this.weights.forEach((weight) => {
        manager.push(41, weight);
      });
    }
    this.controlPoints.forEach((point) => {
      manager.point(point[0], point[1]);
    });
  }
};
var Spline_default = Spline;

// src/Ellipse.ts
var Ellipse = class extends DatabaseObject_default {
  x;
  y;
  majorAxisX;
  majorAxisY;
  axisRatio;
  startAngle;
  endAngle;
  // @ts-ignore
  layer;
  /**
   * Creates an ellipse.
   * @param {number} x - Center x
   * @param {number} y - Center y
   * @param {number} majorAxisX - Endpoint x of major axis, relative to center
   * @param {number} majorAxisY - Endpoint y of major axis, relative to center
   * @param {number} axisRatio - Ratio of minor axis to major axis
   * @param {number} startAngle - Start angle
   * @param {number} endAngle - End angle
   */
  constructor(x, y, majorAxisX, majorAxisY, axisRatio, startAngle, endAngle) {
    super(["AcDbEntity", "AcDbEllipse"]);
    this.x = x;
    this.y = y;
    this.majorAxisX = majorAxisX;
    this.majorAxisY = majorAxisY;
    this.axisRatio = axisRatio;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }
  tags(manager) {
    manager.push(0, "ELLIPSE");
    super.tags(manager);
    manager.push(8, this.layer.name);
    manager.point(this.x, this.y);
    manager.push(11, this.majorAxisX);
    manager.push(21, this.majorAxisY);
    manager.push(31, 0);
    manager.push(40, this.axisRatio);
    manager.push(41, this.startAngle);
    manager.push(42, this.endAngle);
  }
};
var Ellipse_default = Ellipse;

// src/TagsManager.ts
var TagsManager = class {
  lines;
  constructor() {
    this.lines = [];
  }
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  point(x, y, z = 0) {
    this.push(10, x);
    this.push(20, y);
    this.push(30, z);
  }
  /**
   *
   * @param {string} name The name of the section
   */
  start(name) {
    this.push(0, "SECTION");
    this.push(2, name);
  }
  end() {
    this.push(0, "ENDSEC");
  }
  addHeaderVariable(name, tagsElements) {
    this.push(9, `$${name}`);
    tagsElements.forEach((tagElement) => {
      this.push(tagElement[0], tagElement[1]);
    });
  }
  push(code, value) {
    this.lines.push(code, value);
  }
  toDxfString() {
    return this.lines.join("\n");
  }
};
var TagsManager_default = TagsManager;

// src/Drawing.ts
var Drawing = class _Drawing {
  layers;
  activeLayer;
  lineTypes;
  headers;
  tables;
  blocks;
  dictionary;
  modelSpace;
  constructor() {
    this.layers = {};
    this.activeLayer = null;
    this.lineTypes = {};
    this.headers = {};
    this.tables = {};
    this.blocks = {};
    this.dictionary = new Dictionary_default();
    this.setUnits("Unitless");
    for (const ltype of _Drawing.LINE_TYPES) {
      this.addLineType(ltype.name, ltype.description, ltype.elements);
    }
    for (const l of _Drawing.LAYERS) {
      this.addLayer(l.name, l.colorNumber, l.lineTypeName);
    }
    this.setActiveLayer("0");
    this.generateAutocadExtras();
  }
  /**
   * @param {string} name
   * @param {string} description
   * @param {array} elements - if elem > 0 it is a line, if elem < 0 it is gap, if elem == 0.0 it is a
   */
  addLineType(name, description, elements) {
    this.lineTypes[name] = new LineType_default(name, description, elements);
    return this;
  }
  addLayer(name, colorNumber, lineTypeName) {
    this.layers[name] = new Layer_default(name, colorNumber, lineTypeName);
    return this;
  }
  setActiveLayer(name) {
    this.activeLayer = this.layers[name];
    return this;
  }
  addTable(name) {
    const table = new Table_default(name);
    this.tables[name] = table;
    return table;
  }
  /**
   *
   * @param {string} name The name of the block.
   * @returns {Block}
   */
  addBlock(name) {
    const block = new Block_default(name);
    this.blocks[name] = block;
    return block;
  }
  drawLine(x1, y1, x2, y2) {
    this.activeLayer.addShape(new Line_default(x1, y1, x2, y2));
    return this;
  }
  drawLine3d(x1, y1, z1, x2, y2, z2) {
    this.activeLayer.addShape(new Line3d_default(x1, y1, z1, x2, y2, z2));
    return this;
  }
  drawPoint(x, y) {
    this.activeLayer.addShape(new Point_default(x, y));
    return this;
  }
  drawRect(x1, y1, x2, y2, cornerLength, cornerBulge) {
    const w = x2 - x1;
    const h = y2 - y1;
    cornerBulge = cornerBulge || 0;
    let p;
    if (!cornerLength) {
      p = new Polyline_default(
        [
          [x1, y1],
          [x1, y1 + h],
          [x1 + w, y1 + h],
          [x1 + w, y1]
        ],
        true
      );
    } else {
      p = new Polyline_default(
        [
          [x1 + w - cornerLength, y1, cornerBulge],
          // 1
          [x1 + w, y1 + cornerLength],
          // 2
          [x1 + w, y1 + h - cornerLength, cornerBulge],
          // 3
          [x1 + w - cornerLength, y1 + h],
          // 4
          [x1 + cornerLength, y1 + h, cornerBulge],
          // 5
          [x1, y1 + h - cornerLength],
          // 6
          [x1, y1 + cornerLength, cornerBulge],
          // 7
          [x1 + cornerLength, y1]
          // 8
        ],
        true
      );
    }
    this.activeLayer.addShape(p);
    return this;
  }
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
  drawPolygon(x, y, numberOfSides, radius, rotation = 0, circumscribed = false) {
    const angle = 2 * Math.PI / numberOfSides;
    const vertices = [];
    let d = radius;
    const rotationRad = rotation * Math.PI / 180;
    if (circumscribed) d = radius / Math.cos(Math.PI / numberOfSides);
    for (let i = 0; i < numberOfSides; i++) {
      vertices.push([
        x + d * Math.sin(rotationRad + i * angle),
        y + d * Math.cos(rotationRad + i * angle)
      ]);
    }
    this.activeLayer.addShape(new Polyline_default(vertices, true));
    return this;
  }
  /**
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} r - radius
   * @param {number} startAngle - degree
   * @param {number} endAngle - degree
   */
  drawArc(x1, y1, r, startAngle, endAngle) {
    this.activeLayer.addShape(new Arc_default(x1, y1, r, startAngle, endAngle));
    return this;
  }
  /**
   * @param {number} x1 - Center x
   * @param {number} y1 - Center y
   * @param {number} r - radius
   */
  drawCircle(x1, y1, r) {
    this.activeLayer.addShape(new Circle_default(x1, y1, r));
    return this;
  }
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
  drawCylinder(x1, y1, z1, r, thickness, extrusionDirectionX, extrusionDirectionY, extrusionDirectionZ) {
    this.activeLayer.addShape(
      new Cylinder_default(
        x1,
        y1,
        z1,
        r,
        thickness,
        extrusionDirectionX,
        extrusionDirectionY,
        extrusionDirectionZ
      )
    );
    return this;
  }
  /**
   * @param {number} x1 - x
   * @param {number} y1 - y
   * @param {number} height - Text height
   * @param {number} rotation - Text rotation
   * @param {string} value - the string itself
   * @param {HorizontalAlignment} [horizontalAlignment="left"] left | center | right
   * @param {VerticalAlignment} [verticalAlignment="baseline"] baseline | bottom | middle | top
   */
  drawText(x1, y1, height, rotation, value, horizontalAlignment = "left", verticalAlignment = "baseline") {
    this.activeLayer.addShape(
      new Text_default(
        x1,
        y1,
        height,
        rotation,
        value,
        horizontalAlignment,
        verticalAlignment
      )
    );
    return this;
  }
  /**
   * @param {[number, number][]} points - Array of points like [ [x1, y1], [x2, y2]... ]
   * @param {boolean} closed - Closed polyline flag
   * @param {number} startWidth - Default start width
   * @param {number} endWidth - Default end width
   * @param {number} elevation - Default elevation
   */
  drawPolyline(points, closed = false, startWidth = 0, endWidth = 0, elevation = 0) {
    this.activeLayer.addShape(
      new Polyline_default(points, closed, startWidth, endWidth, elevation)
    );
    return this;
  }
  /**
   * @param {[number, number, number][]} points - Array of points like [ [x1, y1, z1], [x2, y2, z1]... ]
   */
  drawPolyline3d(points) {
    points.forEach((point) => {
      if (point.length !== 3) {
        throw new Error("Require 3D coordinates");
      }
    });
    this.activeLayer.addShape(new Polyline3d_default(points));
    return this;
  }
  /**
   *
   * @param {number} trueColor - Integer representing the true color, can be passed as an hexadecimal value of the form 0xRRGGBB
   */
  setTrueColor(trueColor) {
    this.activeLayer.setTrueColor(trueColor);
    return this;
  }
  /**
   * Draw a spline.
   * @param {[Array]} controlPoints - Array of control points like [ [x1, y1], [x2, y2]... ]
   * @param {number} degree - Degree of spline: 2 for quadratic, 3 for cubic. Default is 3
   * @param {[number]} knots - Knot vector array. If null, will use a uniform knot vector. Default is null
   * @param {[number]} weights - Control point weights. If provided, must be one weight for each control point. Default is null
   * @param {[Array]} fitPoints - Array of fit points like [ [x1, y1], [x2, y2]... ]
   */
  drawSpline(controlPoints, degree = 3, knots = null, weights = null, fitPoints = []) {
    this.activeLayer.addShape(
      new Spline_default(controlPoints, degree, knots, weights, fitPoints)
    );
    return this;
  }
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
  drawEllipse(x1, y1, majorAxisX, majorAxisY, axisRatio, startAngle = 0, endAngle = 2 * Math.PI) {
    this.activeLayer.addShape(
      new Ellipse_default(
        x1,
        y1,
        majorAxisX,
        majorAxisY,
        axisRatio,
        startAngle,
        endAngle
      )
    );
    return this;
  }
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
  drawFace(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
    this.activeLayer.addShape(
      new Face_default(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4)
    );
    return this;
  }
  _ltypeTable() {
    const t = new Table_default("LTYPE");
    const ltypes = Object.values(this.lineTypes);
    for (const lt of ltypes) t.add(lt);
    return t;
  }
  _layerTable() {
    const t = new Table_default("LAYER");
    const layers = Object.values(this.layers);
    for (const l of layers) t.add(l);
    return t;
  }
  /**
   * @see https://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
   * @see https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
   *
   * @param {string} variable
   * @param {array} values Array of "two elements arrays". [  [value1_GroupCode, value1_value], [value2_GroupCode, value2_value]  ]
   */
  header(variable, values) {
    this.headers[variable] = values;
    return this;
  }
  /**
   *
   * @param {string} unit see Drawing.UNITS
   */
  setUnits(unit) {
    let value = typeof _Drawing.UNITS[unit] != "undefined" ? _Drawing.UNITS[unit] : _Drawing.UNITS["Unitless"];
    this.header("INSUNITS", [[70, value]]);
    return this;
  }
  /** Generate additional DXF metadata which are required to successfully open resulted document
   * in AutoDesk products. Call this method before serializing the drawing to get the most
   * compatible result.
   */
  generateAutocadExtras() {
    if (!this.headers["ACADVER"]) {
      this.header("ACADVER", [[1, "AC1021"]]);
    }
    if (!this.lineTypes["ByBlock"]) {
      this.addLineType("ByBlock", "", []);
    }
    if (!this.lineTypes["ByLayer"]) {
      this.addLineType("ByLayer", "", []);
    }
    let vpTable = this.tables["VPORT"];
    if (!vpTable) {
      vpTable = this.addTable("VPORT");
    }
    let styleTable = this.tables["STYLE"];
    if (!styleTable) {
      styleTable = this.addTable("STYLE");
    }
    if (!this.tables["VIEW"]) {
      this.addTable("VIEW");
    }
    if (!this.tables["UCS"]) {
      this.addTable("UCS");
    }
    let appIdTable = this.tables["APPID"];
    if (!appIdTable) {
      appIdTable = this.addTable("APPID");
    }
    if (!this.tables["DIMSTYLE"]) {
      const t = new DimStyleTable_default("DIMSTYLE");
      this.tables["DIMSTYLE"] = t;
    }
    vpTable.add(new Viewport_default("*ACTIVE", 1e3));
    styleTable.add(new TextStyle_default("standard"));
    appIdTable.add(new AppId_default("ACAD"));
    this.modelSpace = this.addBlock("*Model_Space");
    this.addBlock("*Paper_Space");
    const d = new Dictionary_default();
    this.dictionary.addChildDictionary("ACAD_GROUP", d);
  }
  _tagsManager() {
    const manager = new TagsManager_default();
    const blockRecordTable = new Table_default("BLOCK_RECORD");
    const blocks = Object.values(this.blocks);
    for (const b of blocks) {
      const r = new BlockRecord_default(b.name);
      blockRecordTable.add(r);
    }
    const ltypeTable = this._ltypeTable();
    const layerTable = this._layerTable();
    manager.start("HEADER");
    manager.addHeaderVariable("HANDSEED", [[5, Handle_default.peek()]]);
    const variables = Object.entries(this.headers);
    for (const v of variables) {
      const [name, values] = v;
      manager.addHeaderVariable(name, values);
    }
    manager.end();
    manager.start("CLASSES");
    manager.end();
    manager.start("TABLES");
    ltypeTable.tags(manager);
    layerTable.tags(manager);
    const tables = Object.values(this.tables);
    for (const t of tables) {
      t.tags(manager);
    }
    blockRecordTable.tags(manager);
    manager.end();
    manager.start("BLOCKS");
    for (const b of blocks) {
      b.tags(manager);
    }
    manager.end();
    manager.start("ENTITIES");
    const layers = Object.values(this.layers);
    for (const l of layers) {
      l.shapesTags(this.modelSpace, manager);
    }
    manager.end();
    manager.start("OBJECTS");
    this.dictionary.tags(manager);
    manager.end();
    manager.push(0, "EOF");
    return manager;
  }
  toDxfString() {
    return this._tagsManager().toDxfString();
  }
  //AutoCAD Color Index (ACI)
  //http://sub-atomic.com/~moses/acadcolors.html
  static ACI = {
    LAYER: 0,
    RED: 1,
    YELLOW: 2,
    GREEN: 3,
    CYAN: 4,
    BLUE: 5,
    MAGENTA: 6,
    WHITE: 7
  };
  static LINE_TYPES = [
    { name: "CONTINUOUS", description: "______", elements: [] },
    { name: "DASHED", description: "_ _ _ ", elements: [5, -5] },
    { name: "DOTTED", description: ". . . ", elements: [0, -5] }
  ];
  static LAYERS = [
    { name: "0", colorNumber: 7, lineTypeName: "CONTINUOUS" }
  ];
  //https://www.autodesk.com/techpubs/autocad/acad2000/dxf/header_section_group_codes_dxf_02.htm
  static UNITS = {
    Unitless: 0,
    Inches: 1,
    Feet: 2,
    Miles: 3,
    Millimeters: 4,
    Centimeters: 5,
    Meters: 6,
    Kilometers: 7,
    Microinches: 8,
    Mils: 9,
    Yards: 10,
    Angstroms: 11,
    Nanometers: 12,
    Microns: 13,
    Decimeters: 14,
    Decameters: 15,
    Hectometers: 16,
    Gigameters: 17,
    "Astronomical units": 18,
    "Light years": 19,
    Parsecs: 20
  };
};
var Drawing_default = Drawing;

// src/index.ts
var index_default = Drawing_default;
