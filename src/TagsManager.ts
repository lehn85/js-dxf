import { HeaderValue } from "./Types.js";

class TagsManager {
    lines: (string | number)[];

    constructor() {
        this.lines = [];
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    point(x: number, y: number, z: number = 0): void {
        this.push(10, x);
        this.push(20, y);
        this.push(30, z);
    }

    /**
     *
     * @param {string} name The name of the section
     */
    start(name: string): void {
        this.push(0, "SECTION");
        this.push(2, name);
    }

    end(): void {
        this.push(0, "ENDSEC");
    }

    addHeaderVariable(name: string, tagsElements: HeaderValue[]): void {
        this.push(9, `$${name}`);
        tagsElements.forEach((tagElement) => {
            this.push(tagElement[0], tagElement[1]);
        });
    }

    push(code: number | string, value: string | number): void {
        this.lines.push(code, value);
    }

    toDxfString(): string {
        return this.lines.join("\n");
    }
}

export default TagsManager;
