import { useTranslation } from 'react-i18next';
import { Mode } from "../../model/Mode"

type Props = {
    level: number
    blueScore: number
    redScore: number
    manual: boolean
    setLevel: (level: number) => void
    newGame: () => void
    prevprev: () => void
    prev: () => void
    next: () => void
    nextnext: () => void
    replay: () => void
    tweet: () => void
    toggleManual: () => void
    mode: Mode
}

export default function Panel(props: Props) {
    const { t } = useTranslation();


    return (<div id="message">
        <div id="head">
            <span id="gamename">{t('colamone')}</span> by <a href="https://twitter.com/kurehajime">@kurehajime</a><br />
            <span id="blue" className="score">{`Blue: ${props.blueScore}/8`}</span> - <span id="red" className="score">{` Red: ${props.redScore}/8`}</span><span
                id="wins"></span>
        </div>
        <div id="lvs">
            <select id="level" value={props.level} onChange={e => { props.setLevel(parseInt(e.target.value)); }}>
                <option value="1" className="lv">Lv.1</option>
                <option value="2" className="lv">Lv.2</option>
                <option value="3" className="lv">Lv.3</option>
                <option value="4" className="lv">Lv.4</option>
                <option value="5" className="lv">Lv.5</option>
                <option value="6" className="lv">Lv.6</option>
            </select>
            <button type="button" id="newgame" onClick={() => props.newGame()}>New Game</button>
        </div>
        {props.mode === Mode.log &&
            <span id="log">
                <button type="button" id="prevprev" onClick={props.prevprev}> |&lt; </button>
                <button type="button" id="prev" onClick={props.prev}> &lt; </button>
                <button type="button" id="next" onClick={props.next}> &gt; </button>
                <button type="button" id="nextnext" onClick={props.nextnext}> &gt;|</button>
            </span>
        }
        {props.mode === Mode.result &&
            <span id="span_replay">
                <button type="button" id="replay" onClick={props.replay}> {t('replay')} </button>
            </span>
        }
        {props.mode === Mode.result &&
            <span id="span_tweetlog">
                <button type="button" id="tweetlog" onClick={props.tweet}> {t('tweetlog')}</button>
            </span>
        }
        <div id="collapsible">
            <h5 className="howtoplay" onClick={()=>{props.toggleManual()}}><span id="htp">{t('howtoplay')}</span></h5>
            {props.manual &&
                    <div className="manual">
                     <p id="manual">{t('manual')}</p>
                    </div>
            }

        </div>
        <span id="sns"> <a href="https://twitter.com/share" className="twitter-share-button" data-dnt="true"
            data-url="https://colamone.com" data-hashtags="colamone,boardgames"
            data-lang="en" data-size="default"></a>
        </span>
    </div >)

}