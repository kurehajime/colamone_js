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
var whiteMap={00:0,10:0,20:0,30:0,40:0,50:0,
               01:0,11:0,21:0,31:0,41:0,51:0,
               02:0,12:0,22:0,32:0,42:0,52:0,
               03:0,13:0,23:0,33:0,43:0,53:0,
               04:0,14:0,24:0,34:0,44:0,54:0,
               05:0,15:0,25:0,35:0,45:0,55:0
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
var PIECE_POINT={1:3500,
                 2:3500,
                 3:2800,
                 4:2800,
                 5:2600,
                 6:2600,
                 7:2400,
                 8:2400
                }
var ZOC_POINTS=[80,80,80,80,80,160];
var EFF_POINTS=[80,80,80,80,80,160];
var score=0;

function copyMap(wkMap){
    var rtnMap=new Object();
    for(var num in wkMap){
        rtnMap[num]=wkMap[num];
    }
    return rtnMap;
}


//終局判定。Return:Bool
function isEnd(turn_player,wkMap){
    var sum=0;
    if(turn_player>0){       
        sum+=wkMap[0]+wkMap[10]+wkMap[20]
            +wkMap[30]+wkMap[40]+wkMap[50];
        if(sum>=8){
            return true;
        }
    }else if(turn_player<0){
        sum+=wkMap[5]+wkMap[15]+wkMap[25]
            +wkMap[35]+wkMap[45]+wkMap[55];
        if(sum<=-8){
            return true;
        }
    }
    return false;
}

//動かせるマスを返す。Return:[NN,NN,NN...]
function getCanMovePanelX(panel_num,wkMap,ownflag){
    var number = wkMap[panel_num];
    var x = Math.floor(panel_num / 10);
    var y = Math.floor(panel_num % 10);
    var canMove=new Array;
    if(number==0){
        return canMove;   
    }
    //アガリのコマは動かしたらダメ。
    if(number>0 && y==0){
        return canMove;   
    }else if(number<0 && y==5){
        return canMove;   
    }
    
    for(var i=0;i<=PIECES[number].length-1;i++){
        var target_x= x + Math.floor(i%3)-1;
        var target_y= y + Math.floor(i/3)-1;
        if(PIECES[number][i]==0){
            continue;
        }
        if(target_x<0 || target_y<0||target_x>5||target_y>5 ){
            continue;
        }
        var target_number=wkMap[target_x*10+target_y];
        if(target_number*number>0 && ownflag==false){
            continue;   
        }
        //アガリのコマはとったらダメ。
        if(target_number>0 && target_y==0){
            continue;   
        }else if(target_number<0 &&target_y==5){
            continue;
        }
        canMove.push(target_x*10+target_y);
    }
    return canMove;
}
//起こりうる次の一手を返す。Return:[[q,map0],[qmap1],[q,map2]...] //q=[prev,next]
function getNodeMap(queue,wkMap,turn_player){
    var nodeList=new Array;
    for(var panel_num in wkMap){
        if(wkMap[panel_num]*turn_player<=0){
            continue;
        }
        var canMove=getCanMovePanelX(panel_num,wkMap,false);
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




//ZOCを返す。 Return:Map{NN:[Blue,Red]}
function getZOC(wkMap,turn_player){
    var zocMap=new Object();
    for(i in whiteMap){
        zocMap[i]=[0,0];
    }
    var canMove;
    for(var panel_num in wkMap){
        if(wkMap[panel_num]*turn_player>0){
            canMove=getCanMovePanelX(panel_num,wkMap,false)
        }else if (wkMap[panel_num]*turn_player<0){
            canMove=getCanMovePanelX(panel_num,wkMap,true)            
        }
        for(var num in canMove){
            if(wkMap[panel_num]>0){
                zocMap[canMove[num]][0]+=1;
            }else if(wkMap[panel_num]<0){
                zocMap[canMove[num]][1]+=1;
            }
        }
    }
    return zocMap;
}
//盤面を評価して-10000〜+10000で採点数する。
function evalMap(wkMap,turn_player){
    var ev=0;
    var zocMap;
    var evMap=copyMap(wkMap);
    //終局判定
    if(isEnd(+1,evMap)){
        return +99999;
    }else if(isEnd(-1,evMap)){
        return -99999;
    }

    //ZOC計算
    zocMap=getZOC(evMap,turn_player);
    

    //次にすぐに取られる運命のコマは死んだあつかい。
    for(var panel_num in evMap){
        z=zocMap[panel_num][0]-zocMap[panel_num][1];            
        if(turn_player*z<0 &&turn_player*evMap[panel_num]>0){
            if(evMap[panel_num]>0){
                ev+=PIECE_POINT[Math.abs(evMap[panel_num])]*0.5;
            }else if(evMap[panel_num]<0){
                ev+=PIECE_POINT[Math.abs(evMap[panel_num])]*-1*0.5;
            }
            
            evMap[panel_num]=0;
        }
    }
    zocMap=getZOC(evMap,turn_player);


    
    //評価
    for(var panel_num in evMap){
        var cell_p=0;
        var p=evMap[panel_num];
        var z;
        if(turn_player==1){
            z=zocMap[panel_num][0]-zocMap[panel_num][1]*1.1;            
        }else{
            z=zocMap[panel_num][0]*1.1-zocMap[panel_num][1];
        }
        var line;
        
        //コマの評価値を加算
        if(p>0){
            line=5-(panel_num % 10)
            cell_p+=PIECE_POINT[Math.abs(p)];//コマの標準評価値
            cell_p+=POSI_BONUS[p][line];//ポジションボーナス
            if(z<0){
                 cell_p=cell_p*0.01;//ZOCでせり負けたら無価値。
            }
            line=5-(panel_num % 10)
            cell_p+=EFF_POINTS[line]*z;//協力ボーナス
        }else if(p<0){
            line=(panel_num % 10)
            cell_p+=PIECE_POINT[Math.abs(p)] *-1;
            cell_p+=POSI_BONUS[Math.abs(p)][line]*-1;
            if(z>0){
                 cell_p=cell_p*0.01;
            }
            line=(panel_num % 10)
            cell_p+=EFF_POINTS[line]*z;            
        }
        //空き地ZOCボーナス
        if(z>0.5){
            line=5-(panel_num % 10)
            cell_p+=ZOC_POINTS[line]*z;
        }else if(z<-0.5){
            line=(panel_num % 10)
            cell_p+=ZOC_POINTS[line]*z;            
        }
        //評価値に加算。
        ev+=cell_p;
    }
    return parseInt(ev);
}

//考える。
function think(wkMap,turn_player){
    var nodeList= getNodeMap(new Array,wkMap,turn_player);
    var best_ev=null;
    var best_hand=null;
    for(var i =0;i<=nodeList.length-1;i++){
        var hand=nodeList[i][0];
        var ev =evalMap(nodeList[i][1],turn_player);
        if(best_ev==null){
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
	if(depth==0){
		best_score=evalMap(map,turn_player);
		return [besthand,best_score]
	}
    
    var nodeList= getNodeMap(new Array,map,turn_player);
	for(i in nodeList){
        var hand=nodeList[i][0];
		var map=nodeList[i][1];
        
        //必勝
        if(isEnd(turn_player,map)){
            return [hand,99999*turn_player];
        }
        //必敗
        if(isEnd(turn_player*-1,map)){
            if(besthand==undefined){
                best_score=99999*turn_player*-1;
                besthand=hand;
            }
            continue;
        }
		var sc  =deepThinkAll(map,turn_player*-1,depth-1)[1]
        
		if(besthand==undefined){
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
    
    var nodeList= getNodeMap(new Array,map,turn_player);
	for(i in nodeList){
        var hand=nodeList[i][0];
		var map=nodeList[i][1];
        
        //必勝
        if(isEnd(turn_player,map)){
            return [hand,99999*turn_player];
        }
        //必敗
        if(isEnd(turn_player*-1,map)){
            if(besthand==undefined){
                best_score=99999*turn_player*-1;
                besthand=hand;
            }
            continue;
        }
		var sc  =deepThinkAllAB(map,turn_player*-1,depth-1,b,a)[1]
		if(besthand==undefined){
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
        if(turn_player==1&&a<best_score||turn_player==-1&&a>best_score){
            a= best_score;
        }
        if(turn_player==1&&b<=best_score||turn_player==-1&&b>=best_score){
            break;
        }
        

    }
	return [besthand,best_score]
}



