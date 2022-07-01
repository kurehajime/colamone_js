import Params from "../../static/Params";
import Background from './Background';
import PieceElement from './Piece';
import { useRef, useState } from "react";
import { Piece } from "../../model/Piece";
import Cover from "./Cover";
import Message from "./Message";
import { Hand } from "../../static/Rule";
import Hover from "./Hover";
import { Util } from "../../static/Util";
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
        };
    }
    const makePieces = (): Piece[] => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, -1, -2, -3, -4, -5, -6, -7, -8];
        const pieces = [];
        for (const i of numbers) {
            pieces.push(makePiece(i));
        }
        return pieces;
    }
    const cellNumberToPoint = (width: number, height: number, cellNumber: number) => {
        const cellSize = width / 6;
        const x = ~~(cellNumber / 10) * cellSize;
        const y = ~~(cellNumber % 10) * cellSize;
        return { x, y };
    }
    const mapToPieces = (width: number, height: number, map: number[]): Piece[] => {
        const pieces = makePieces();
        for (let m = 0; m < map.length; m++) {
            for (let p = 0; p < pieces.length; p++) {
                if (pieces[p].number === map[m]) {
                    pieces[p].display = "inline";
                    const { x, y } = cellNumberToPoint(width, height, m);
                    pieces[p].x = x;
                    pieces[p].y = y;
                    const yy = ~~(m % 10);
                    if (map[m] > 0 && yy === 0) {
                        pieces[p].goal = true;
                    } else if (map[m] < 0 && yy === 5) {
                        pieces[p].goal = true;
                    }
                }
            }
        }
        return pieces;
    }



    const mouseClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (svg.current) {
            const cellNumber = Util.pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            );

            setTouch(e.nativeEvent instanceof TouchEvent)
            setHoverX(e.nativeEvent.offsetX)
            setHoverY(e.nativeEvent.offsetY)
            props.clickCell(cellNumber)
        }
    }

    const pieces = mapToPieces(Params.CANV_SIZE, Params.CANV_SIZE, props.map);
    const hover_piece: Piece[] = []
    if (props.hover) {
        const hp = makePiece(props.hover)
        hp.display = 'inline'
        hover_piece.push(hp)
    }

    return (<svg ref={svg} width={Params.CANV_SIZE} height={Params.CANV_SIZE} onMouseDown={mouseClick} >
        <Background x={0} y={0} w={Params.CANV_SIZE} h={Params.CANV_SIZE} />
        {
            pieces.filter(p => { return p.number !== props.hover }).map(p => {
                return (
                    <PieceElement
                        key={p.number}
                        x={p.x}
                        y={p.y}
                        number={p.number}
                        goal={p.goal}
                        isHover={false}
                        display={p.display}
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
            demo_inc={0}
        ></Cover>
    </svg >)
}