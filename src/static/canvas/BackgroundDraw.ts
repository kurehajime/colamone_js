import Params from "../Params"

export class BackgroundDraw {

    /**
     * 盤面を描画してDataURLを返す。
     */
    static drawBoard(): string {
        const canvas: HTMLCanvasElement = document.createElement("canvas")
        const canvSize = Params.CANV_SIZE * 3
        const cellSize = canvSize / 6
        canvas.width = canvSize
        canvas.height = canvSize
        const ctx_board = canvas.getContext("2d")
        if (ctx_board) {
            ctx_board.clearRect(0, 0, canvSize, canvSize)
            const grad = ctx_board.createLinearGradient(0, 0, canvSize, canvSize)
            grad.addColorStop(0, Params.COLOR_PANEL_6)
            grad.addColorStop(0.3, Params.COLOR_PANEL_5)
            grad.addColorStop(1, Params.COLOR_PANEL_4)
            for (let x = 0; x < 6; x++) {
                for (let y = 0; y < 6; y++) {
                    // パネル描画
                    ctx_board.strokeStyle = Params.COLOR_LINE
                    if (y === 0) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_1
                    } else if (y === 5) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_2
                    } else if ((x + y) % 2 === 0) {
                        ctx_board.fillStyle = Params.COLOR_PANEL_3
                    } else {
                        ctx_board.fillStyle = Params.COLOR_PANEL_4
                        ctx_board.fillStyle = grad
                    }
                    ctx_board.beginPath()
                    ctx_board.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
                    ctx_board.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
                }
            }
        }
        return canvas.toDataURL()
    }
    static drawBoard2() {
        const canvas: HTMLCanvasElement = document.createElement("canvas")
        const canvSize = Params.CANV_SIZE * 3
        const cellSize = canvSize / 6
        const ctx_board2 = canvas.getContext("2d")
        if (ctx_board2) {
            ctx_board2.clearRect(0, 0, canvSize, canvSize)
            ctx_board2.globalAlpha = 0.07
            ctx_board2.fillStyle = Params.COLOR_WHITE
            ctx_board2.beginPath()
            ctx_board2.arc(
                cellSize * 1,
                -3 * cellSize,
                7 * cellSize,
                0,
                Math.PI * 2,
                false
            )
            ctx_board2.fill()
        }
        return canvas.toDataURL()
    }
}