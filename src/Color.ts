export class Color {
    public static RGB(r: number, g: number, b: number): number[] {
        return [r / 255, g / 255, b / 255];
    }

    // public static HEX(r: number, g: number, b: number): number {
    //     const rp = Math.max(0, Math.min(255, r));
    //     const gp = Math.max(0, Math.min(255, g));
    //     const bp = Math.max(0, Math.min(255, b));

    //     return (rp << 16) | (gp << 8) | bp;
    // }

    public static HEX(r: number, g: number, b: number): number {
        return r + g * 256.0 + b * 256.0 * 256.0;
    }
      
}