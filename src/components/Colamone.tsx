import { useEffect, useMemo, useState } from 'react';
import Board from './Colamone/Board';
import Panel from './Colamone/Panel';
import Footer from './Colamone/Footer';
import Header from './Colamone/Header';
import { Rule } from '../static/Rule';
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
     * Logを再生
     */
    const playLog = () => {

    }
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
     * マウスクリック時処理
     */
    const ev_mouseClick = (target: number): boolean => {

        if (gameState.winner !== null || gameState.logArray.length !== 0) {
            reloadnew();
            return true;
        }
        if (gameState.demo === true) {
            gameState.demo = false
            gameState.hand = null
            gameState.map = gameState.startMap
            gameState.logArray2 = []
            gameState.winner = null
            gameState.turnPlayer = 1
            setGameState(gameState)
            return true;
        }

        if (gameState.hover === null) {
            if (gameState.map[target] * gameState.turnPlayer > 0) {
                gameState.hover = target
                setGameState(gameState)
            }
        } else {
            if (target == gameState.hover) {
                gameState.hover = null
                setGameState(gameState)
                return true;
            }
            const canm = Rule.getCanMovePanelX(gameState.hover, gameState.map);
            if (canm.indexOf(target) >= 0) {
                const _map = gameState.map.slice()
                _map[target] = gameState.map[gameState.hover];
                _map[gameState.hover] = 0;
                gameState.map = _map
                gameState.turnPlayer = gameState.turnPlayer * -1
                gameState.logArray2 = gameState.logArray2.concat([[gameState.hover, target]])
                gameState.hand = [gameState.hover, target]
                gameState.hover = null

                // AIが考える。
                gameState.message = 'thinking...'
                gameState.mapList = Rule.add1000day(gameState.map, gameState.mapList)
                gameState.calcWinner()
                setGameState(gameState)
                if (gameState.winner === null) {
                    window.setTimeout(() => {
                        gameState.ai();
                        setGameState(gameState)
                    }, 250);
                } else {
                    // TODO:勝敗
                }
            }
        }

        return true;
    }

    /** 
     * リセット
     */
    const reloadnew = () => {
        let url = document.location.href.split('?')[0];

        //demo中ならdemoを終了
        if (gameState.demo === true) {
            ev_mouseClick(0);
            return;
        }

        // パラメータを取得
        const paramObj = Util.getParam();
        if (paramObj.lang) {
            url += '?lang=' + paramObj.lang;
        }
        if (navigator.onLine) {
            location.href = url;
        } else {
            gameState.map = Rule.copyMap(gameState.startMap)
            gameState.map = Rule.shuffleBoard();
            gameState.logArray2 = []
            gameState.message = ''
            gameState.winner = null
            gameState.turnPlayer = 1
        }
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
