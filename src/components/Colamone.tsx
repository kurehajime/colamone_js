import { useCallback, useEffect, useMemo, useReducer } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import { Util } from '../static/Util';
import { Mode } from '../model/Mode';
import GameState from '../model/GameState';
import { useTimer } from 'use-timer';
import GameStateManager from '../reducer/GameStateManager';
import './Colamone.css'

export default function Colamone() {
    const [gameState, dispatch] = useReducer(GameStateManager, new GameState(null));
    const { time, start, pause } = useTimer({endTime:99});

    /** 
     * マウスクリック時処理
     */
    const mouseClick = useCallback((target: number)  => {
        dispatch({ type: 'panelSelect', value: target });
    },[])

    /** 
     * リセット
     */
    const reloadnew = () => {
        dispatch({ type: 'reloadnew', value: 0 });
    }


    /** 
     * 自動再生モードならログを再生
     */
     useEffect(() => {
        if (gameState.auto_log) {
            if(time >=1){
                dispatch({ type: 'move_next', value: 0 });
            }
        } else {
            pause()
        }
    }, [time,gameState.auto_log])
    
    /** 
     * AIのターン
     */
    useEffect(() => {
        if (!gameState.auto_log
            && !gameState.demo 
            && gameState.winner === null 
            && gameState.mode === Mode.game 
            && gameState.turnPlayer === -1) {
                window.setTimeout(() => {
                    dispatch({ type: 'ai', value: 0 });
                }, 500);
        }
    }, [gameState])
    
    /**
     * 初期化
     */
    useEffect(() => {
        const paramObj = Util.getParam();
        if (paramObj.log) {
            dispatch({ type: 'demo', value: 0 });
            start()
        }else{
            dispatch({ type: 'initGame', value: 0 });
        }
    }, [])


    const panel = useMemo(() => {
        return <Panel
        blueScore={Math.abs(gameState.blueScore)}
        redScore={Math.abs(gameState.redScore)}
        level={gameState.level}
        manual={gameState.manual}
        toggleManual={() => {
            dispatch({ type: 'manual', value: 0 });
        }}
        setLevel={
            (x) => {
                dispatch({ type: 'changeLevel', value: x });
            }
        }
        mode={gameState.mode}
        newGame={() => { reloadnew() }}
        prevprev={() => {
            dispatch({ type: 'move_start', value: 0 });
        }}
        prev={() => {
            dispatch({ type: 'move_prev', value: 0 });
        }}
        next={() => {
            dispatch({ type: 'move_next', value: 0 });
        }}
        nextnext={() => {
            dispatch({ type: 'move_end', value: 0 });
        }}
        replay={() => {
            Util.jumpkento(gameState.startMap, gameState.logArray2, gameState.level)
        }}
        tweet={() => { Util.tweetlog(gameState.startMap, gameState.logArray2, gameState.level) }}
    ></Panel>
    },[gameState.blueScore,gameState.redScore,gameState.level,gameState.manual,gameState.mode])

    const head = useMemo(() => {
        return <Header></Header>
    },[])

    const footer = useMemo(() => {
        return <Footer></Footer>
    },[])

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
                            clickCell={(cellNumber: number) => {
                                mouseClick(cellNumber)
                            }}
                        ></Board>
                    </div>
                    {panel}
                </div>
            </div>
            {footer}
        </span >
    );
}
