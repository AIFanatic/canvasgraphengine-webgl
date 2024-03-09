import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { ShapeManager } from "./ShapeManager";

import { Rectangle } from "./shapes/Rectangle";
import { Circle } from "./shapes/Circle";
import { Text } from "./shapes/Text";
import { Node } from "./Node";

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

        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 10000 );
        this.scene.add( this.camera );

        // setInterval(() => {
        //     console.log(this.camera.matrixWorld.elements);
        //     console.log(this.camera.projectionMatrix.elements);
        // }, 1000);

        this.camera.position.z = 1;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableRotate = false;
        this.controls.minZoom = 100;
        this.controls.update();
        this.controls.minZoom = 0;
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.RIGHT,
            RIGHT: THREE.MOUSE.LEFT,
        }

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        ShapeManager.setup(this.scene).then(() => {

            let n = 20;
            for (let x = 0; x < n; x++) {
                for (let y = 0; y < n; y++) {
                    const node = new Node(x * 3, y * 3);
                }
            }


            // console.log(ShapeManager.objectCount)

            const node = new Node(0, 0);

            let mouseDown = false;
            document.addEventListener("mousedown", () => {mouseDown = true});
            document.addEventListener("mouseup", () => {mouseDown = false});
            document.addEventListener("mousemove", (e) => {
                if (!mouseDown) return;
                if (e.buttons !== 2) return;

                
                let x = (e.clientX - canvas.width / 4) / this.camera.zoom;
                let y = (canvas.height / 4 - e.clientY) / this.camera.zoom;

                x += this.camera.position.x;
                y += this.camera.position.y;
                // console.log(e.clientX, e.clientY, x, y, this.camera.zoom);
                node.setPosition(x, y);
            });

            // const c = new Circle(0,0,1.0,[1,0,0])


            // const n = new Node(0, 0);
            // setTimeout(() => {
            //     n.setPosition(1, 0);
            // }, 2000);
            
            // const r = new Rectangle(0, 0, 2, 1, [1, 0, 0]);
            // const c = new Circle(0, 0, 0.5, [1, 1, 0]);
            // const t = new Text(0, 0, "Hello", 2, [0, 1, 0]);
            // setTimeout(() => {
            //     r.setPosition(1, 0);
            // }, 2000);

            // setTimeout(() => {
            //     c.setPosition(-1, 0);
            // }, 4000);

            // setTimeout(() => {
            //     t.setPosition(-1, 0);
            // }, 6000);


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