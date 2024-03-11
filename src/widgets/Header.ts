import { Color } from "../Color";
import { Circle } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";
import { Text } from "../shapes/Text";
import { Widget } from "./Widget";

export class Header extends Widget {
    private rect: Rectangle;
    private headerDivisor: Rectangle;
    private headerStatus: Circle;
    private title: Text;
    
    constructor(x: number, y: number, title: string) {
        super(x, y);

        this.rect = new Rectangle(x, y, 200, 30, Color.HEX(53, 53, 53));
        this.headerDivisor = new Rectangle(x, y + 15, 200, 1, Color.HEX(20, 20, 20));
        this.headerStatus = new Circle(x - 90, y, 5, Color.HEX(46, 204, 112));

        this.title = new Text(x - 30.0, y, title, 10, Color.HEX(145, 145, 145));

        this.addShape(this.rect);
        this.addShape(this.headerDivisor);
        this.addShape(this.headerStatus);
        this.addShape(this.title);
    }
}