import { Circle } from "./shapes/Circle";
import { Rectangle } from "./shapes/Rectangle";
import { Text } from "./shapes/Text";

export class Node {

    private x: number;
    private y: number;

    private main: Rectangle;
    private headerDivisor: Rectangle;
    private headerStatus: Circle;
    private title: Text;
    
    private inputStatus: Circle;
    private inputText: Text;
    private outputStatus: Circle;
    private outputText: Text;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.main = new Rectangle(x, y + 0.15, 2, 0.7, [53 / 255, 53 / 255, 53 / 255]);
        this.headerDivisor = new Rectangle(x, y + 0.2, 2, 0.01, [20 / 255, 20 / 255, 20 / 255]);
        this.headerStatus = new Circle(x - 0.9, y + 0.35, 0.1, [46 / 255, 204 / 255, 112 / 255]);

        this.title = new Text(x - 0.15 ,y + 0.35, "SampleNode", 1.2, [145 / 255, 145 / 255, 145 / 255]);

        // const i = addRect(x, y + 0.15, 2, 0.7, [53 / 255, 53 / 255, 53 / 255]); // Main
        // addRect(x, y + 0.2, 2, 0.01, [20 / 255, 20 / 255, 20 / 255]); // Header divisor
        // addCircle(x - 0.9, y + 0.35, 0.25, [46 / 255, 204 / 255, 112 / 255]);

        // addText(x - 0.15 ,y + 0.35, "SampleNode", 1.2, [145 / 255, 145 / 255, 145 / 255]);

        // // Widget
        // // addRect(x, y, 1.85, 0.25, [34 / 255, 34 / 255, 34 / 255]);
        // addText(x - 0.6, y, "Input", 0.8, [120 / 255, 120 / 255, 120 / 255]);
        // addCircle(x - 0.9, y, 0.2, [145 / 255, 145 / 255, 145 / 255]);
        // addText(x + 0.55, y, "Output", 0.8, [145 / 255, 145 / 255, 145 / 255]);
        // addCircle(x + 0.9, y, 0.2, [145 / 255, 145 / 255, 145 / 255]);

    }

    public setPosition(x: number, y: number) {
        const xD = x - this.x;
        const yD = y - this.y;

        this.x = x;
        this.y = y;

        this.main.addPosition(xD, yD);
        this.headerDivisor.addPosition(xD, yD);
        this.headerStatus.addPosition(xD, yD);
        this.title.addPosition(xD, yD);
    }
}