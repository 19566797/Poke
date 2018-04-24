var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var sceneproxy;
(function (sceneproxy) {
    //游戏界面逻辑
    var GameSceneProxy = (function (_super) {
        __extends(GameSceneProxy, _super);
        function GameSceneProxy() {
            var _this = _super.call(this) || this;
            _this._recordObj = {};
            _this._playerList = []; //用户数组
            _this._tableCardList = []; //桌面牌
            _this._landList = [];
            _this._myPlayer = null;
            _this._scene = null;
            _this._landscore = 0;
            _this._timecount = 1;
            _this._gamestate = 0;
            _this._lastSendCardPlayer = null;
            return _this;
        }
        GameSceneProxy.prototype.Init = function (sb) {
            this._scene = sb;
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_ROOMIN, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_OTHERPLAYERIN, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_SENDCARD, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_TURNCALLLAND, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_OTHERCALLLAND, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_CALLLANDOVER, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_TURNPALY, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_SHOWPALY, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_GAMEOVER, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_SENDCHAT, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_READY, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_PLAYEROUT, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_AUTO, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_ACTIVITYONLINE, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_WAITACTIVITYEND, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_LOBBYIN, this.onNetMsg, this);
            NetMgr.Instance.addEventListener(enums.NetEvent.NETEVENT_ADDFREEMONEY, this.onNetMsg, this);
            NetMgr.Instance.SendMsg(enums.NetEnum.CLIENT_2_CENTER_LOGIN_OK);
        };
        GameSceneProxy.prototype.Release = function () {
            this._recordObj = {};
            this._playerList = []; //用户数组
            this._tableCardList = []; //桌面牌
            this._landList = [];
            this._myPlayer = null;
            this._scene = null;
            this._landscore = 0;
            this._timecount = 1;
            this._gamestate = 0;
            this._lastSendCardPlayer = null;
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_ROOMIN, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_OTHERPLAYERIN, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_SENDCARD, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_TURNCALLLAND, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_OTHERCALLLAND, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_CALLLANDOVER, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_TURNPALY, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_SHOWPALY, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_GAMEOVER, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_SENDCHAT, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_READY, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_PLAYEROUT, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_AUTO, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_ACTIVITYONLINE, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_WAITACTIVITYEND, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_LOBBYIN, this.onNetMsg, this);
            NetMgr.Instance.removeEventListener(enums.NetEvent.NETEVENT_ADDFREEMONEY, this.onNetMsg, this);
        };
        GameSceneProxy.prototype.onNetMsg = function (e) {
            console.info(e.data);
            switch (e.type) {
                case enums.NetEvent.NETEVENT_ADDFREEMONEY:
                    var valueobj = JSON.parse(e.data.value);
                    windowui.SysTipsInst.Instance.Show("金币输光了,系统免费赠送您" + valueobj.addmoney + "金币,继续玩耍吧!", function () {
                        windowui.SysTipsInst.Instance.Hide();
                    }, this, true);
                    data.GameData.money = valueobj.nowmoney;
                    this._scene.AddFreeMoney();
                    break;
                case enums.NetEvent.NETEVENT_LOBBYIN:
                    SceneMgr.Instance.ShowScene(scene.LobbyScene);
                    break;
                case enums.NetEvent.NETEVENT_ROOMIN:
                    this._gamestate = 0;
                    for (var i in this._playerList) {
                        var player = this._playerList[i];
                        this._scene.PlayerOut(player, player == this._myPlayer);
                        this._playerList[i] = null;
                    }
                    //设置初始房间人员数组
                    var valueobj = JSON.parse(e.data.value);
                    var playerlist = valueobj.playerlist;
                    var gamestate = valueobj.gamestate;
                    var playerpoint = valueobj.playerpoint;
                    var actetime = valueobj.actetime; //todo 活动结束时间
                    var lastsend = valueobj.lastsend;
                    this._landscore = valueobj.landscore;
                    this._tableCardList = valueobj.tablelist;
                    this._timecount = valueobj.timecount;
                    this._landList = valueobj.landlist;
                    for (var i in playerlist) {
                        var obj = playerlist[i];
                        var player = this._playerList[obj.TableId];
                        if (player) {
                            player.Reset(obj);
                        }
                        else {
                            player = new data.Player(obj);
                            this._playerList[player.TableId] = player;
                        }
                        if (player.playerGuid == data.GameData.playerGuid) {
                            this._myPlayer = player;
                            this._myPlayer.LocalTableId = 3;
                            data.GameData.IsAuto = false;
                            this._scene.SetAuto(this._myPlayer.LocalTableId, false);
                        }
                    }
                    for (var i in this._playerList) {
                        var pp = this._playerList[i];
                        if (pp) {
                            pp.LocalTableId = this.getLocalTableId(pp.TableId, this._myPlayer.TableId);
                        }
                    }
                    var pointplayer = this.getPlayerByTableId(playerpoint);
                    //根据游戏状态设置一下断线情况 // 0:游戏没有开始或者结束,1:发牌,2,叫地主,3,打牌,4,叫完地主等1秒
                    switch (gamestate) {
                        case 0:
                            this._myPlayer.CardArr = [];
                            this._myPlayer.IsReady = false;
                            this._scene.RoomIn(this._playerList);
                            break;
                        case 1:
                            this._scene.RoomIn(this._playerList);
                            this._scene.ReNet(this._landList, this.getLandPlayer(), this._myPlayer, this._landscore + "x" + 1, this._playerList);
                            this._scene.TurnCallLand(pointplayer, pointplayer == this._myPlayer, this._landscore, 30000);
                            break;
                        case 2:
                            this._scene.RoomIn(this._playerList);
                            this._scene.ReNet(this._landList, this.getLandPlayer(), this._myPlayer, this._landscore + "x" + 1, this._playerList);
                            this._scene.TurnCallLand(pointplayer, pointplayer == this._myPlayer, this._landscore, 30000);
                            break;
                        case 3:
                            this._scene.RoomIn(this._playerList);
                            this._scene.ReNet(this._landList, this.getLandPlayer(), this._myPlayer, this._landscore + "x" + 1, this._playerList);
                            var lastplayer = this.getPlayerByTableId(lastsend);
                            this._scene.TurnPlay(pointplayer, pointplayer == this._myPlayer, false, this._tableCardList, 30000, false, lastplayer);
                            break;
                        default:
                            break;
                    }
                    this._gamestate = gamestate;
                    //通知原生
                    //                    if(data.GameData.flag==data.GameData.GameFlag_Challenge)
                    //                    {
                    //                        NativeMgr.Instance.waitPlayer();
                    //                    }
                    break;
                case enums.NetEvent.NETEVENT_OTHERPLAYERIN:
                    if (this._gamestate != 0) {
                        return;
                    }
                    var pobj = e.data.value;
                    var player = null;
                    for (var i in this._playerList) {
                        var pp = this._playerList[i];
                        if (pp && pp.TableId == pobj.TableId) {
                            pp.Reset(pobj);
                            player = pp;
                        }
                    }
                    if (player == null) {
                        player = new data.Player(e.data.value);
                        this._playerList[player.TableId] = (player);
                    }
                    player.LocalTableId = this.getLocalTableId(player.TableId, this._myPlayer.TableId);
                    this._scene.PlayerIn(player);
                    break;
                case enums.NetEvent.NETEVENT_PLAYEROUT:
                    if (this._gamestate != 0) {
                        return;
                    }
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    if (player && player != this._myPlayer) {
                        this._playerList[player.TableId] = null;
                        this._scene.PlayerOut(player, player == this._myPlayer);
                    }
                    break;
                case enums.NetEvent.NETEVENT_READY:
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    player.IsReady = true;
                    this._scene.SetReady(player.LocalTableId, true, player == this._myPlayer);
                    break;
                case enums.NetEvent.NETEVENT_AUTO:
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    var isme = (player == this._myPlayer);
                    player.IsAuto = valueobj.isauto;
                    this._scene.SetAuto(player.LocalTableId, valueobj.isauto);
                    if (isme) {
                        data.GameData.IsAuto = valueobj.isauto;
                    }
                    break;
                case enums.NetEvent.NETEVENT_SENDCARD:
                    this._gamestate = 1;
                    var valueobj = JSON.parse(e.data.value);
                    this._myPlayer.CardArr = valueobj.cardlist;
                    this._scene.SendCard(this._myPlayer);
                    //清除地主标致
                    for (var i in this._playerList) {
                        var pp = this._playerList[i];
                        if (pp) {
                            pp.IsLandOwner = false;
                        }
                    }
                    break;
                case enums.NetEvent.NETEVENT_TURNCALLLAND:
                    this._gamestate = 2;
                    var valueobj = JSON.parse(e.data.value);
                    var cardnum1 = valueobj.cardnum1;
                    var cardnum2 = valueobj.cardnum2;
                    var cardnum3 = valueobj.cardnum3;
                    var p1 = this.getPlayerByTableId(0);
                    var p2 = this.getPlayerByTableId(1);
                    var p3 = this.getPlayerByTableId(2);
                    if (p1) {
                        p1.ShowCardNum = cardnum1;
                    }
                    if (p2) {
                        p2.ShowCardNum = cardnum2;
                    }
                    if (p3) {
                        p3.ShowCardNum = cardnum3;
                    }
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    this._scene.TurnCallLand(player, player == this._myPlayer, this._landscore, GameSceneProxy.Delay_CallLand);
                    break;
                case enums.NetEvent.NETEVENT_OTHERCALLLAND://包括自己
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    if (valueobj.score > this._landscore) {
                        this._landscore = valueobj.score;
                    }
                    this._scene.ShowCallLand(valueobj.score, player.LocalTableId);
                    if (valueobj.score == 0) {
                        SoundMgr.Instance.PlayEffect("woman_bujiao_mp3");
                    }
                    else if (valueobj.score == 1) {
                        SoundMgr.Instance.PlayEffect("woman_jiaodizhu_mp3");
                    }
                    else if (valueobj.score == 2) {
                        SoundMgr.Instance.PlayEffect("woman_qiangdizhu2_mp3");
                    }
                    else if (valueobj.score == 3) {
                        SoundMgr.Instance.PlayEffect("woman_qiangdizhu3_mp3");
                    }
                    break;
                case enums.NetEvent.NETEVENT_CALLLANDOVER://包括自己
                    this._gamestate = 3;
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.landtableid);
                    this._landList = valueobj.cardlist;
                    this._landscore = valueobj.landscore;
                    var timestr = this._landscore + "x" + 1;
                    //清除地主标致
                    for (var i in this._playerList) {
                        var pp = this._playerList[i];
                        if (pp) {
                            pp.IsLandOwner = false;
                        }
                    }
                    player.IsLandOwner = true;
                    if (player == this._myPlayer) {
                        this._myPlayer.AddCards(valueobj.cardlist);
                    }
                    player.ShowCardNum = 20;
                    this._scene.CallLandOver(player, valueobj.cardlist, this._myPlayer, timestr);
                    break;
                case enums.NetEvent.NETEVENT_TURNPALY:
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    var isnew = valueobj.isnew;
                    var cardnum1 = valueobj.cardnum1;
                    var cardnum2 = valueobj.cardnum2;
                    var cardnum3 = valueobj.cardnum3;
                    var p1 = this.getPlayerByTableId(0);
                    var p2 = this.getPlayerByTableId(1);
                    var p3 = this.getPlayerByTableId(2);
                    var canshowAll = false; //别人都剩一张的时候自己没有单牌,可以全下条件
                    p1.ShowCardNum = cardnum1;
                    p2.ShowCardNum = cardnum2;
                    p3.ShowCardNum = cardnum3;
                    if (isnew) {
                        this._tableCardList = [];
                        this._lastSendCardPlayer = null;
                        if (player == this._myPlayer) {
                            canshowAll = true;
                            if (p1 != player && p1.ShowCardNum > 1) {
                                canshowAll = false;
                            }
                            if (p2 != player && p2.ShowCardNum > 1) {
                                canshowAll = false;
                            }
                            if (p3 != player && p3.ShowCardNum > 1) {
                                canshowAll = false;
                            }
                        }
                    }
                    this._scene.TurnPlay(player, player == this._myPlayer, isnew, this._tableCardList, GameSceneProxy.Delay_ShowCard, false);
                    break;
                case enums.NetEvent.NETEVENT_SHOWPALY:
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    var clist = valueobj.cardlist;
                    var yasiloc = 1; //是大谁的牌
                    this._timecount = valueobj.timecount;
                    var timestr = this._landscore + "x" + this._timecount;
                    player.ShowCardNum = valueobj.cardnum;
                    player.removeCards(clist);
                    if (this._tableCardList == null || this._tableCardList.length == 0) {
                        var yasplayer = this.getPlayerEnemy(player);
                        if (yasplayer) {
                            yasiloc = yasplayer.LocalTableId;
                        }
                    }
                    else {
                        if (this._lastSendCardPlayer) {
                            yasiloc = this._lastSendCardPlayer.LocalTableId;
                        }
                    }
                    if (clist != null && clist.length > 0) {
                        this._tableCardList = clist;
                        this._lastSendCardPlayer = player;
                    }
                    this._scene.ShowPlay(player, clist, player == this._myPlayer, timestr, yasiloc);
                    if (clist != null && clist.length > 0) {
                        SoundMgr.Instance.PlayEffect("card_down_mp3");
                    }
                    else {
                        SoundMgr.Instance.PlayEffect("woman_buyao" + (player.LocalTableId) + "_mp3");
                    }
                    break;
                case enums.NetEvent.NETEVENT_GAMEOVER:
                    this._gamestate = 0;
                    var valueobj = JSON.parse(e.data.value);
                    var winplayer = this.getPlayerByTableId(valueobj.wintableid); //自己的player
                    var islandwin = valueobj.islandwin;
                    var isactover = valueobj.isactover;
                    var actrank = valueobj.rank;
                    var actHScore = valueobj.maxMoney;
                    var actmoney = valueobj.actmoney;
                    this._timecount = valueobj.timecount;
                    var timestr = this._landscore + "x" + this._timecount;
                    var t1 = valueobj.tablelist_0;
                    var t2 = valueobj.tablelist_1;
                    var t3 = valueobj.tablelist_2;
                    var p1 = this.getPlayerByTableId(0);
                    var p2 = this.getPlayerByTableId(1);
                    var p3 = this.getPlayerByTableId(2);
                    this.setResoulScore(p1, islandwin);
                    this.setResoulScore(p2, islandwin);
                    this.setResoulScore(p3, islandwin);
                    if (p1) {
                        p1.CardArr = t1;
                        p1.ShowCardNum = t1.length;
                        p1.IsReady = false;
                        this._scene.SetAuto(p1.LocalTableId, false);
                    }
                    if (p2) {
                        p2.CardArr = t2;
                        p2.ShowCardNum = t2.length;
                        p2.IsReady = false;
                        this._scene.SetAuto(p2.LocalTableId, false);
                    }
                    if (p3) {
                        p3.CardArr = t3;
                        p3.ShowCardNum = t3.length;
                        p3.IsReady = false;
                        this._scene.SetAuto(p3.LocalTableId, false);
                    }
                    data.GameData.IsAuto = false;
                    //windowui.SettingInst.Instance.SetAutoBtn();
                    var tp1 = this.getPlayerByLocalTableId(1);
                    var tp2 = this.getPlayerByLocalTableId(2);
                    var tp3 = this.getPlayerByLocalTableId(3);
                    var iswin = this._myPlayer.IsLandOwner == islandwin;
                    if (actmoney <= 0 && data.GameData.flag == data.GameData.GameFlag_Activity) {
                        data.GameData.IsActivityKick = true;
                    }
                    this._scene.GameOver(iswin, tp1, tp2, tp3, islandwin, timestr, isactover, actrank, actHScore, actmoney, winplayer);
                    this._landscore = 0;
                    this._timecount = 1;
                    //添加战斗记录存档
                    //if(this._playerList[0]&&this._playerList[1]&&this._playerList[2])
                    //{
                    //    if(this._recordObj.playerlist==null||(
                    //            this._recordObj.playerlist[0]!=this._playerList[0]||
                    //            this._recordObj.playerlist[1]!=this._playerList[1]||
                    //            this._recordObj.playerlist[2]!=this._playerList[2]
                    //        ))
                    //    {
                    //        this._recordObj.playerlist=[];
                    //        this._recordObj.scorelist=[];
                    //        this._recordObj.playerlist.push(this._playerList[0]);
                    //        this._recordObj.playerlist.push(this._playerList[1]);
                    //        this._recordObj.playerlist.push(this._playerList[2]);
                    //    }
                    //
                    //    var recordobj=LocalMgr.Instance.GetData(LocalMgr.RecordObj);
                    //    var arr:any=[];
                    //    arr.push(this._playerList[0].userid);
                    //    arr.push(this._playerList[1].userid);
                    //    arr.push(this._playerList[2].userid);
                    //    arr.sort();
                    //    var key:string=arr[0]+arr[1]+arr[2];
                    //    var klist:any=recordobj[key];
                    //    var lanid:number=1;
                    //    if(this._playerList[1].IsLandOwner)
                    //    {
                    //        lanid=2;
                    //    }
                    //    else if(this._playerList[2].IsLandOwner)
                    //    {
                    //        lanid=3;
                    //    }
                    //    if(!(klist instanceof Array))
                    //    {
                    //        klist=[];
                    //        recordobj[key]=klist;
                    //    }
                    //    klist.push({time:new Date().getTime(),landid:lanid,s1:p1.ResoultScore,s2:p2.ResoultScore,s3:p3.ResoultScore});
                    //    if(klist.length>50)
                    //    {
                    //        klist.pop();
                    //    }
                    //    LocalMgr.Instance.SetData(LocalMgr.RecordObj,recordobj);
                    //}
                    if (iswin) {
                        SoundMgr.Instance.PlayEffect("Win_mp3");
                    }
                    else {
                        SoundMgr.Instance.PlayEffect("Lose_mp3");
                    }
                    break;
                case enums.NetEvent.NETEVENT_SENDCHAT:
                    var valueobj = JSON.parse(e.data.value);
                    var player = this.getPlayerByTableId(valueobj.tableid);
                    this._scene.PlayChat(player.LocalTableId, valueobj.chatStr);
                    var chatlist = windowui.ChatInst.WordList;
                    var iii = 0;
                    for (iii = 0; iii < chatlist.length; iii++) {
                        if (valueobj.chatStr == chatlist[iii]) {
                            //SoundMgr.Instance.PlayEffect("chat_"+iii+"_mp3");
                        }
                    }
                    break;
                case enums.NetEvent.NETEVENT_WAITACTIVITYEND:
                    windowui.SysTipsInst.Instance.Show("比赛结束时间已到,等待所有玩家结束游戏", function () {
                        NativeMgr.Instance.ExitWindow();
                    }, this, true, "提前退出");
                    break;
                case enums.NetEvent.NETEVENT_ACTIVITYONLINE:
                    var valueobj = JSON.parse(e.data.value);
                    var enterCount = valueobj.enterCount;
                    var leftCount = valueobj.leftCount;
                    var flag = valueobj.flag;
                    var nickname = valueobj.nickname;
                    if (flag > 0) {
                        this._scene.PlayHouseRunning("玩家 " + nickname + " 加入活动,本次活动共有" + enterCount + "人参与,竞争越来越激烈,各位玩家加油!");
                    }
                    else if (flag < 0) {
                        //this._scene.PlayHouseRunning("玩家 "+nickname+" 不幸被淘汰出局,本次活动还剩"+leftCount+"人,各位玩家请再接再厉!");
                        this._scene.PlayHouseRunning("经过激烈争夺,本次活动已淘汰" + (enterCount - leftCount) + "人,还剩" + leftCount + "人,各位玩家请再接再厉!");
                    }
                    break;
                default:
                    break;
            }
        };
        GameSceneProxy.prototype.setResoulScore = function (p, islandwin) {
            if (p == null) {
                return 0;
            }
            var rd = 1;
            if (p.IsLandOwner != islandwin) {
                rd = -1;
            }
            rd = rd * this._timecount * this._landscore;
            if (p.IsLandOwner) {
                rd *= 2;
            }
            p.ResoultScore = rd;
            if (data.GameData.flag != data.GameData.GameFlag_Activity) {
                p.integral += rd;
                p.money += rd;
                if (p == this._myPlayer) {
                    data.GameData.integral = p.integral;
                    data.GameData.money = p.money;
                    this._scene.AddFreeMoney();
                }
            }
        };
        GameSceneProxy.prototype.getLocalTableId = function (table, maintalble) {
            var loc = -1;
            var dec = table - maintalble;
            if (dec == 1 || dec == -2) {
                loc = 2;
            }
            else if (dec == -1 || dec == 2) {
                loc = 1;
            }
            else if (dec == 0) {
                loc = 3;
            }
            return loc;
        };
        //private removePlayerByTableId(id:number):void
        //{
        //    for(var i in this._playerList)
        //    {
        //        if(this._playerList[i].TableId==id)
        //        {
        //            this._playerList.splice(i,1);
        //        }
        //    }
        //}
        GameSceneProxy.prototype.getPlayerEnemy = function (p) {
            var tableloc = 0;
            var pp = null;
            for (var i in this._playerList) {
                if (this._playerList[i] == null || this._playerList[i] == p) {
                    continue;
                }
                if (this._playerList[i].IsLandOwner != p.IsLandOwner && this._playerList[i].LocalTableId > tableloc) {
                    tableloc = this._playerList[i].LocalTableId;
                    pp = this._playerList[i];
                }
            }
            return pp;
        };
        GameSceneProxy.prototype.getLandPlayer = function () {
            for (var i in this._playerList) {
                if (this._playerList[i] && this._playerList[i].IsLandOwner) {
                    return this._playerList[i];
                }
            }
            return null;
        };
        GameSceneProxy.prototype.getPlayerByTableId = function (id) {
            for (var i in this._playerList) {
                if (this._playerList[i] && this._playerList[i].TableId == id) {
                    return this._playerList[i];
                }
            }
            return null;
        };
        GameSceneProxy.prototype.getPlayerByLocalTableId = function (id) {
            for (var i in this._playerList) {
                if (this._playerList[i] && this._playerList[i].LocalTableId == id) {
                    return this._playerList[i];
                }
            }
            return null;
        };
        GameSceneProxy.prototype.GetMainPlayer = function () {
            return this._myPlayer;
        };
        GameSceneProxy.prototype.GetRecordObj = function () {
            //存档
            if (this._playerList[0] && this._playerList[1] && this._playerList[2]) {
                var recordobj = LocalMgr.Instance.GetData(LocalMgr.RecordObj);
                var arr = [];
                arr.push(this._playerList[0].userid);
                arr.push(this._playerList[1].userid);
                arr.push(this._playerList[2].userid);
                arr.sort();
                var key = arr[0] + arr[1] + arr[2];
                var klist = recordobj[key];
                if (!(klist instanceof Array)) {
                    return [];
                }
                else {
                    if (this._recordObj.playerlist == null || (this._recordObj.playerlist[0] != this._playerList[0] ||
                        this._recordObj.playerlist[1] != this._playerList[1] ||
                        this._recordObj.playerlist[2] != this._playerList[2])) {
                        this._recordObj.playerlist = [];
                        this._recordObj.scorelist = [];
                        this._recordObj.playerlist.push(this._playerList[0]);
                        this._recordObj.playerlist.push(this._playerList[1]);
                        this._recordObj.playerlist.push(this._playerList[2]);
                    }
                    this._recordObj.scorelist = recordobj[key];
                    return this._recordObj;
                }
            }
            return [];
        };
        GameSceneProxy.Delay_ReadyKick = 30000; //15秒不准备踢出
        GameSceneProxy.Delay_SendCardAni = 6000; //4秒发牌动画
        GameSceneProxy.Delay_CallLand = 10000; //10秒叫地主
        GameSceneProxy.Delay_ShowCard = 25000; //25秒游戏发牌
        return GameSceneProxy;
    }(sceneproxy.SceneProxyBase));
    sceneproxy.GameSceneProxy = GameSceneProxy;
    __reflect(GameSceneProxy.prototype, "sceneproxy.GameSceneProxy");
})(sceneproxy || (sceneproxy = {}));
//# sourceMappingURL=GameSceneProxy.js.map