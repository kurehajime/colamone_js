import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Piece } from "../../../model/Piece"
import Params from "../../../static/Params"
import { Rule } from "../../../static/Rule"
import { Util } from "../../../static/Util"
import PieceElement from './Piece'
import './Hover.css'
type Props = {
    x: number
    y: number
    h: number
    w: number
    map: number[]
    clickedX: number
    clickedY: number
    touch: boolean
    hover_piece: Piece[]
    turn_player: number
    demo: boolean
}
export default function Hover(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)
    const [hoverX, setHoverX] = useState(0)
    const [hoverY, setHoverY] = useState(0)
    const [cellNumber, setCellNumber] = useState<number | null>(null)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawHover(element: SVGImageElement, canvas: HTMLCanvasElement) {
        const canvSize = Params.CANV_SIZE * 3
        canvas.width = canvSize
        canvas.height = canvSize
        element.setAttribute("href", canvas.toDataURL())
    }

    useEffect(() => {
        if (bg1.current) {
            const canvas = document.createElement("canvas")
            drawHover(bg1.current, canvas)
        }
    }, [props.hover_piece])

    useEffect(() => {
        const plus = (Params.CANV_SIZE / 6) / 2
        setHoverX(props.clickedX - plus)
        setHoverY(props.clickedY - plus)
        setCellNumber(Util.pointToCellNumber(
            props.w,
            props.h,
            props.clickedX,
            props.clickedY
        ))
    }, [props.clickedX, props.clickedY])

    const mouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const plus = (Params.CANV_SIZE / 6) / 2
        setHoverX(e.nativeEvent.offsetX - plus)
        setHoverY(e.nativeEvent.offsetY - plus)
        setCellNumber(Util.pointToCellNumber(
            props.w,
            props.h,
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        ))
    }

    const canput = useCallback((): number[] => {
        if (props.hover_piece.length === 0 && props.touch) {
            return []
        }
        const target = props.hover_piece.length > 0 ? props.map.indexOf(props.hover_piece[0].number) : cellNumber
        if (target && props.map[target] > 0 && props.turn_player === 1 && !props.demo) {
            return Rule.getCanMovePanelX(target, new Int8Array(props.map))
        }
        return []
    }, [props.map, props.touch, props.hover_piece, props.turn_player, props.demo, cellNumber])

    const getSelectPiece = useCallback((): ReactElement[] => {
        const canvSize = Params.CANV_SIZE
        const cellSize = canvSize / 6
        const plus = (Params.CANV_SIZE / 6) / 2
        const hx = hoverX + plus
        const hy = hoverY + plus
        const x = hx - (hx % cellSize)
        const y = hy - (hy % cellSize)
        if (hoverX + plus !== 0 && hoverY + plus !== 0 && !props.demo) {
            return [<rect key={10000} x={x} y={y} width={cellSize} height={cellSize} fill="#7fed7f" fillOpacity="0.3" />]
        }
        return []
    }, [cellNumber, props.demo])

    const puts = canput()
    let cursor = ''
    switch (true) {
        case props.hover_piece.length > 0:
            cursor = 'grabbing'
            break
        case puts.length > 0:
            cursor = 'grab'
            break
        default:
            break
    }
    // ちょっとでも再描画を減らす
    const _hoverX = props.hover_piece.length !== 0 ? hoverX : 0
    const _hoverY = props.hover_piece.length !== 0 ? hoverY : 0
    const hover = useMemo(() => {
        const p = props.hover_piece[0]
        return ([<PieceElement
            key={0}
            x={_hoverX}
            y={_hoverY}
            number={props.hover_piece.length > 0 ? p.number : 0}
            goal={false}
            display={props.hover_piece.length > 0 ? p.display : "none"}
            isHover={true}
        />])
    }, [props.hover_piece, _hoverX, _hoverY])

    return (<g className={"hover " + cursor} onMouseMove={mouseMove}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        {
            hover.concat(
                puts.map(p => {
                    const canvSize = Params.CANV_SIZE
                    const cellSize = canvSize / 6
                    const x = Math.floor(p / 10)
                    const y = Math.floor(p % 10)
                    const cx = x * cellSize + (cellSize / 2)
                    const cy = y * cellSize + (cellSize / 2)
                    const r = (cellSize / 5) - (cellSize / 10)
                    return (
                        <circle
                            key={1000 + p}
                            className='canPut' cx={cx} cy={cy} r={r} fill="#7fed7f" fillOpacity="0.5"></circle>
                    )
                }
                )
            ).concat(
                getSelectPiece()
            )
        }
    </g >)

}