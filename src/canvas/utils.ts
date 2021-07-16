export class Utils {
    // 角丸
    public static FillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);

        ctx.bezierCurveTo(x + w, y + 0, x + w, y + 0, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.bezierCurveTo(x + w, y + h, x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.bezierCurveTo(x + 0, y + h, x + 0, y + h, x + 0, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.bezierCurveTo(x + 0, y + 0, x + 0, y + 0, x + r, y);
        ctx.closePath();
        ctx.fill();

    }
}
