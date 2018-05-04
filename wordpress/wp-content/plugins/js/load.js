/**
 * Plugin Name: Floating Window Music-Player
 * Plugin URI:  http://eric.cn.com/?p=1187
 * Author:      Eric
 * Author URI:  http://eric.cn.com/
 */

(function(){
//是否已加载播放器
  var PlayerIsLoaded = (typeof(localStorage.getItem('player_isload')) != "undefined" ? ((localStorage.getItem('player_isload') == 1 && parseInt(localStorage.getItem('player_runningtime')) + 10 > Math.round(new Date().getTime()/1000)) ? 1 : 0) : 0);
//是否加载播放器
  var PlayerIsLoad = (typeof(PlayerIsLoad) != "undefined" ? PlayerIsLoad : !PlayerIsLoaded);
  if (!PlayerIsLoad) {console.log && (console.log("%c%s", "color: #81d742; background: black; font-size: 30px", "WordPress浮窗音乐播放器\n取消加载：其他页面已加载")); return 0}
  PlayerIsLoaded = 1;
  localStorage.setItem('player_isload', 1);
  setInterval(function () {localStorage.setItem('player_runningtime', Math.round(new Date().getTime()/1000))}, 5000)
  window.onbeforeunload = function() {localStorage.setItem('player_isload', 0)}
  var FwmPlayerCode =
    '<div id = "FwmPlayer" class = "show">'
    +'  <div class = "player">'
    +'    <div class = "blur-img"><img class = "blur"></div>'
    +'    <div class = "infos">'
    +'      <div class = "songstyle">'
    +'        <i class = "fa fa-music" aria-hidden = 1></i>'
    +'        <span class = "song"></span>'
    +'        <span class = "timestyle" title = "' + pollsL10n.Time + '"><span class = "time">00:00/00:00</span></span>'
    +'      </div>'
    +'      <div class = "artiststyle">'
    +'        <i class = "fa fa-user" aria-hidden = 1></i>'
    +'        <span class = "artist"></span>'
    +'        <span class = "moshi" title = "' + pollsL10n.Playback + '"><i class = "random fa fa-random" aria-hidden = 1></i></span>'
    +'      </div>'
    +'      <div class = "artiststyle">'
    +'        <i class = "fa fa-folder" aria-hidden = 1></i>'
    +'        <span class = "artist1"></span>'
    +'        <span class = "geci" title = "' + pollsL10n.Lyric + '"></span>'
    +'      </div>'
    +'    </div>'
    +'    <div class = "control">'
    +'      <i class = "aprev fa fa-fast-backward" title = "' + pollsL10n.Previous + '" aria-hidden = 1></i>'
    +'      <i class = "prev fa fa-backward" title = "' + pollsL10n.Pre + '" aria-hidden = 1></i>'
    +'      <div class = "status">'
    +'        <b><i class = "play fa fa-play" title = "' + pollsL10n.Playb + '" aria-hidden = 1></i><i class = "pause fa fa-pause" title = "' + pollsL10n.Pause + '" aria-hidden = 1></i></b>'
    +'      </div>'
    +'      <i class = "anext fa fa-fast-forward" title = "' + pollsL10n.Next + '" aria-hidden = 1></i>'
    +'      <i class = "next fa fa-forward" title = "' + pollsL10n.Nexts + '" aria-hidden = 1></i>'
    +'    </div>'
    +'    <div class = "musicbottom">'
    +'      <div class = "playprogress">'
    +'        <div class = "progressbg" title = "' + pollsL10n.SP + '">'
    +'          <div class = "progressbg1"></div>'
    +'          <div class = "progressbg2"></div>'
    +'          <i class = "ts fa fa-circle-o" aria-hidden = 1></i>'
    +'        </div>'
    +'      </div>'
    +'      <li class = "volumecontrol">'
    +'        <i class = "volume fa fa-volume-up" title = "' + pollsL10n.mute + '"></i>'
    +'        <div class = "volumeprogress">'
    +'          <div class = "progressbg" title = "' + pollsL10n.volume + '">'
    +'            <div class = "progressbg1"></div>'
    +'            <i class = "ts fa fa-circle-o" aria-hidden = 1></i>'
    +'          </div>'
    +'        </div>'
    +'      </li>'
    +'      <i class = "switch-info fa fa-home" title = "' + pollsL10n.Homepage + '" aria-hidden = 1></i>'
    +'      <i class = "down"><i class = "fa fa-download" title = "' + pollsL10n.Down + '" aria-hidden = 1></i></i>'
    +'      <div class = "switch-playlist"><i class = "fa fa-list-ul" title = "' + pollsL10n.Playlist + '" aria-hidden = 1></i></div>'
    +'    </div>'
    +'    <div class = "cover" title = "' + pollsL10n.View + '"></div>'
    +'  </div>'
    +'  <div class = "playlist">'
    +'    <div class = "playlist-bd">'
    +'      <div class = "album-list">'
    +'        <div class = "musicheader"></div>'
    +'        <div class = "list"></div>'
    +'      </div>'
    +'      <div class = "song-list">'
    +'        <div class = "musicheader"><i class = "fa fa-angle-right" aria-hidden=1></i><span></span></div>'
    +'        <div class = "list"><ul></ul></div>'
    +'      </div>'
    +'    </div>'
    +'  </div>'
    +'  <div class = "switch-player" title = "' + pollsL10n.hide + '">'
    +'    <span class = "musicbar inline m-l-sm">'
    +'      <span class = "bar1 a1 bg-primary lter"></span>'
    +'      <span class = "bar2 a2 bg-info lt"></span>'
    +'      <span class = "bar3 a3 bg-success"></span>'
    +'      <span class = "bar4 a4 bg-warning dk"></span>'
    +'      <span class = "bar5 a5 bg-danger dker"></span>'
    +'    </span>'
    +'  </div>'
    +'  <div class = "switch-sourse">'
    +'    <div><img src = "//s1.music.126.net/music.ico" width = "18" class = "switch-netease desaturate" title = "' + pollsL10n.change + pollsL10n.wym + '"/></div>'
    +'    <div><img src = "//y.qq.com/favicon.ico" width = "18" class = "switch-tencent desaturate" title = "' + pollsL10n.change  + pollsL10n.qqm + '"/></div>'
    +'    <div><img src = "//g.alicdn.com/de/music-static/favicon.ico" width = "18" class = "switch-xiami desaturate" title = "' + pollsL10n.change  + pollsL10n.xmm + '"/></div>'
    +'    <div><img src = "//www.baidu.com/favicon.ico" width = "18" class = "switch-baidu desaturate" title = "' + pollsL10n.change  + pollsL10n.bdm + '"/></div>'
    +'    <div><img src = "' + FwmURL + '/inc/kugou.ico" width = "18" class = "switch-kugou desaturate" title = "' + pollsL10n.change  + pollsL10n.kgm + '"/></div>'
    +'  </div>'
    +'</div>'
    +'<div id = "FwmTips"></div>'
    +'<div id = "FwmLrc"></div>'
    +'<div class = "loading">'
    +'  <div class = "block"></div>'
    +'  <div class = "block"></div>'
    +'  <div class = "block"></div>'
    +'  <div class = "block"></div>'
    +'</div>';
  $(document).ready(function(){
    $('body').append(FwmPlayerCode).fadeIn(5000);
    FwmPlayerCode = null;
    $.ajax({url: FwmURL + "/js/player.js?ver=" + ver, dataType: "script", cache: 1, async: 1, success: function(data) {window.console && window.console.log && (console.log("%c%s", "color: #81d742; background: black; font-size: 30px", "WordPress浮窗音乐播放器  \n作者:Eric               \n版本:" + ver + "加载成功！     \n主页:http://eric.cn.com/"))}, error: function(error) {}})
  })
})()