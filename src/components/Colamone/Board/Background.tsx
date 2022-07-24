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
            bg1.current.setAttribute("href", BackgroundDraw.drawBoard())
            bg2.current.setAttribute("href", BackgroundDraw.drawBoard2())
        }
    }, [])

    return (<g>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        <image ref={bg2} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g>)

}