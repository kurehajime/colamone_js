import Params from "../Params"
import { CanvasUtil } from "./CanvasUtil"

export class MessageDraw {
    /**
     * 盤面を描画してCANVASを返す。
     */
    static drawMessage(message: string): string {
        const canvas = document.createElement("canvas")
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

            if (message === '') {
                return canvas.toDataURL()
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
            ctx_overlay.fillText(message, cellSize * 3, cellSize * 3)
        }
        return canvas.toDataURL()
    }
}