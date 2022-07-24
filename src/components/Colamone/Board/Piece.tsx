import { useEffect, useRef } from "react"
import bg from '../../../assets/bk.gif'
import './Piece.css'
import { PieceDraw } from "../../../static/canvas/PieceDraw"

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
        if (props.display === "none") {
            return
        }

        if (piece1.current && piece2.current && img_bk.current) {
            // 背景画像の読み込みが完了したら再実行
            if (!img_bk.current.src) {
                img_bk.current.onload = () => {
                    if (piece1.current) {
                        piece1.current.setAttribute("href", PieceDraw.drawPiece1(props.number, props.goal, img_bk.current))
                    }
                }
                img_bk.current.src = bg

            } else {
                piece1.current.setAttribute("href", PieceDraw.drawPiece1(props.number, props.goal))
            }
            if (img_bk.current.width !== 0) {
                piece1.current.setAttribute("href", PieceDraw.drawPiece1(props.number, props.goal, img_bk.current))
            }
            piece2.current.setAttribute("href", PieceDraw.drawPiece2(props.number, props.goal))
        }
    }, [props.display, props.goal, props.number])

    return (<g>
        <image ref={piece1} className={props.isHover ? 'easeInHover' : props.goal ? 'goal' : 'easeIn'} x={props.x} y={props.y} width="83" height="83" display={props.display} />
        <image ref={piece2} className={props.isHover ? 'easeInHover' : props.goal ? 'goal' : 'easeIn'} x={props.x} y={props.y} width="83" height="83" display={props.display} />
    </g>)
}