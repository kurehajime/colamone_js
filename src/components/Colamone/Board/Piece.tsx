import { useEffect, useRef} from "react";
import Params from "../../../static/Params";
import bg from '../../../assets/bk.gif';
import { DrawUtil } from "../../../static/DrawUtil";
import './Piece.css';

type Props = {
    x: number
    y: number
    number: number
    goal: boolean
    display: string
    isHover: boolean
}

export default function Piece(props: Props) {
    const piece1 = useRef<SVGImageElement>(null)
    const piece2 = useRef<SVGImageElement>(null)
    const img_bk = useRef<HTMLImageElement>(new Image())

    useEffect(() => {
        if(props.display ==="none"){
            return
        }
        const canv_bk = document.createElement("canvas");
        const canvas = document.createElement("canvas");
        const drawPiece1 = (element: SVGImageElement, canvas: HTMLCanvasElement, number: number, goal: boolean, img_bk: HTMLImageElement | null = null) => {
            const cellSize = (Params.CANV_SIZE / 6) * 3;
            canvas.width = (Params.CANV_SIZE / 6) * 3;
            canvas.height = (Params.CANV_SIZE / 6) * 3;
            const ctx = canvas.getContext("2d");
            let color;
            const x = 0;
            const y = 0;
            // 外枠を描画
            if (number === 0) {
                return ctx;
            } else if (number > 0) {
                color = Params.COLOR_BLUE;
            } else {
                color = Params.COLOR_RED;
            }
            if (ctx) {
                ctx.clearRect(x, y, canvas.width, canvas.height)
                const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
                grad.addColorStop(0, "rgb(255, 255, 255)");
                grad.addColorStop(0.4, color);
                grad.addColorStop(1, color);
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(0, 0, 0, 1)";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = grad;
                ctx.beginPath();
                DrawUtil.fillRoundRect(
                    ctx,
                    x + cellSize / 10,
                    y + cellSize / 10,
                    cellSize - (1 * cellSize) / 5,
                    cellSize - (1 * cellSize) / 5,
                    cellSize / 20
                );
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                // 曇りエフェクト
                if (img_bk != null) {
                    ctx.globalAlpha = 0.35;
                    ctx.save();
                    ctx.clip();
                    ctx.drawImage(
                        drawBk(img_bk),
                        x + cellSize / 10,
                        y + cellSize / 10,
                        cellSize - (1 * cellSize) / 5,
                        cellSize - (1 * cellSize) / 5
                    );
                    ctx.restore();
                    ctx.globalAlpha = 1;
                }
            }
            element.setAttribute("href", canvas.toDataURL());
        };
        const drawPiece2 = (element: SVGImageElement, canvas: HTMLCanvasElement, number: number, goal: boolean) => {
            const cellSize = (Params.CANV_SIZE / 6) * 3;
            canvas.width = (Params.CANV_SIZE / 6) * 3;
            canvas.height = (Params.CANV_SIZE / 6) * 3;
            const ctx = canvas.getContext("2d");
            const x = 0;
            const y = 0;
            if (ctx) {
                ctx.clearRect(x, y, canvas.width, canvas.height)
                // 文字を描画。
                ctx.fillStyle = Params.COLOR_WHITE;
                let fontsize = Math.round(cellSize * 0.18);
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = fontsize + "pt 'Play',Arial";
                ctx.beginPath();
                // 数字を印字
                ctx.fillText(Math.abs(number).toString(), x + cellSize / 2, y + cellSize / 2);
                // 点を描画
                for (let i = 0; i <= Params.PIECES[number + 8].length - 1; i++) {
                    if (Params.PIECES[number + 8][i] === 0) {
                        continue;
                    }
                    const x_dot =
                        x +
                        cellSize / 4.16 +
                        (Math.floor(cellSize - (1 * cellSize) / 5) / 3) * Math.floor(i % 3.0);
                    const y_dot =
                        y +
                        cellSize / 4.16 +
                        (Math.floor(cellSize - (1 * cellSize) / 5) / 3) * Math.floor(i / 3.0);
                    ctx.fillStyle = Params.COLOR_WHITE;
                    ctx.beginPath();
                    ctx.arc(x_dot, y_dot, cellSize * 0.06, 0, Math.PI * 2, false);
                    ctx.fill();
                }
                if (goal) {
                    // 得点を印字
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "rgba(0, 0, 0, 1)";
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = Params.COLOR_WHITE;
                    fontsize = Math.round(cellSize * 0.5);
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    ctx.font = "bolder " + fontsize + "pt Play,Arial ";
                    ctx.beginPath();
                    ctx.fillText(Math.abs(number).toString(), x + cellSize / 2, y + cellSize / 2);
                    ctx.globalAlpha = 1;
                    ctx.shadowColor = "rgba(0, 0, 0, 0)";
                    ctx.shadowBlur = 0;
                }
            }

            element.setAttribute("href", canvas.toDataURL());
        }
        const drawBk = (img_bk: HTMLImageElement) => {
            const ctx_bk = canv_bk.getContext("2d");
            if (ctx_bk) {
                ctx_bk.drawImage(
                    img_bk,
                    0,
                    0,
                    Params.CANV_SIZE / Params.RATIO,
                    Params.CANV_SIZE / Params.RATIO,
                    0,
                    0,
                    Params.CANV_SIZE,
                    Params.CANV_SIZE
                );
            }
            return canv_bk;
        };

        if (piece1.current && piece2.current&&img_bk.current) {
            // 背景画像の読み込みが完了したら再実行
            if(!img_bk.current.src){
                img_bk.current.onload = () => {
                    if (piece1.current) {
                        drawPiece1(piece1.current, canvas, props.number, props.goal, img_bk.current);
                    }
                };
                img_bk.current.src = bg;
                
            }else{
                drawPiece1(piece1.current, canvas, props.number, props.goal);
            }
            if (img_bk.current.width !== 0) {
                drawPiece1(piece1.current, canvas, props.number, props.goal, img_bk.current);
            }
            drawPiece2(piece2.current, canvas, props.number, props.goal);
        }
    }, [props.display, props.goal, props.number])

    return (<g>
        <image ref={piece1} className={props.isHover ? 'easeInHover': props.goal ? 'goal' : 'easeIn'} x={props.x} y={props.y} width="83" height="83" display={props.display} />
        <image ref={piece2} className={props.isHover ? 'easeInHover': props.goal ? 'goal' : 'easeIn'} x={props.x} y={props.y} width="83" height="83" display={props.display} />
    </g>)
}