import { useEffect, useRef } from "react"
import { MessageDraw } from "../../../static/canvas/MessageDraw"
type Props = {
    x: number
    y: number
    h: number
    w: number
    message: string
}

export default function Message(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)

    useEffect(() => {
        if (bg1.current && props.message !== '') {
            const canvas = document.createElement("canvas")
            MessageDraw.drawMessage(bg1.current, canvas, props.message)
        }
    }, [props.message])

    return (<g display={props.message !== '' ? "inline" : "none"}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
    </g >)

}