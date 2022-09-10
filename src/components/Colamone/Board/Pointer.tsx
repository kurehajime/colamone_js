import { useRef } from "react"
import { useSetRecoilState } from "recoil"
import { HoverNumberState } from "../../../states/HoverNumberState"
import { HoverPointerState } from "../../../states/HoverPointerState"
import { TouchState } from "../../../states/TouchState"
import Params from "../../../static/Params"
import { Util } from "../../../static/Util"

type Props = {
    x: number
    y: number
    h: number
    w: number
    clickCell: (cellNumber: number) => void
}
export default function Pointer(props: Props) {
    const svg = useRef<SVGSVGElement>(null)
    const setHoverPoint = useSetRecoilState(HoverPointerState)
    const setHoverNumber = useSetRecoilState(HoverNumberState)
    const setTouchState = useSetRecoilState(TouchState)

    const mouseMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const plus = (Params.CANV_SIZE / 6) / 2
        setHoverPoint({ x: e.nativeEvent.offsetX - plus, y: e.nativeEvent.offsetY - plus })
        setHoverNumber(Util.pointToCellNumber(
            props.w,
            props.h,
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        ))
    }

    const mouseClick = (e: React.PointerEvent<SVGSVGElement>) => {
        if (svg.current) {
            const cellNumber = Util.pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY
            )

            setTouchState((e.nativeEvent as PointerEvent)?.pointerType === 'touch')
            const plus = (Params.CANV_SIZE / 6) / 2
            setHoverPoint({ x: e.nativeEvent.offsetX - plus, y: e.nativeEvent.offsetY - plus })
            props.clickCell(cellNumber)
        }
        e.preventDefault()
    }

    return (
        <g ref={svg} x={props.x} y={props.y} width={props.w} height={props.h}
            onPointerDown={mouseClick}
            onPointerMove={mouseMove}>
            <rect x={0} y={0} width={props.w} height={props.h} fill="transparent" />
        </g >
    )
}