"use strict"
var PIECES={"1":[1,1,1,
                 1,0,1,
                 1,1,1],
            "2":[1,1,1,
                 1,0,1,
                 1,0,1],
            "3":[1,1,1,
                 0,0,0,
                 1,1,1],
            "4":[1,1,1,
                 0,0,0,
                 1,0,1],
            "5":[1,0,1,
                 0,0,0,
                 1,0,1],
            "6":[1,0,1,
                 0,0,0,
                 0,1,0],
            "7":[0,1,0,
                 0,0,0,
                 0,1,0],
            "8":[0,1,0,
                 0,0,0,
                 0,0,0],
            "-1":[1,1,1,
                  1,0,1,
                  1,1,1],
            "-2":[1,0,1,
                  1,0,1,
                  1,1,1],
            "-3":[1,1,1,
                  0,0,0,
                  1,1,1],
            "-4":[1,0,1,
                  0,0,0,
                  1,1,1],
            "-5":[1,0,1,
                  0,0,0,
                  1,0,1],
            "-6":[0,1,0,
                  0,0,0,
                  1,0,1],
            "-7":[0,1,0,
                  0,0,0,
                  0,1,0],
            "-8":[0,0,0,
                  0,0,0,
                  0,1,0]
           }
var whiteMap={0:0,10:0,20:0,30:0,40:0,50:0,
               1:0,11:0,21:0,31:0,41:0,51:0,
               2:0,12:0,22:0,32:0,42:0,52:0,
               3:0,13:0,23:0,33:0,43:0,53:0,
               4:0,14:0,24:0,34:0,44:0,54:0,
               5:0,15:0,25:0,35:0,45:0,55:0
              }

var POSI_BONUS= {1:[0,50,100,150,300,1000],
                2:[0,60,120,300,600,2000],
                3:[0,70,140,450,900,3000],
                4:[0,80,160,600,1200,4000],
                5:[0,90,180,750,1500,5000],
                6:[0,100,200,900,1800,6000],
                7:[0,110,220,1050,2100,7000],
                8:[0,120,240,1200,3100,10000]
                 }
var PIECE_POINT={1:1800,
                 2:1800,
                 3:1450,
                 4:1450,
                 5:1350,
                 6:1350,
                 7:1250,
                 8:1250
                }
var score=0;
var nearwin=false;

function copyMap(wkMap){
    var rtnMap=new Object();
    //不格好だがループするより高速。
    rtnMap[0]=wkMap[0];
    rtnMap[10]=wkMap[10];
    rtnMap[20]=wkMap[20];
    rtnMap[30]=wkMap[30];
    rtnMap[40]=wkMap[40];
    rtnMap[50]=wkMap[50];
    rtnMap[1]=wkMap[1];
    rtnMap[11]=wkMap[11];
    rtnMap[21]=wkMap[21];
    rtnMap[31]=wkMap[31];
    rtnMap[41]=wkMap[41];
    rtnMap[51]=wkMap[51];
    rtnMap[2]=wkMap[2];
    rtnMap[12]=wkMap[12];
    rtnMap[22]=wkMap[22];
    rtnMap[32]=wkMap[32];
    rtnMap[42]=wkMap[42];
    rtnMap[52]=wkMap[52];
    rtnMap[3]=wkMap[3];
    rtnMap[13]=wkMap[13];
    rtnMap[23]=wkMap[23];
    rtnMap[33]=wkMap[33];
    rtnMap[43]=wkMap[43];
    rtnMap[53]=wkMap[53];
    rtnMap[4]=wkMap[4];
    rtnMap[14]=wkMap[14];
    rtnMap[24]=wkMap[24];
    rtnMap[34]=wkMap[34];
    rtnMap[44]=wkMap[44];
    rtnMap[54]=wkMap[54];
    rtnMap[5]=wkMap[5];
    rtnMap[15]=wkMap[15];
    rtnMap[25]=wkMap[25];
    rtnMap[35]=wkMap[35];
    rtnMap[45]=wkMap[45];
    rtnMap[55]=wkMap[55];
    return rtnMap;
}

//終了判定(実質的勝利含む)
function isEndX(wkMap){
    var sum1=0;
    var sum2=0;
    var GoalTop=[0,10,20,30,40,50];
    var GoalBottom=[5,15,25,35,45,55]; 
    //点数勝利        
    for(var i in GoalTop){
        if(wkMap[GoalTop[i]]>0){
            sum1+=wkMap[GoalTop[i]];
        }
    }
    for(var i in GoalBottom){
        if(wkMap[GoalBottom[i]]*-1>0){
            sum2+=wkMap[GoalBottom[i]];
        }
    }
    if(sum1>=8){
        return 1;
    }else if(sum2<=-8){
        return -1;
    }

    //手詰まりは判定
    if(isNoneNode(wkMap)){
        if(sum1>(-1*sum2)){
            return 1;
        }else if(sum1<(-1*sum2)){//引き分けは後攻勝利←やっぱやめた。
            return -1;
        }
    }
    //実質的判定勝利
    if(nearwin==false){
        var live1=0;
        var live2=0; 
        for(var num in wkMap){
            if(wkMap[num]>0){
                live1+=wkMap[num];
            }else if(wkMap[num]<0){
                live2+=wkMap[num];
            }
        }
        if(sum1>(-1*live2)){
            return 1;
        }else if(-1*sum2>live1){
          return -1;
        }
    }

    
    return 0;   
}
//最後の一個を取るかどうかの判断
function isDraw(wkMap){
    if(!isNoneNode(wkMap)){
        return false;
    }
    var sum1=0;
    var sum2=0;
    var GoalTop=[0,10,20,30,40,50];
    var GoalBottom=[5,15,25,35,45,55]; 
    //点数勝利        
    for(var i in GoalTop){
        if(wkMap[GoalTop[i]]>0){
            sum1+=wkMap[GoalTop[i]];
        }
    }
    for(var i in GoalBottom){
        if(wkMap[GoalBottom[i]]*-1>0){
            sum2+=wkMap[GoalBottom[i]];
        }
    }
    if(sum1==sum2){
        return true  ;
    }else{
        return false;   
    }
}


//手詰まり判定
function isNoneNode(wkMap){
    var flag1=false;
    var flag2=false;
    for(var panel_num in wkMap){
        if(wkMap[panel_num]==0){
            continue;
        }
        var canMove=getCanMovePanelX(panel_num,wkMap);
        if(canMove.length!=0){
            if(wkMap[panel_num]>0){
                flag1=true;
            }else if(wkMap[panel_num]<0){
                flag2=true;
            }
        }
        if(flag1&&flag2){
            return false;
        }
    }
    return true;
}

//動かせるマスを返す。Return:[NN,NN,NN...]
function getCanMovePanelX(panel_num,wkMap){
    var number = wkMap[panel_num];
    var x = Math.floor(panel_num / 10);
    var y = Math.floor(panel_num % 10);
    var canMove=new Array;
    if(number===0){
        return canMove;   
    }
    //アガリのコマは動かしたらダメ。
    if(number>0 && y===0){
        return canMove;   
    }else if(number<0 && y===5){
        return canMove;   
    }
    for(var i=0;i<PIECES[number].length;i++){
        if(PIECES[number][i]===0){
            continue;
        }
        var target_x= x + Math.floor(i%3)-1;
        var target_y= y + Math.floor(i/3)-1;
        if(target_y<0 || target_y>5 || target_x>5 || target_x<0 ){
            continue;
        }
        var idx=target_x*10+target_y;
        var target_number=wkMap[idx];

        //自コマとアガリのコマはとったらダメ。
        if((target_number*number>0)||(target_number>0 && target_y===0)||(target_number<0 &&target_y===5)){
            continue;   
        }
        canMove.push(idx);
    }
    return canMove;
}
//起こりうる次の一手を返す。Return:[[q,map0],[qmap1],[q,map2]...] //q=[prev,next]
function getNodeMap(wkMap,turn_player){
    var nodeList=new Array;
    var queue=new Array();
    for(var panel_num in wkMap){
        if(wkMap[panel_num]*turn_player<=0){
            continue;
        }
        var canMove=getCanMovePanelX(panel_num,wkMap);
        for(var num in canMove){
            var nodeMap=copyMap(wkMap);
            var q=queue.concat();
            q.push([panel_num,canMove[num]])
            nodeMap[canMove[num]]=nodeMap[panel_num];
            nodeMap[panel_num]=0;
            nodeList.push([q,nodeMap]);
        }
    }
    return nodeList;
}

//盤面を評価して-10000〜+10000で採点数する。
function evalMap(wkMap,turn_player){
    var ev=0;
    var zocMap;
    var evMap=copyMap(wkMap);
    //引き分け判定
    if(isDraw(wkMap)){
        return 0;
    }
    //終局判定
    var end=isEndX(evMap);
    if(end==1){
        return +9999999;
    }else if(end==-1){
        return -9999999;
    }
    //評価
    for(var panel_num in evMap){
        var cell_p=0;
        var p=evMap[panel_num];
        var line;
        //コマの評価値を加算
        if(p>0){
            line=5-(panel_num % 10)
            cell_p+=PIECE_POINT[Math.abs(p)];//コマの標準評価値
            cell_p+=POSI_BONUS[p][line];//ポジションボーナス
        }else if(p<0){
            line=(panel_num % 10)
            cell_p+=PIECE_POINT[Math.abs(p)] *-1;
            cell_p+=POSI_BONUS[Math.abs(p)][line]*-1;
        }

        //評価値に加算。
        ev+=cell_p;
    }
    return parseInt(ev);
}

//考える。
function think(wkMap,turn_player){
    var nodeList= getNodeMap(wkMap,turn_player);
    var best_ev=null;
    var best_hand=null;
    for(var i =0;i<=nodeList.length-1;i++){
        var hand=nodeList[i][0];
        var ev =evalMap(nodeList[i][1],turn_player);
        if(best_ev===null){
            best_hand=hand[0];
            best_ev=ev;
        }
        if(turn_player>0 & best_ev < ev){
            best_hand=hand[0];
            best_ev=ev;
        }
        if(turn_player<0 & best_ev > ev){
            best_hand=hand[0];
            best_ev=ev;
        }
    }
    score=best_ev;
    return best_hand;
}

//よく考える。 node=[q,map0]
function deepThinkAll(map,turn_player,depth){
	var best_score=turn_player*9999999*-1;
	var besthand;
	if(depth===0){
		best_score=evalMap(map,turn_player);
		return [besthand,best_score]
	}
    
    var nodeList= getNodeMap(map,turn_player);
	for(i in nodeList){
        var hand=nodeList[i][0];
		var map=nodeList[i][1];
        
        //必勝
        if(isEndX(map)==turn_player){
            return [hand,99999*turn_player];
        }
        //必敗
        if(isEndX(map)==turn_player*-1){
            if(besthand===undefined){
                best_score=99999*turn_player*-1;
                besthand=hand;
            }
            continue;
        }
		var sc  =deepThinkAll(map,turn_player*-1,depth-1)[1]
        
		if(besthand===undefined){
			best_score=sc;
			besthand=hand;
		}
		if(turn_player==1 &&sc>best_score){
			best_score=sc;
			besthand=hand;
		}else if(turn_player==-1&&sc<best_score){
			best_score=sc;
			besthand=hand;
		}
	}
	return [besthand,best_score]
}
//よく考える。 node=[q,map0]
function deepThinkAllAB(map,turn_player,depth,a,b){
	var best_score=turn_player*9999999*-1;
	var besthand;
	if(depth==0){
		best_score=evalMap(map,turn_player);
		return [besthand,best_score]
	}
    if(a==undefined||b==undefined){
        a=9999999*turn_player*-1
        b=9999999*turn_player
    }
    
    var nodeList= getNodeMap(map,turn_player);
	for(var i in nodeList){
        var hand=nodeList[i][0];
		var map=nodeList[i][1];
        
        //必勝
        var end=isEndX(map);
        if(end==turn_player){
            return [hand,999999*turn_player];
        }
        //必敗
        if(end==turn_player*-1){
            if(besthand==undefined){
                best_score=999999*turn_player*-1;
                besthand=hand;
            }
            continue;
        }
		var sc  =deepThinkAllAB(map,turn_player*-1,depth-1,b,a)[1]
		if(besthand==undefined){
			best_score=sc;
			besthand=hand;
		}        
		if(turn_player===1 &&sc>best_score){
			best_score=sc;
			besthand=hand;
		}else if(turn_player===-1&&sc<best_score){
			best_score=sc;
			besthand=hand;
		}
        if(turn_player===1&&a<best_score||turn_player===-1&&a>best_score){
            a= best_score;
        }
        if(turn_player===1&&b<=best_score||turn_player===-1&&b>=best_score){
            break;
        }
        
    }
	return [besthand,best_score]
}

function thinkAI(map,turn_player,depth,a,b){
    if(isEndX(map)!=0){
        nearwin=true;
    }
    return deepThinkAllAB(map,turn_player,depth,a,b)
}

