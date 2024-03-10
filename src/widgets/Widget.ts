import { Shape } from "../shapes/Shape";

export class Widget {
    public x: number;
    public y: number;

    public offsety: number;

    private shapes: Shape[];

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.offsety = this.y;
        this.shapes = [];
    }

    protected addShape(shape: Shape) {
        this.shapes.push(shape);
    }

    public setPosition(x: number, y: number) {
        y += this.offsety;
        const xD = x - this.x;
        const yD = y - this.y;

        this.x = x;
        this.y = y;

        for (let shape of this.shapes) {
            shape.addPosition(xD, yD);
        }

    }
}