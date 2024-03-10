export class Color {
    public static RGB(r: number, g: number, b: number): number[] {
        return [r / 255, g / 255, b / 255];
    }
}