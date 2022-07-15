import { useEffect, useRef } from "react"
import Params from "../../../static/Params"
import { DrawUtil } from "../../../static/DrawUtil"
type Props = {
    show: boolean
    x: number
    y: number
    h: number
    w: number
    demo_inc: number
}
export default function Cover(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawCover(element: SVGImageElement, canvas: HTMLCanvasElement, demo_inc: number) {
        // 背景
        const ctx_cover = canvas.getContext('2d')
        const canvSize = Params.CANV_SIZE * 3
        const cellSize = Params.CANV_SIZE / 6 * 3
        canvas.width = canvSize
        canvas.height = canvSize
        if (ctx_cover) {
            ctx_cover.clearRect(0, 0, canvSize, canvSize)
            ctx_cover.globalAlpha = 0.50
            ctx_cover.fillStyle = '#000000'
            ctx_cover.fillRect(0, 0, canvSize, canvSize)

            // 枠
            const x = cellSize * 2
            const y = cellSize * 3.5
            ctx_cover.shadowBlur = 20
            ctx_cover.shadowColor = 'rgba(0, 0, 0, 0.3)'
            ctx_cover.shadowOffsetX = 5
            ctx_cover.shadowOffsetY = 5
            ctx_cover.globalAlpha = 0.8
            ctx_cover.fillStyle = Params.COLOR_WHITE
            ctx_cover.beginPath()
            DrawUtil.fillRoundRect(ctx_cover as CanvasRenderingContext2D, x, y, cellSize * 2, cellSize * 1, cellSize / 7)
            ctx_cover.shadowColor = 'rgba(0, 0, 0, 0)'
            ctx_cover.shadowBlur = 0
            ctx_cover.shadowOffsetX = 0
            ctx_cover.shadowOffsetY = 0

            // 文字
            let fontsize = Math.round(cellSize * 0.5)
            let message = 'Play'
            message += (demo_inc % 10 == 0) ? " " : ""
            ctx_cover.shadowBlur = 0
            ctx_cover.shadowOffsetX = 0
            ctx_cover.shadowOffsetY = 0
            ctx_cover.shadowColor = 'rgba(0, 0, 0, 0)'
            ctx_cover.font = 'bold ' + fontsize + 'px Play,sans-serif'
            ctx_cover.globalAlpha = 1
            ctx_cover.fillStyle = Params.COLOR_LINE
            ctx_cover.textBaseline = 'middle'
            ctx_cover.textAlign = 'center'
            ctx_cover.beginPath()
            ctx_cover.fillText(message, cellSize * 3, cellSize * 4)
            // 文字２
            message = 'colamone'
            fontsize = Math.round(cellSize * 1)
            ctx_cover.font = 'bold ' + fontsize + 'px Play,sans-serif'
            ctx_cover.fillStyle = Params.COLOR_WHITE
            ctx_cover.shadowBlur = 0
            ctx_cover.beginPath()
            ctx_cover.fillText(message, cellSize * 3, cellSize * 2)
        }
        element.setAttribute("href", canvas.toDataURL())
    }
    useEffect(() => {
        if (bg1.current) {
            const canvas = document.createElement("canvas")
            drawCover(bg1.current, canvas, props.demo_inc)
        }
    }, [props.demo_inc])

    return (<g display={props.show ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)

}