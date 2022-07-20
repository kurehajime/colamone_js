import GameState from "../model/GameState"
import { Util } from "../static/Util"

type actionType = 'initGame' 
    | 'panelSelect' 
    | 'reloadnew' 
    | 'manual' 
    | 'changeLevel'
    | 'move_start'
    | 'move_prev'
    | 'move_next'
    | 'move_end'
    | 'ai'
    | 'log'
type Action = {
    type: actionType,
    value: number,
    };
export default  (_gameState:GameState, action:Action):GameState=> {
    const gameState =_gameState.clone()
      switch (action.type){
        case 'initGame':
            gameState.initGame('game',Util.getDemoParam())
            break
        case 'panelSelect':
            gameState.panelSelect(action.value)
            break
        case 'reloadnew':
            gameState.reloadnew()
            break
        case 'manual':
            gameState.manual = !gameState.manual
            break
        case 'changeLevel':
            gameState.changeLevel(action.value)
            break
        case 'move_start':
            gameState.move_start()
            break
        case 'move_prev':
            gameState.move_prev()
            break
        case 'move_next':
            gameState.move_next()
            break
        case 'move_end':
            gameState.move_end()
            break
        case 'ai':
            gameState.ai()
            break
        case 'log':
            gameState.startLog()
            break
        default:
      }
      
      return gameState
}