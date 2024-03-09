import * as THREE from "three";

export class TextHandler {
    private textData: Float32Array;
    private textTexture: THREE.DataTexture;

    private currentOffset: number;

    constructor(textureSize: number) {
        this.textData = new Float32Array(textureSize * textureSize);

        this.textTexture = new THREE.DataTexture(this.textData, textureSize, textureSize);
        this.textTexture.format = THREE.RedFormat;
        this.textTexture.type = THREE.FloatType;
        this.textTexture.needsUpdate = true;
        this.textTexture.wrapS = THREE.ClampToEdgeWrapping;
        this.textTexture.wrapT = THREE.ClampToEdgeWrapping;

        this.currentOffset = 0;
    }

    private getCharIndex(char: string): number {
        const asciiValue = char.charCodeAt(0);
        
        const adjustedAscii = asciiValue - 32;
        
        const xIndex = adjustedAscii % 16;
        const yIndex = 13 - Math.floor(adjustedAscii / 16); // Adjust yIndex based on your specific layout
    
        return yIndex * 16 + xIndex;
    }
    
    private textToCharIndexArray(text: string): number[] {
        let charIndices: number[] = [];
        for (let c of text) {
            charIndices.push(this.getCharIndex(c));
        }
        return charIndices;
    }

    public getTexture(): THREE.DataTexture {
        return this.textTexture;
    }

    public addText(text: string): number {
        const textLen = text.length;

        const textIndices = this.textToCharIndexArray(text);
        const textOffset = this.currentOffset;

        this.textData.set([textLen, ...textIndices], textOffset);
        this.textTexture.needsUpdate = true;

        this.currentOffset += textLen + 1;

        return textOffset;
    }
}