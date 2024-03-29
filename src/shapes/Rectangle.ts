import { SHAPE, ShapeManager } from "../ShapeManager";
import { Shape } from "./Shape";

export class Rectangle extends Shape {
    constructor(x: number, y: number, w: number, h: number, c: number) {
        super(x, y, SHAPE.RECT, c);
        this.index = ShapeManager.AddShape(x, y, SHAPE.RECT, w, h, 0, 0, c);
    }
}