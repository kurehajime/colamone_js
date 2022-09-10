import { useCallback, useEffect, useMemo, useReducer } from 'react'
import Board from './Colamone/Board'
import Panel from './Colamone/Panel'
import Footer from './Colamone/Footer'
import Header from './Colamone/Header'
import { Util } from '../static/Util'
import GameState from '../model/GameState'
import { useTimer } from 'use-timer'
import GameStateManager from '../reducer/GameStateManager'
import './Colamone.css'
import Pointer from './Colamone/Board/Pointer'
import Params from '../static/Params'

export default function Colamone() {
    const [gameState, dispatch] = useReducer(GameStateManager, new GameState(null))
    const { time: timeLog, start: startLog, pause: pauseLog } = useTimer({ endTime: 99 })
    const { time: timeDemo, start: startDemo, pause: pauseDemo } = useTimer({ endTime: 99, interval: 700 })

    /** 
     * マウスクリック時処理
     */
    const mouseClick = useCallback((target: number) => {
        dispatch({ type: 'panelSelect', value: target })
    }, [])

    /** 
     * リセット
     */
    const reloadnew = () => {
        dispatch({ type: 'reloadnew', value: 0 })
    }


    /** 
     * 自動再生モードならログを再生
     */
    useEffect(() => {
        if (gameState.auto_log) {
            if (timeLog >= 1) {
                dispatch({ type: 'move_next', value: 0 })
            }
        } else {
            pauseLog()
        }
    }, [timeLog, gameState.auto_log])


    /** 
     * 自動再生モードならログを再生
     */
    useEffect(() => {
        if (gameState.demo) {
            if (timeDemo >= 1) {
                dispatch({ type: 'move_next', value: 0 })
            }
        } else {
            pauseDemo()
        }
    }, [timeDemo, gameState.demo])

    /** 
     * AIのターン
     */
    useEffect(() => {
        if (!gameState.auto_log
            && !gameState.demo
            && gameState.winner === null
            && gameState.mode === 'game'
            && gameState.turnPlayer === -1) {
            window.setTimeout(() => {
                dispatch({ type: 'ai', value: 0 })
            }, 500)
        }
    }, [gameState])

    /**
     * 初期化
     */
    useEffect(() => {
        const paramObj = Util.getParam()
        if (paramObj.log) {
            dispatch({ type: 'log', value: 0 })
            startLog()
        } else {
            dispatch({ type: 'initGame', value: 0 })
            startDemo()
        }
    }, [])


    const panel = useMemo(() => {
        return <Panel
            blueScore={Math.abs(gameState.blueScore)}
            redScore={Math.abs(gameState.redScore)}
            level={gameState.level}
            manual={gameState.manual}
            toggleManual={() => {
                dispatch({ type: 'manual', value: 0 })
            }}
            setLevel={
                (x) => {
                    dispatch({ type: 'changeLevel', value: x })
                }
            }
            mode={gameState.mode}
            newGame={() => { reloadnew() }}
            prevprev={() => {
                dispatch({ type: 'move_start', value: 0 })
            }}
            prev={() => {
                dispatch({ type: 'move_prev', value: 0 })
            }}
            next={() => {
                dispatch({ type: 'move_next', value: 0 })
            }}
            nextnext={() => {
                dispatch({ type: 'move_end', value: 0 })
            }}
            replay={() => {
                Util.jumpkento(gameState.startMap, gameState.logArray2, gameState.level)
            }}
            tweet={() => { Util.tweetlog(gameState.startMap, gameState.logArray2, gameState.level) }}
        ></Panel>
    }, [gameState.blueScore, gameState.redScore, gameState.level, gameState.manual, gameState.mode])

    const head = useMemo(() => {
        return <Header></Header>
    }, [])

    const footer = useMemo(() => {
        return <Footer></Footer>
    }, [])

    return (
        <span>
            {head}
            <div id="page">
                <div id="main">
                    <div id="canv">
                        <Board
                            map={Array.from(gameState.map)}
                            hover={gameState.hover ? gameState.map[gameState.hover] : null}
                            cover={gameState.demo}
                            hand={gameState.hand}
                            message={gameState.message}
                            turn_player={gameState.turnPlayer}
                            demo={gameState.demo}
                            clickCell={(cellNumber: number) => {
                                mouseClick(cellNumber)
                            }}
                        ></Board>
                        <Pointer
                            x={0}
                            y={0}
                            w={Params.CANV_SIZE}
                            h={Params.CANV_SIZE}
                            clickCell={(cellNumber: number) => {
                                mouseClick(cellNumber)
                            }}
                            hover_piece={gameState.hover}
                        ></Pointer>
                    </div>
                    {panel}
                </div>
            </div>
            {footer}
        </span >
    )
}
