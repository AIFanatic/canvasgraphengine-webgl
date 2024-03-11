import { SHAPE, ShapeManager } from "../ShapeManager";
import { Shape } from "./Shape";

export class Circle extends Shape {
    constructor(x: number, y: number, r: number, c: number) {
        super(x, y, SHAPE.CIRCLE, c);
        this.index = ShapeManager.AddShape(x, y, SHAPE.CIRCLE, r, 0, 0, 0, c);
    }
}