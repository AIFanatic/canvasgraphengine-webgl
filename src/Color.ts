export class Color {
    public static RGB(r: number, g: number, b: number): number[] {
        return [r / 255, g / 255, b / 255];
    }
    
    public static HEX(r: number, g: number, b: number): number {
        return r + g * 256.0 + b * 256.0 * 256.0;
    }
      
}