import { Header } from "./widgets/Header";
import { Widget } from "./widgets/Widget";

export class Node {

    private x: number;
    private y: number;

    private header: Header;
    private widgets: Widget[];
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.header = new Header(this.x, this.y, "SampleNode");
        this.widgets = [];
    }

    public addWidget(widget: Widget) {
        this.widgets.push(widget);
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.header.setPosition(this.x, this.y);
        for (let widget of this.widgets) {
            widget.setPosition(this.x, this.y);
        }
    }
}