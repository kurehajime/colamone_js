import { useEffect, useRef, useState } from "react";
import { Piece } from "../../model/Piece";
import Params from "../../static/Params";
import PieceElement from './Piece';
type Props = {
    x: number
    y: number
    h: number
    w: number
    clickedX:number
    clickedY:number
    hover_piece: Piece[]
}
export default function Hover(props: Props) {
    const bg1 = useRef<SVGImageElement>(null)
    const [hoverX, setHoverX] = useState(0)
    const [hoverY, setHoverY] = useState(0)

    /**
     * 盤面を描画してCANVASを返す。
     */
    function drawHover(element: SVGImageElement, canvas: HTMLCanvasElement) {
        const canvSize = Params.CANV_SIZE * 3;
        canvas.width = canvSize;
        canvas.height = canvSize;
        element.setAttribute("href", canvas.toDataURL());
    }

    useEffect(() => {
        if (bg1.current) {
            const canvas = document.createElement("canvas");
            drawHover(bg1.current, canvas);
        }
    }, [props.hover_piece])

    useEffect(() => {
        setHoverX(props.clickedX)
        setHoverY(props.clickedY)
    }, [props.clickedX,props.clickedY])

    const mouseMove = (e: React.MouseEvent<SVGSVGElement>) => {

        const plus = (Params.CANV_SIZE / 6) / 2;
        setHoverX(e.nativeEvent.offsetX - plus)
        setHoverY(e.nativeEvent.offsetY - plus)
    }

    return (<g className="hover"  onMouseMove={mouseMove}>
        <image ref={bg1} x={props.x} y={props.y} width={props.w} height={props.h} />
        {
            props.hover_piece.map(p => {
                return (<PieceElement
                    key={0}
                    x={hoverX}
                    y={hoverY}
                    number={p.number}
                    goal={p.goal}
                    display={p.display}
                    isHover={true}
                />)
            })
        }
    </g >)

}