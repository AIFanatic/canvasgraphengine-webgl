import { SHAPE, ShapeManager } from "../ShapeManager";
import { Shape } from "./Shape";

export class Text extends Shape {
    constructor(x: number, y: number, text: string, fontSize: number, c: number[]) {
        super(x, y, SHAPE.TEXT, c);
        this.index = ShapeManager.AddText(x, y, text, fontSize, c[0], c[1], c[2]);
    }
}