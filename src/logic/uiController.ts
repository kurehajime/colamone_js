import { Hand, MapArray } from "./rule";

export class UIController {
    /** 
     * ツイートボタンを読み込む。
     */
    public setTweet() {
        /*jshint -W030 */
        (function f(d: any, s: string, id: string) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.async = true; js.src = 'https://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); }
        })(document, 'script', 'twitter-wjs');
    }
    /** 
     * ログをツイートする。
     */
    public tweetlog(startMap: MapArray, logArray2: Array<Hand>, level: number) {
        let url = document.location.href.split('?')[0];
        let init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '%26log=' + this.encodeLog(logArray2);
        log += '%26lv=' + level;
        window.open('https://twitter.com/intent/tweet?text=' + url + init + log + '%20%23colamone');
    }

    /** 
 * 検討画面に飛ぶ
 */
    public jumpkento(startMap: MapArray, logArray2: Array<Hand>, level: number) {
        let url = document.location.href.split('?')[0];
        let init = '?init=' + startMap[55] + ',' +
            startMap[45] + ',' +
            startMap[35] + ',' +
            startMap[25] + ',' +
            startMap[15] + ',' +
            startMap[5] + ',' +
            startMap[44] + ',' +
            startMap[14];
        let log = '&log=' + this.encodeLog(logArray2);
        log += '&lv=' + level;
        location.href = url + init + log;
    }


    /** 
     * ログをエンコード
     */
    public encodeLog(wklogArray: Hand[]) {
        let logstr = '';
        let arrow = ['q', 'w', 'e',
            'a', 's', 'd',
            'z', 'x', 'c'];
        for (let i in wklogArray) {
            let from = wklogArray[i][0];
            let to = wklogArray[i][1];
            let x_vec = ((Math.floor(to / 10)) - Math.floor(from / 10));
            let y_vec = ((Math.floor(to % 10)) - Math.floor(from % 10));
            let arw = '';
            if (x_vec === -1 && y_vec === -1) { arw = 'q'; }
            if (x_vec === 0 && y_vec === -1) { arw = 'w'; }
            if (x_vec === 1 && y_vec === -1) { arw = 'e'; }
            if (x_vec === -1 && y_vec === 0) { arw = 'a'; }
            if (x_vec === 0 && y_vec === 0) { arw = 's'; }
            if (x_vec === 1 && y_vec === 0) { arw = 'd'; }
            if (x_vec === -1 && y_vec === 1) { arw = 'z'; }
            if (x_vec === 0 && y_vec === 1) { arw = 'x'; }
            if (x_vec === 1 && y_vec === 1) { arw = 'c'; }
            logstr += from + arw;
        }
        return logstr;
    }

    public updateScore(blue: number, red: number, time: number | null = null, wins: number | null = null) {
        document.querySelector('#blue')!.innerHTML = 'Blue: ' + blue + '/8';
        document.querySelector('#red')!.innerHTML = ' Red: ' + red + '/8';
        document.querySelector('#time')!.innerHTML = time === null ? '' : '(' + (time.toFixed(3)) + 'sec)';
        document.querySelector('#wins')!.innerHTML = wins === null ? '' : wins + ' win!';
    }
    public setLevel(level: number) {
        (<HTMLInputElement>document.querySelector('#level')).value = level.toString();
    }
    public getLevel(): number {
        return parseInt((<HTMLSelectElement>document.querySelector('#level')).value);
    }
    public manual(show: boolean) {
        if (show) {
            document.querySelector('.manual')?.classList.remove("hide");
        } else {
            document.querySelector('.manual')?.classList.add("hide");
        }
    }
    public logMenu(show: boolean) {
        if (show) {
            (<HTMLElement>document.querySelector('#log')).classList.remove("hide");
            (<HTMLElement>document.querySelector('#prevprev')).classList.remove("hide");
            (<HTMLElement>document.querySelector('#prev')).classList.remove("hide");
            (<HTMLElement>document.querySelector('#next')).classList.remove("hide");
            (<HTMLElement>document.querySelector('#nextnext')).classList.remove("hide");
            (<HTMLElement>document.querySelector('#span_replay')).classList.add("hide");
            (<HTMLElement>document.querySelector('#span_tweetlog')).classList.add("hide");
            (<HTMLElement>document.querySelector('#next')).focus();
        } else {
            (<HTMLElement>document.querySelector('#log')).classList.add("hide");
            (<HTMLElement>document.querySelector('#prevprev')).classList.add("hide");
            (<HTMLElement>document.querySelector('#prev')).classList.add("hide");
            (<HTMLElement>document.querySelector('#next')).classList.add("hide");
            (<HTMLElement>document.querySelector('#nextnext')).classList.add("hide");
            (<HTMLElement>document.querySelector('#span_replay')).classList.add("hide");
            (<HTMLElement>document.querySelector('#span_tweetlog')).classList.add("hide");
        }
    }
    /** 
     * ゲーム終了
     */
     public endgame(logArray:Array<MapArray>) {
        if (logArray.length === 0) {
            document.querySelector('#span_replay')!.classList.remove("hide");
            document.querySelector('#span_tweetlog')!.classList.remove("hide");
        }
    }
    /** 
     * 小さい画面ではViewportを固定化
     */
    public zoom() {
        let viewport = document.querySelector('meta[name=viewport]');
        if (screen.width < 500 && screen.height < 500) {
            if (screen.width < screen.height) {
                viewport!.setAttribute('content', 'width=500,user-scalable=no');
            } else {
                viewport!.setAttribute('content', 'height=500,user-scalable=no');
            }
        } else if (screen.width < 500) {
            viewport!.setAttribute('content', 'width=500,user-scalable=no');
        } else if (screen.height < 500) {
            viewport!.setAttribute('content', 'height=500,user-scalable=no');
        }
        // iOS9のViewportはなぜか機能してくれない。
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            let w = screen.width;
            let w2 = 520;
            if (Math.abs(window.orientation as number) !== 0) {
                w = screen.height;
                w2 = 900;
            }
            let rate = Math.round((w / w2) * 1000) / 1000.0;
            if (rate == Math.round(rate)) { // iOS 9のViewportは整数指定すると機能しない
                rate += 0.0001;
            }

            viewport!.setAttribute(
                'content',
                'initial-scale=' + rate + ', minimum-scale=' + rate + ', maximum-scale=' + rate + ', user-scalable=no'
            );
        }
    }
}