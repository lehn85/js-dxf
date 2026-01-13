export type Point2D = [number, number];
export type Point3D = [number, number, number];
export type HeaderValue = [number, number | string]; // Value can be string too based on usage
export type TagsElements = HeaderValue[];

export type Unit =
    | "Unitless"
    | "Inches"
    | "Feet"
    | "Miles"
    | "Millimeters"
    | "Centimeters"
    | "Meters"
    | "Kilometers"
    | "Microinches"
    | "Mils"
    | "Yards"
    | "Angstroms"
    | "Nanometers"
    | "Microns"
    | "Decimeters"
    | "Decameters"
    | "Hectometers"
    | "Gigameters"
    | "Astronomical units"
    | "Light years"
    | "Parsecs";

export type HorizontalAlignment = "left" | "center" | "right";
export type VerticalAlignment = "baseline" | "bottom" | "middle" | "top";

export interface RenderableToDxf {
    tags(manager: any): void; // TagsManager, using any to avoid circular dependency for now, or interface
}
