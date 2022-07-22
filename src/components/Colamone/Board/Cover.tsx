import { useEffect, useRef } from "react"
import './Cover.css'
import { CoverDraw } from "../../../static/canvas/CoverDraw"
type Props = {
    show: boolean
    x: number
    y: number
    h: number
    w: number
}
export default function Cover(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)
    const bg2 = useRef<SVGImageElement>(null)

    useEffect(() => {
        if (bg1.current&&bg2.current) {
            CoverDraw.drawCover1(bg1.current)
            CoverDraw.drawCover2(bg2.current)
        }
    }, [])

    return (<g display={props.show ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        <image ref={bg2} className="start" x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)
}