import Params from "../../static/Params"
import Background from './Board/Background'
import PieceElement from './Board/Piece'
import { useRef, useState } from "react"
import { Piece } from "../../model/Piece"
import Cover from "./Board/Cover"
import Message from "./Board/Message"
import { Hand } from "../../static/Rule"
import Hover from "./Board/Hover"
import { Util } from "../../static/Util"
type Props = {
    map: number[]
    hover: number | null
    cover: boolean
    message: string
    hand: Hand | null
    clickCell: (cellNumber: number) => void
}
export default function Board(props: Props) {
    const svg = useRef<SVGSVGElement>(null)
    const [hoverX, setHoverX] = useState(0)
    const [hoverY, setHoverY] = useState(0)
    const [touch, setTouch] = useState(false)


    const makePiece = (number: number): Piece => {
        return {
            number: number,
            x: 0,
            y: 0,
            goal: false,
            display: "none"
        }
    }
    const makePieces = (): Piece[] => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8]
        const pieces = []
        for (const i of numbers) {
            pieces.push(makePiece(i))
        }
        return pieces
    }
    const cellNumberToPoint = (width: number, height: number, cellNumber: number) => {
        const cellSize = width / 6
        const x = ~~(cellNumber / 10) * cellSize
        const y = ~~(cellNumber % 10) * cellSize
        return { x, y }
    }
    const mapToPieces = (width: number, height: number, map: number[]): Piece[] => {
        const pieces = makePieces()
        for (let m = 0; m < map.length; m++) {
            for (let p = 0; p < pieces.length; p++) {
                if (pieces[p].number === map[m]) {
                    pieces[p].display = "inline"
                    const { x, y } = cellNumberToPoint(width, height, m)
                    pieces[p].x = x
                    pieces[p].y = y
                    const yy = ~~(m % 10)
                    if (map[m] > 0 && yy === 0) {
                        pieces[p].goal = true
                    } else if (map[m] < 0 && yy === 5) {
                        pieces[p].goal = true
                    }
                }
            }
        }
        return pieces
    }



    const mouseClick = (e: React.PointerEvent<SVGSVGElement>) => {
        if (svg.current) {
            const cellNumber = Util.pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            )

            setTouch((e.nativeEvent as PointerEvent)?.pointerType=== 'touch')
            setHoverX(e.nativeEvent.offsetX)
            setHoverY(e.nativeEvent.offsetY)
            props.clickCell(cellNumber)
        }
        e.preventDefault()
    }

    const pieces = mapToPieces(Params.CANV_SIZE, Params.CANV_SIZE, props.map)
    const hover_piece: Piece[] = []
    if (props.hover) {
        const hp = makePiece(props.hover)
        hp.display = 'inline'
        hover_piece.push(hp)
    }

    return (<svg ref={svg} width={Params.CANV_SIZE} height={Params.CANV_SIZE} onPointerDown={mouseClick} >
        <Background x={0} y={0} w={Params.CANV_SIZE} h={Params.CANV_SIZE} />
        {
            pieces.map(p => {
                return (
                    <PieceElement
                        key={p.number}
                        x={p.x}
                        y={p.y}
                        number={p.number}
                        goal={p.goal}
                        isHover={false}
                        display={p.number !== props.hover ? p.display:"none"}
                    />
                )
            })
        }
       <Hover
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            clickedX={hoverX}
            clickedY={hoverY}
            touch={touch}
            hover_piece={hover_piece}
            map={props.map}
       ></Hover>
        <Message
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            message={props.message}
        ></Message>
        <Cover
            x={0}
            y={0}
            w={Params.CANV_SIZE}
            h={Params.CANV_SIZE}
            show={props.cover}
        ></Cover>
    </svg >)
}