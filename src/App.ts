import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { SHAPE, ShapeManager } from "./ShapeManager";

import { Node } from "./Node";
import { Slot } from "./widgets/Slot";

export class App {
    private canvas: HTMLCanvasElement;

    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private controls: OrbitControls;
    private stats: Stats;

    private last: number = performance.now();


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202020);
        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

        this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10000);
        // this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 10000 );
        this.scene.add( this.camera );

        this.camera.position.z = 1;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.controls.minZoom = 1;
        this.controls.update();
        this.controls.minZoom = 0;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            RIGHT: THREE.MOUSE.LEFT,
        }

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        ShapeManager.setup(this.canvas, this.scene).then(() => {

            document.body.onresize = (ev => {
                this.renderer.setSize(this.canvas.parentElement.clientWidth, this.canvas.parentElement?.clientHeight)
                ShapeManager.resize(this.canvas);
            })

            let n = 20;
            for (let x = 0; x < n; x++) {
                for (let y = 0; y < n; y++) {
                    const o = 250;
                    const node = new Node(x * o, y * o);

                    const slot = new Slot(x * o, y * o + 30);
                    slot.addInput("Input");
                    slot.addOutput("Out");
        
                    node.addWidget(slot);

                    makeLine(x * o + 100, y * o + 30, x * o + 100 + 50, y * o + 30, 1.0);
                }
            }

            // let mouseDown = false;
            // document.addEventListener("mousedown", () => {mouseDown = true});
            // document.addEventListener("mouseup", () => {mouseDown = false});
            // document.addEventListener("mousemove", (e) => {
            //     if (!mouseDown) return;
            //     if (e.buttons !== 2) return;

                
            //     let x = (e.clientX - canvas.width / 4) / this.camera.zoom;
            //     let y = (e.clientY - canvas.height / 4) / this.camera.zoom;

            //     x += this.camera.position.x;
            //     y += this.camera.position.y;
            //     // console.log(e.clientX, e.clientY, x, y, this.camera.zoom);
            //     node.setPosition(x, y);
            // });

            function makeLine(x0, y0, x1, y1, lineWidth) {
                ShapeManager.AddShape(x0, y0, SHAPE.LINE, x1, y1, lineWidth, 0, 0xff0000);

                // ShapeManager.AddShape(x0, y0, SHAPE.CIRCLE, 10, 0, 0, 0, Color.HEX(255, 0, 0));
                // ShapeManager.AddShape(x1, y1, SHAPE.CIRCLE, 10, 0, 0, 0, Color.HEX(255, 255, 0));
            }

            this.render();
        });
    }

    private render() {
        const now = performance.now();
        let delta = ( now - this.last ) / 1000;

        if ( delta > 1 ) delta = 1; // safety cap on large deltas
        this.last = now;


        this.stats.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => {this.render()});
    }
}