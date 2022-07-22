import { useEffect, useRef } from "react"
import { BackgroundDraw } from "../../../static/canvas/BackgroundDraw"
type Props = {
    x: number
    y: number
    h: number
    w: number
}
export default function Background(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)
    const bg2 = useRef<SVGImageElement>(null)

    useEffect(() => {
        if (bg1.current && bg2.current) {
            const canvas = document.createElement("canvas")
            BackgroundDraw.drawBoard(bg1.current, canvas)
            BackgroundDraw.drawBoard2(bg2.current, canvas)
        }
    }, [])

    return (<g>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        <image ref={bg2} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g>)

}