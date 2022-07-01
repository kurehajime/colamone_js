
export class DrawUtil {
    static fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0, false);
        ctx.lineTo(x + w, y + h - r);
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5, false);
        ctx.lineTo(x + r, y + h);
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI, false);
        ctx.lineTo(x, y + r);
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
        ctx.closePath();
        ctx.fill();
    }
}