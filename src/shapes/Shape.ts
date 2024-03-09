import { SHAPE, ShapeManager } from "../ShapeManager";

export class Shape {
    public x: number;
    public y: number;
    public shape: SHAPE;
    public color: number[];
    
    protected index: number;

    constructor(x: number, y: number, shape: SHAPE, color: number[]) {
        this.x = x;
        this.y = y;
        this.shape = shape;
        this.color = color;
    }

    public setPosition(x: number, y: number) {
        ShapeManager.SetPosition(this.index, x, y);
    }

    public addPosition(xD: number, yD: number) {
        this.x += xD;
        this.y += yD;

        this.setPosition(this.x, this.y);
    }
}