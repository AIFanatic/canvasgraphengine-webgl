import ShapeVertex from "./shaders/ShapeVertex.glsl";
import ShapeFragment from "./shaders/ShapeFragment.glsl";
import FontPNG from "./font.png";

import * as THREE from "three";
import { TextHandler } from "./TextHandler";

export enum SHAPE {
    CIRCLE,
    RECT,
    TEXT
}

export class ShapeManager {
    private static textTextureResolution = 1024;
    private static textHandler = new TextHandler(ShapeManager.textTextureResolution);

    private static scene: THREE.Scene;
    private static shapeMaterial: THREE.ShaderMaterial;
    private static shapeMesh: THREE.Points;

    private static MAX_OBJECTS = 1000000;

    private static positions = new Float32Array(ShapeManager.MAX_OBJECTS * 3);
    private static shapes = new Float32Array(ShapeManager.MAX_OBJECTS * 3);
    private static colors = new Float32Array(ShapeManager.MAX_OBJECTS * 3);

    public static positionAttribute = new THREE.Float32BufferAttribute(ShapeManager.positions, 3);
    public static shapeAttribute = new THREE.Float32BufferAttribute(ShapeManager.shapes, 3);
    public static colorAttribute = new THREE.Float32BufferAttribute(ShapeManager.colors, 3);

    public static objectCount = 0;

    public static async setup(canvas: HTMLCanvasElement, scene: THREE.Scene) {
        return new Promise<void>((resolve, reject) => {
            ShapeManager.scene = scene;
    
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(FontPNG, (fontTexture) => {
                const g = new THREE.BufferGeometry();
                g.setDrawRange(0,0);
                g.setAttribute("position", ShapeManager.positionAttribute);
                g.setAttribute("shape", ShapeManager.shapeAttribute);
                g.setAttribute("color", ShapeManager.colorAttribute);
    
                ShapeManager.shapeMaterial = new THREE.ShaderMaterial({
                    vertexShader: ShapeVertex,
                    fragmentShader: ShapeFragment,
                    transparent: true,
                    depthTest: false,
    
                    uniforms: {
                        canvasWidth: {value: canvas.clientWidth},
                        canvasHeight: {value: canvas.clientHeight},
                        fontTexture: {value: fontTexture},
                        textTexture: {value: ShapeManager.textHandler.getTexture()},
                        textTextureResolution: {value: ShapeManager.textTextureResolution}
                    }
                });
    
                ShapeManager.shapeMesh = new THREE.Points(g, ShapeManager.shapeMaterial);
                ShapeManager.scene.add(ShapeManager.shapeMesh);

                resolve();
            });
        })
    }

    public static resize(canvas: HTMLCanvasElement) {
        ShapeManager.shapeMaterial.uniforms.canvasWidth.value = canvas.clientWidth;
        ShapeManager.shapeMaterial.uniforms.canvasHeight.value = canvas.clientHeight;
    }

    public static SetPosition(i: number, x: number, y: number) {
        if (i >= ShapeManager.objectCount) throw Error("Cannot set the position of an object lower than the object count");

        const o = 3 + 3 + 3; // vec3 position, vec3 shape, vec3 color
        ShapeManager.positionAttribute.array[i * o + 0] = x;
        ShapeManager.positionAttribute.array[i * o + 1] = y;
        ShapeManager.positionAttribute.array[i * o + 2] = 0;
        ShapeManager.positionAttribute.needsUpdate = true;
    }

    public static SetShape(i: number, type: SHAPE, param1: number, param2: number) {
        if (i >= ShapeManager.objectCount) throw Error("Cannot set the shape of an object lower than the object count");

        const o = 3 + 3 + 3; // vec3 position, vec3 shape, vec3 color
        ShapeManager.shapeAttribute.array[i * o + 0] = type;
        ShapeManager.shapeAttribute.array[i * o + 1] = param1;
        ShapeManager.shapeAttribute.array[i * o + 2] = param2;
        ShapeManager.shapeAttribute.needsUpdate = true;
    }

    public static SetColor(i: number, r: number, g: number, b: number) {
        if (i >= ShapeManager.objectCount) throw Error("Cannot set the color of an object lower than the object count");

        const o = 3 + 3 + 3; // vec3 position, vec3 shape, vec3 color
        ShapeManager.colorAttribute.array[i * o + 0] = r;
        ShapeManager.colorAttribute.array[i * o + 1] = g;
        ShapeManager.colorAttribute.array[i * o + 2] = b;
        ShapeManager.colorAttribute.needsUpdate = true;
    }

    public static AddShape(x: number, y: number, shape: SHAPE, param1: number, param2: number, r: number, g: number, b: number): number {
        const objectIndex = ShapeManager.objectCount;
        
        ShapeManager.objectCount += 1;
        
        ShapeManager.SetPosition(objectIndex, x, y);
        ShapeManager.SetShape(objectIndex, shape, param1, param2);
        ShapeManager.SetColor(objectIndex, r, g, b);

        ShapeManager.shapeMesh.geometry.setDrawRange(0, ShapeManager.objectCount * 3);

        return objectIndex;
    }

    public static AddText(x: number, y: number, text: string, fontSize: number, r: number, g: number, b: number): number {
        const objectIndex = ShapeManager.objectCount;
        
        ShapeManager.objectCount += 1;
        
        const textIndex = ShapeManager.textHandler.addText(text);
        ShapeManager.SetPosition(objectIndex, x, y);
        ShapeManager.SetShape(objectIndex, SHAPE.TEXT, fontSize, textIndex);
        ShapeManager.SetColor(objectIndex, r, g, b);

        ShapeManager.shapeMesh.geometry.setDrawRange(0, ShapeManager.objectCount * 3);

        return objectIndex;
    }
}