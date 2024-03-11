import { SHAPE, ShapeManager } from "../ShapeManager";
import { Shape } from "./Shape";

export class Line extends Shape {
    constructor(x: number, y: number, x1: number, y1: number, c: number) {
        super(x, y, SHAPE.RECT, c);
        this.index = ShapeManager.AddShape(x, y, SHAPE.RECT, w, h, 0, 0, c);
    }
}