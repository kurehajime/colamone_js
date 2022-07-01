import { useEffect, useRef } from "react";
import Params from "../../static/Params";
type Props = {
    x: number
    y: number
    h: number
    w: number
}
export default function Background(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)
    const bg2 = useRef<SVGImageElement>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawBoard(element: SVGImageElement, canvas: HTMLCanvasElement) {
        const canvSize = Params.CANV_SIZE * 3;
        const cellSize = canvSize / 6;
        canvas.width = canvSize;
        canvas.height = canvSize;
        const ctx_board = canvas.getContext("2d");
        if (ctx_board) {
            ctx_board.clearRect(0, 0, canvSize, canvSize);
            const grad = ctx_board.createLinearGradient(0, 0, canvSize, canvSize);
            grad.addColorStop(0, Params.COLOR_PANEL_6);
            grad.addColorStop(0.3, Params.COLOR_PANEL_5);
            grad.addColorStop(1, Params.COLOR_PANEL_4);
            for (let x = 0; x < 6; x++) {
                for (let y = 0; y < 6; y++) {
                    // パネル描画
                    ctx_board.strokeStyle = Params.COLOR_LINE;
                    if (y === 0) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_1;
                    } else if (y === 5) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_2;
                    } else if ((x + y) % 2 === 0) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_3;
                    } else {
                        ctx_board.fillStyle = Params.COLOR_PANEL_4;
                        ctx_board.fillStyle = grad;
                    }
                    ctx_board.beginPath();
                    ctx_board.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx_board.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        element.setAttribute("href", canvas.toDataURL());
    }
    function drawBoard2(element: SVGImageElement, canvas: HTMLCanvasElement) {
        const canvSize = Params.CANV_SIZE * 3;
        const cellSize = canvSize / 6;
        const ctx_board2 = canvas.getContext("2d");
        if (ctx_board2) {
            ctx_board2.clearRect(0, 0, canvSize, canvSize);
            ctx_board2.globalAlpha = 0.07;
            ctx_board2.fillStyle = Params.COLOR_WHITE;
            ctx_board2.beginPath();
            ctx_board2.arc(
                cellSize * 1,
                -3 * cellSize,
                7 * cellSize,
                0,
                Math.PI * 2,
                false
            );
            ctx_board2.fill();
        }
        element.setAttribute("href", canvas.toDataURL());
    }

    useEffect(() => {
        if (bg1.current && bg2.current) {
            const canvas = document.createElement("canvas");
            drawBoard(bg1.current, canvas);
            drawBoard2(bg2.current, canvas);
        }
    })

    return (<g>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        <image ref={bg2} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g>)

}