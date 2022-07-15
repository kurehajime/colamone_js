import { Mode } from "./Mode"
import { Aijs } from "../static/Ai"
import Cookie from "../static/Cookie"
import { Hand, MapArray, Rule } from "../static/Rule"
import { Util } from "../static/Util"

export default class GameState {
    public turnPlayer = 0
    public map: Int8Array = new Int8Array([
        -1, 0, 0, 0, 0, 6, 0, 0, 0, 0, -2, -8,
        0, 0, 7, 5, 0, 0, 0, 0, -3, 0, 0, 0,
        0, 4, 0, 0, 0, 0, -4, 0, 0, 0, 0,
        3, 0, 0, 0, 0, -5, -7, 0, 0, 8, 2,
        0, 0, 0, 0, -6, 0, 0, 0, 0, 1
    ])
    public startMap: Int8Array = new Int8Array()
    public hover: number | null = null
    public demo = false
    public auto_log = false
    public hand: Hand | null = null
    public message = ''
    public blueScore = 0
    public redScore = 0
    public level = 0
    public wins = 0
    public log_pointer = 0
    public thinktime: number | null = null
    public winner: number | null = null
    public mapList: { [index: string]: number; } = {}
    public mode: Mode = 'game'
    public logArray: Array<MapArray> = []
    public logArray2: Array<Hand> = []
    public logPointer = 0
    public manual = false

    public constructor(_gameState: GameState | null) {
        if (_gameState) {
            this.turnPlayer = _gameState.turnPlayer
            this.map = _gameState.map
            this.startMap = _gameState.startMap
            this.hover = _gameState.hover
            this.demo = _gameState.demo
            this.auto_log = _gameState.auto_log
            this.hand = _gameState.hand
            this.message = _gameState.message
            this.blueScore = _gameState.blueScore
            this.redScore = _gameState.redScore
            this.level = _gameState.level
            this.wins = _gameState.wins
            this.log_pointer = _gameState.log_pointer
            this.thinktime = _gameState.thinktime
            this.winner = _gameState.winner
            this.mapList = _gameState.mapList
            this.mode = _gameState.mode
            this.logArray = _gameState.logArray
            this.logArray2 = _gameState.logArray2
            this.logPointer = _gameState.logPointer
            this.manual = _gameState.manual
        }
    }

    public clone(): GameState {
        const clone = new GameState(this)
        return clone
    }

    public initGame() {
        this.turnPlayer = 1
        this.demo = true


        const _map = Rule.shuffleBoard()
        this.map = _map
        this.startMap = _map

        // 連勝記録初期化
        if (!Cookie.getItem('level_1')) {
            Cookie.setItem('level_1', 0)
        }
        if (!Cookie.getItem('level_2')) {
            Cookie.setItem('level_2', 0)
        }
        if (!Cookie.getItem('level_3')) {
            Cookie.setItem('level_3', 0)
        }
        if (!Cookie.getItem('level_4')) {
            Cookie.setItem('level_4', 0)
        }
        if (!Cookie.getItem('level_5')) {
            Cookie.setItem('level_5', 0)
        }
        // レベル記憶
        if (Cookie.getItem('level_save') !== undefined && Cookie.getItem('level_save') !== 'undefined' && Cookie.getItem('level_save') !== null) {
            this.level = parseInt(Cookie.getItem('level_save'))
        } else {
            Cookie.setItem('level_save', 1)
            this.level = 1
        }


        // パラメータを取得
        const paramObj = Util.getParam()

        // 盤面を初期化
        if (paramObj.init) {
            this.startMap = Util.getMapByParam(this.map, paramObj.init)
            this.map = Rule.copyMap(this.startMap)
        } else {
            this.startMap = this.map
        }
        // ログをデコード
        if (paramObj.log) {
            this.logArray = Util.decodeLog(paramObj.log, this.startMap)
        }
        // レベル取得
        if (paramObj.lv) {
            this.level = parseInt(paramObj.lv)
        }

        if (this.logArray.length !== 0) {
            this.mode = 'log'
        }

        this.mapList = Rule.add1000day(this.map, this.mapList)
        Util.setTweet() // ツイートボタンを生成


        this.manual = window.innerHeight < window.innerWidth
        this.calcWinner()
    }


    /** 
     * 得点計算。
     */
    public calcScore() {
        let sum1 = 0
        let sum2 = 0
        const GoalTop = [0, 10, 20, 30, 40, 50]
        const GoalBottom = [5, 15, 25, 35, 45, 55]
        // 点数勝利        
        for (const i in GoalTop) {
            if (this.map[GoalTop[i]] * 1 > 0) {
                sum1 += this.map[GoalTop[i]]
            }
        }
        for (const i in GoalBottom) {
            if (this.map[GoalBottom[i]] * -1 > 0) {
                sum2 += this.map[GoalBottom[i]]
            }
        }
        if (sum1 >= 8) {
            this.winner = 1
        } else if (sum2 <= -8) {
            this.winner = -1
        }

        // 手詰まりは判定
        if (Rule.isNoneNode(this.map)) {
            if (Math.abs(sum1) > Math.abs(sum2)) {
                this.winner = 1
            } else if (Math.abs(sum1) < Math.abs(sum2)) { // 引き分けは後攻勝利
                this.winner = -1
            } else if (Math.abs(sum1) == Math.abs(sum2)) {
                this.winner = 0
            }
        } else {
            if (Rule.is1000day(this.map, Object.assign({}, this.mapList))) {
                this.winner = 0
            }
        }
        this.blueScore = sum1
        this.redScore = sum2
    }

    /** 
     * メッセージを更新
     */
    public calcWinner() {
        this.calcScore()
        if (this.logArray.length === 0) {
            if (this.winner == 1) {
                this.message = 'You win!'
                Cookie.setItem('level_' + this.level,
                    parseInt(Cookie.getItem('level_' + this.level)) + 1)
                this.endgame()
            } else if (this.winner == -1) {
                this.message = 'You lose...'
                Cookie.setItem('level_' + this.level, 0)
                this.endgame()
            } else if (this.winner === 0) {
                if (this.mapList[JSON.stringify(this.map)] >= Rule.LIMIT_1000DAY) {
                    this.message = '3fold repetition'
                } else {
                    this.message = '-- Draw --'
                }
                this.endgame()
            }
        }

        if (Cookie.getItem('level_' + this.level) > 0) {
            this.wins = Cookie.getItem('level_' + this.level)
        }
    }
    public endgame() {
        this.mode = 'result'
    }

    public ai() {
        const startTime = new Date()
        let endTime = null
        // 終盤になったら長考してみる。
        const count = Rule.getNodeCount(this.map) / 2
        let plus = 0
        switch (this.level) {
            case 1:
                break
            case 2:
                if (count <= 8) {
                    plus++
                }
                break
            case 3:
                if (count <= 10) {
                    plus++
                }
                if (count <= 6) {
                    plus++
                }
                break
            case 4:
                if (count <= 11) {
                    plus++
                }
                if (count <= 7) {
                    plus++
                }
                break
            case 5:
                if (count > 16) {
                    plus--
                }
                if (count <= 12) {
                    plus++
                }
                if (count <= 8) {
                    plus++
                }
                break
            case 6:
                if (count > 16) {
                    plus--
                }
                if (count <= 12) {
                    plus++
                }
                if (count <= 8) {
                    plus++
                }
                break
        }

        const _hand = Aijs.thinkAI(this.map, this.turnPlayer, this.level + plus + 1, undefined, undefined, undefined)[0]
        if (_hand) {
            const _map = this.map.slice()
            _map[_hand[1]] = this.map[_hand[0]]
            _map[_hand[0]] = 0
            this.map = _map
            this.logArray2 = this.logArray2.concat([[_hand[0], _hand[1]]])
        }
        this.turnPlayer = (this.turnPlayer * -1)
        endTime = new Date()
        this.thinktime = ((endTime.getTime() - startTime.getTime()) / 1000)
        this.message = ''
        this.mapList = Rule.add1000day(this.map, this.mapList)
        this.calcWinner()
    }



    public resetMap () {
        this.demo = false
        this.hand = null
        this.map = this.startMap
        this.logArray2 = []
        this.winner = null
        this.mode = 'game'
        this.turnPlayer = 1
    }

    public reloadnew() {
        let url = document.location.href.split('?')[0]

        //demo中ならdemoを終了
        if (this.demo === true) {
            this.resetMap()
            return
        }

        // パラメータを取得
        const paramObj = Util.getParam()
        if (paramObj.lang) {
            url += '?lang=' + paramObj.lang
        }
        if (navigator.onLine) {
            location.href = url
        } else {
            this.resetMap()
        }
    }

    
    public panelSelect (target: number):boolean{
        if (this.winner !== null || this.logArray.length !== 0) {
            this.reloadnew()
            return false
        }
        if (this.demo === true) {
            this.resetMap()
            return false
        }

        if (this.hover === null) {
            if (this.map[target] * this.turnPlayer > 0) {
                this.hover = target
            }
        } else {
            if (target == this.hover) {
                this.hover = null
                return false
            }
            const canm = Rule.getCanMovePanelX(this.hover, this.map)
            if (canm.indexOf(target) >= 0) {
                const _map = this.map.slice()
                _map[target] = this.map[this.hover]
                _map[this.hover] = 0
                this.map = _map
                this.turnPlayer = this.turnPlayer * -1
                this.logArray2 = this.logArray2.concat([[this.hover, target]])
                this.hand = [this.hover, target]
                this.hover = null

                // AIが考える。
                this.message = 'thinking...'
                this.mapList = Rule.add1000day(this.map, this.mapList)
                this.calcWinner()
                if (this.winner === null) {
                    return true
                }
            }
        }
        return false
    }


    /** 
    * ラジオボタン変更時処理
    */
    public changeLevel(level: number) {
        this.level = level
        Cookie.setItem('level_save', this.level)
        if (Cookie.getItem('level_' + this.level) > 0) {
            this.wins = (Cookie.getItem('level_' + this.level))
        }
        this.map = Rule.copyMap(this.startMap)
        this.hand = null
        this.mapList = {}
        this.logArray2 = []
        this.blueScore = 0
        this.redScore = 0
    }


    /** 
     * ログを全部巻き戻す
     */
    public move_start() {
        this.logPointer = 0
        this.auto_log = false
        this.map = Rule.copyMap(this.logArray[this.logPointer])
        this.winner = null
        this.mapList = Rule.add1000day(this.map, this.mapList)
        this.calcWinner()
    }

    /** 
     * ログを戻す
     */
    public move_prev() {
        if (this.logPointer <= 0) { return }
        this.auto_log = false
        this.logPointer = this.logPointer - 1
        this.map = Rule.copyMap(this.logArray[this.logPointer])
        this.winner = null
        this.mapList = Rule.add1000day(this.map, this.mapList)
        this.calcWinner()
    }

    /** 
     * ログを進める
     */
    public move_next() {
        if (this.logPointer + 1 > this.logArray.length - 1) { return }
        this.logPointer = (this.logPointer + 1)
        this.map = Rule.copyMap(this.logArray[this.logPointer])
        this.mapList = Rule.add1000day(this.map, this.mapList)
        this.calcWinner()
    }

    /** 
     * ログを最後まで進める。
     */
    public move_end = () => {
        this.logPointer = (this.logArray.length - 1)
        this.auto_log = false
        this.map = Rule.copyMap(this.logArray[this.logPointer])
        this.mapList = Rule.add1000day(this.map, this.mapList)
        this.calcWinner()
    }

    public startDemo() {
        this.initGame()
        this.map = Rule.copyMap(this.startMap)
        this.demo = false
        this.auto_log = true
        this.mode = 'log'
    }
}