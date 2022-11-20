import { useEffect, useRef, useState } from "react"
import { useSetRecoilState } from "recoil"
import { Point } from "../../../model/Point"
import { HoverNumberState } from "../../../states/HoverNumberState"
import { HoverPointerState } from "../../../states/HoverPointerState"
import { TouchState } from "../../../states/TouchState"
import Params from "../../../static/Params"
import { Util } from "../../../static/Util"
import "./Pointer.css"

type Props = {
    x: number
    y: number
    h: number
    w: number
    hover_piece: number | null
    clickCell: (cellNumber: number) => void
}
export default function Pointer(props: Props) {
    const svg = useRef<SVGSVGElement>(null)
    const [distance, setDistance] = useState(0)
    const [point, setPoint] = useState<Point | null>(null)
    const setHoverPoint = useSetRecoilState(HoverPointerState)
    const setHoverNumber = useSetRecoilState(HoverNumberState)
    const setTouchState = useSetRecoilState(TouchState)

    const mouseMove = (event: Event) => {
        const e = event as PointerEvent
        const plus = (Params.CANV_SIZE / 6) / 2
        if (point) {
            const dx = e.offsetX - point.x
            const dy = e.offsetY - point.y
            const d = Math.sqrt(dx * dx + dy * dy)
            setDistance(dd => dd + d)
        }
        setPoint({ x: e.offsetX, y: e.offsetY })
        setHoverPoint({ x: e.offsetX - plus, y: e.offsetY - plus })
        setHoverNumber(Util.pointToCellNumber(
            props.w,
            props.h,
            e.offsetX,
            e.offsetY
        ))
    }

    const mouseDown = (event: Event) => {
        const e = event as PointerEvent
        if (svg.current) {
            const cellNumber = Util.pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                e.offsetX,
                e.offsetY
            )
            setTouchState((e as PointerEvent)?.pointerType === 'touch')
            const plus = (Params.CANV_SIZE / 6) / 2
            setDistance(0)
            setPoint({ x: e.offsetX, y: e.offsetY })
            setHoverPoint({ x: e.offsetX - plus, y: e.offsetY - plus })
            props.clickCell(cellNumber)
        }
        setDistance(0)
        e.preventDefault()
    }

    const mouseUp = (event: Event) => {
        const e = event as PointerEvent
        if (svg.current && props.hover_piece !== null && point) {
            const cellNumber = Util.pointToCellNumber(
                svg.current.getBoundingClientRect().width,
                svg.current.getBoundingClientRect().height,
                point.x,
                point.y
            )
            if (distance > 20) {
                setTouchState((e as PointerEvent)?.pointerType === 'touch')
                props.clickCell(cellNumber)
            }
        }
        setDistance(0)
        e.preventDefault()
    }
    useEffect(() => {
        svg.current?.addEventListener("pointerdown", mouseDown, { passive: false })
        svg.current?.addEventListener("pointerup", mouseUp, { passive: false })
        svg.current?.addEventListener("pointermove", mouseMove, { passive: false })
        return () => {
            svg.current?.removeEventListener("pointerdown", mouseDown)
            svg.current?.removeEventListener("pointerup", mouseUp)
            svg.current?.removeEventListener("pointermove", mouseMove)
        }
    })


    return (
        <svg ref={svg} x={props.x} y={props.y} width={props.w} height={props.h}
            className="pointer">
            <rect x={0} y={0} width={props.w} height={props.h} fill="transparent" />
        </svg >
    )
}