import { Color } from "../Color";
import { Circle } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";
import { Text } from "../shapes/Text";
import { Widget } from "./Widget";

export class Slot extends Widget {
    private rect: Rectangle;

    constructor(x: number, y: number) {
        super(x, y);

        this.rect = new Rectangle(x, y, 200, 30, Color.RGB(53, 53, 53));
        this.addShape(this.rect);
    }

    public addInput(label: string) {
        const labelLength = label.length / 2 / 10;
        const inputStatus = new Circle(this.x - 90, this.y, 4, Color.RGB(70, 70, 70));
        const inputLabel = new Text(this.x + labelLength - 60, this.y, label, 10, Color.RGB(145, 145, 145));
        this.addShape(inputStatus);
        this.addShape(inputLabel);
    }

    public addOutput(label: string) {
        const labelLength = label.length / 2;
        const outputStatus = new Circle(this.x + 90, this.y, 4, Color.RGB(70, 70, 70));
        const outputLabel = new Text(this.x - labelLength + 65, this.y, label, 10, Color.RGB(145, 145, 145));
        this.addShape(outputStatus);
        this.addShape(outputLabel);
    }
}