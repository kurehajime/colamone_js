import { useEffect, useMemo, useState } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import { Util } from '../static/Util';
import { Mode } from '../model/Mode';
import GameState from '../model/GameState';
import { useTimer } from 'use-timer';

export default function Colamone() {
    const [originalGameState, _setGameState] = useState<GameState>(new GameState(null))
    const { time, start, pause } = useTimer({endTime:99});
    let gameState = originalGameState.clone();


    const initDom = () => {
        Util.zoom(); // 小さい端末でズーム
        window.addEventListener('orientationchange', Util.zoom);
    }


    /** 
     * マウスクリック時処理
     */
    const ev_mouseClick = (target: number)  => {
        gameState.panelSelect(target)
        setGameState(gameState)
    }

    /** 
     * リセット
     */
    const reloadnew = () => {
        gameState.reloadnew()
        setGameState(gameState)
    }


    /** 
     * ゲーム終了
     */
    const setGameState = (gs: GameState) => {
        _setGameState(gs.clone())
    }

    const panel = useMemo(() => {
        return                     <Panel
        blueScore={Math.abs(gameState.blueScore)}
        redScore={Math.abs(gameState.redScore)}
        level={gameState.level}
        manual={gameState.manual}
        toggleManual={() => {
            gameState.manual = !gameState.manual
            setGameState(gameState)
        }}
        setLevel={
            (x) => {
                gameState.changeLevel(x)
                setGameState(gameState)
            }
        }
        mode={gameState.mode}
        newGame={() => { reloadnew() }}
        prevprev={() => {
            gameState.move_start()
            setGameState(gameState)
        }}
        prev={() => {
            gameState.move_prev()
            setGameState(gameState)
        }}
        next={() => {
            gameState.move_next()
            setGameState(gameState)
        }}
        nextnext={() => {
            gameState.move_end()
            setGameState(gameState)
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


    //------------------------------------

    /** 
     * 自動再生モードならログを再生
     */
     useEffect(() => {
        if (gameState.auto_log) {
            if(time >=1){
                gameState.move_next();
                setGameState(gameState)
            }
        } else {
            pause()
            setGameState(gameState)
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
                    gameState.ai();
                    setGameState(gameState)
                }, 500);
        }
    }, [gameState])
    
    /**
     * 初期化
     */
    useEffect(() => {
        initDom()
        gameState.initGame()
        if (gameState.logArray.length !== 0) {
            gameState.demo = false
            gameState.auto_log = true
            gameState.mode = Mode.log
            start()
        }
        setGameState(gameState)

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
                            clickCell={(cellNumber: number) => {
                                ev_mouseClick(cellNumber)
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
