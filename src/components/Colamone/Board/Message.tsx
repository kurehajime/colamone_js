import { useEffect, useRef } from "react"
import Params from "../../../static/Params"
import { CanvasUtil } from "../../../static/canvas/CanvasUtil"
type Props = {
    x: number
    y: number
    h: number
    w: number
    message: string
}
export default function Message(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawMessage(element: SVGImageElement, canvas: HTMLCanvasElement) {
        // 背景
        const canvSize = Params.CANV_SIZE * 3
        const cellSize = Params.CANV_SIZE / 6 * 3
        const ctx_overlay = canvas.getContext('2d')
        canvas.width = canvSize
        canvas.height = canvSize
        if (ctx_overlay) {
            const x = cellSize * 1.3
            const y = cellSize * 2.5

            ctx_overlay.clearRect(0, 0, canvSize, canvSize)

            if (props.message === '') {
                element.setAttribute("href", canvas.toDataURL())
                return
            }
            ctx_overlay.shadowBlur = 10
            ctx_overlay.shadowColor = 'rgba(100, 100, 100, 0.5)'
            ctx_overlay.shadowOffsetX = 5
            ctx_overlay.shadowOffsetY = 5

            ctx_overlay.globalAlpha = 0.9
            ctx_overlay.fillStyle = Params.COLOR_WHITE
            CanvasUtil.fillRoundRect(ctx_overlay as CanvasRenderingContext2D, x, y, cellSize * 3.4, cellSize * 1, cellSize / 7)

            const fontsize = Math.round(cellSize * 0.36)
            ctx_overlay.shadowBlur = 0
            ctx_overlay.shadowOffsetX = 0
            ctx_overlay.shadowOffsetY = 0
            ctx_overlay.shadowColor = 'rgba(0, 0, 0, 0)'
            ctx_overlay.font = 'bold ' + fontsize + 'px Play,sans-serif'
            ctx_overlay.globalAlpha = 1
            ctx_overlay.fillStyle = Params.COLOR_LINE
            ctx_overlay.textBaseline = 'middle'
            ctx_overlay.textAlign = 'center'
            ctx_overlay.beginPath()
            ctx_overlay.fillText(props.message, cellSize * 3, cellSize * 3)
        }
        element.setAttribute("href", canvas.toDataURL())
    }

    useEffect(() => {
        if (bg1.current && props.message !== '') {
            const canvas = document.createElement("canvas")
            drawMessage(bg1.current, canvas)
        }
    }, [props.message])

    return (<g display={props.message !== '' ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)

}