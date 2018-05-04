$player = $("#FwmPlayer");
$lrc = $("#FwmLrc");
$play = $(".switch-player", $player);
$bar = $(".musicbar", $play);
$cover = $(".cover", $player);
$songList = $(".song-list .list", $player);
$albumList = $(".album-list", $player);
$geci = $(".geci", $player);
$playprogress = $(".playprogress .progressbg", $player);
$volumeprogress = $(".volumeprogress .progressbg", $player);
$qq = $(".switch-tencent", $player);
$bd = $(".switch-baidu", $player);
$wy = $(".switch-netease", $player);
$xm = $(".switch-xiami", $player);
$kg = $(".switch-kugou", $player);
roundcolor = "#6c6971";
lightcolor = "#81c300";
cur = "current";
des = "desaturate";
//音量、歌词模式及自动播放默认设置
if (typeof(localStorage.player_volume) == "undefined") localStorage.player_volume = .9;
if (typeof(localStorage.player_tlrc) == "undefined") localStorage.player_tlrc = 0;
if (typeof(localStorage.player_autoplay) == "undefined") localStorage.player_autoplay = 1;
if (top.location != self.location) exit;
else {
  setime = ycgeci = showLrc = 1;
  songTotal = songId = albumId = loop = mute = currentFrameId = musicfirsttip = isDown = hasLrc = 0;
//自动隐藏
  jQuery(document).ready(function() {setTimeout(function() {$player.removeClass("show"); $play.attr("title", pollsL10n.show)}, st)})
//移动端关闭歌词及自动播放
  navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) && (geci = auto = "NO", hasgeci = 0)
//是否开启歌词
  hasgeci = "YES" != geci ? 0 : 1;
//是否随机歌曲
  random = "YES" != random ? 0 : 1;
  $cover.html('<img src = ' + FwmURL + '/inc/default.jpg>');
  $(".song", $player).html('<a href = "http://eric.cn.com/" target = "_blank">' + pollsL10n.Load + '</a>');
  $(".player .artist", $player).html('<a href = "http://eric.cn.com/" target = "_blank">' + pollsL10n.wait + '</a>');
  $(".player .artist1", $player).html('<a href = "http://eric.cn.com/" target = "_blank">Eric音像馆</a>');
  $geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.lyrics + pollsL10n.Failed);
//歌曲进度条缓存进度
  var cicleTime = function() {audio.buffered.length && (a = 100 * audio.buffered.start(currentFrameId) / audio.duration, b = 100 * audio.buffered.end(currentFrameId) / audio.duration, $(".progressbg2", $playprogress).css({left: a + "%", width: b - a + "%"}))},
  audio = new Audio,
  FwmMedia = {
    play: function() {
      currentFrameId = GetCurrentFrame();
      $player.addClass("playing");
      hasLrc && (lrcTime = setInterval(FwmLrc.lrc.play, 500), $lrc.addClass("show"))
    },
    pause: function() {$player.removeClass("playing"); hasLrc && FwmLrc.lrc.hide()},
    error: function() {
      $player.removeClass("playing");
      FwmTips.show(FwmLists[albumId].song_list[songId].song_title + pollsL10n.Failed);
      setTimeout(function() {FwmMedia.prev()}, 1E3);
      $(".loading").hide()
    },
    seeking: function() {FwmTips.show(pollsL10n.Seek)},
    volumechange: function() {
      $(".ts", $volumeprogress).css("top", 100 * (1 - audio.volume) + "px");
      $(".progressbg1", $volumeprogress).height(100 * audio.volume);
      mute ? FwmTips.show(pollsL10n.mute) : FwmTips.show(pollsL10n.volume + "：" + window.parseInt(100 * audio.volume) + "%")
    },
//获取歌单信息
    getInfos: function(a, b) {
      songId = a;
      albumId = b;
      currentFrameId = 0;
      $cover.removeClass("coverplay");
      $bar.removeClass("animate");
      $(".down", $player).hide();
      id = FwmLists[albumId].song_list[songId].song_id;
      audio.src = FwmLists[albumId].song_list[songId].mp3url;
      $(".down", $player).show().html("<i class = 'fa fa-download' aria-hidden = 1 title = '" + pollsL10n.download + origin + "：" + FwmLists[albumId].song_list[songId].song_title + " - " + FwmLists[albumId].song_list[songId].singer + "'></i>");
      $bar.attr("title", pollsL10n.play + "：" + FwmLists[albumId].song_list[songId].song_title + " - " + FwmLists[albumId].song_list[songId].singer);
//下载键
      $(".down").click(function() {window.open(audio.src, "newwindow")})
      $(".song", $player).html("<span title = '" + pollsL10n.song + FwmLists[albumId].song_list[songId].song_title + "'>" + LimitStr(FwmLists[albumId].song_list[songId].song_title) + "</span>");
      $(".player .artist", $player).html("<span title = '" + pollsL10n.singer + FwmLists[albumId].song_list[songId].singer + "'>" + LimitStr(FwmLists[albumId].song_list[songId].singer) + "</span>");
      $(".player .artist1", $player).html("<span title = '" + pollsL10n.album + FwmLists[albumId].song_list[songId].album + "'>" + LimitStr(FwmLists[albumId].song_list[songId].album) + "</span>");
      allmusic();
      var c = new Image;
      c.src = FwmLists[albumId].song_list[songId].pic;
      $cover.addClass("changing");
      loadblur(c.src);
      c.onload = function() {
        setTimeout(function() {$(".loading").hide()}, 800)
        setTimeout(function() {$cover.removeClass("changing")}, 100)
        $.ajax({url: ajax_url, type: "GET", dataType: "script", data: {action: 'Fwm_api', do: 'color', url: c.src}, success: function() {$(".loading").hide(); playercolor()}, error: function() {$(".loading").hide()}})
      }
      c.error = function() {setTimeout(function() {$(".loading").hide()}, 800); c.src = FwmURL + "/inc/default.jpg"; setTimeout(function() {FwmTips.show(FwmLists[albumId].song_list[songId].song_title + pollsL10n.Failed)}, 4E3)}
      $cover.html('<img class = "pic" src = "' + c.src + '">');
//封面图键
      $(".pic").click(function() {window.open(c.src, "newwindow")})
      audio.volume = localStorage.player_volume;
//是否自动播放
      localStorage.player_autoplay == 0 ? (FwmMedia.pause(), $lrc.hide(), setTimeout(function() {FwmTips.show(pollsL10n.Auto+pollsL10n.Stop)}, 3E3)) : "NO" != auto ? (FwmTips.show(pollsL10n.from + origin + "：" + FwmLists[albumId].song_list[songId].song_title + " - " + FwmLists[albumId].song_list[songId].singer), audio.play(), $cover.addClass("coverplay"), $bar.addClass("animate")) : (FwmMedia.pause(), $lrc.hide(), setTimeout(function() {FwmTips.show(pollsL10n.off+pollsL10n.Autoplay)}, 3E3));
      FwmLrc.load()
    },
    getSongId: function(a) {return a >= songTotal ? 0 : 0 > a ? songTotal - 1 : a},
    getalbumId: function(b) {return b >= albumTotal ? 0 : 0 > b ? albumTotal - 1 : b},
    next: function() {random ? FwmMedia.getInfos(window.parseInt(Math.random() * songTotal), albumId) : FwmMedia.getInfos(FwmMedia.getSongId(songId + 1), albumId)},
    prev: function() {random ? FwmMedia.getInfos(window.parseInt(Math.random() * songTotal), albumId) : FwmMedia.getInfos(FwmMedia.getSongId(songId - 1), albumId)},
    anext: function() {aID = suiji ? window.parseInt(Math.random() * albumTotal) : FwmMedia.getalbumId(albumId + 1); sID = FwmLists[aID].song_list.length; random ? FwmMedia.getInfos(window.parseInt(Math.random() * sID), aID) : FwmMedia.getInfos(0, aID)},
    aprev: function() {aID = suiji ? window.parseInt(Math.random() * albumTotal) : FwmMedia.getalbumId(albumId - 1); sID = FwmLists[aID].song_list.length; random ? FwmMedia.getInfos(window.parseInt(Math.random() * sID), aID) : FwmMedia.getInfos(0, aID)},
    seeked: function() {currentFrameId = GetCurrentFrame()},
    timeupdate: function() {
      cicleTime();
      $(".ts", $playprogress).css("left", 100 * (audio.currentTime / audio.duration).toFixed(2) + "%");
      $(".progressbg1", $playprogress).css("width", 100 * (audio.currentTime / audio.duration).toFixed(2) + "%");
      setime ? $(".time", $player).text(formatSecond(audio.currentTime) + "/" + formatSecond(audio.duration)) : $(".time", $player).text("-" + formatSecond(audio.duration - audio.currentTime) + "/" + formatSecond(audio.duration))
    }
  },
  FwmTipsTime = null,
  FwmTips = {show: function(a) {clearTimeout(FwmTipsTime); $("#FwmTips").text(a).addClass("show"); this.hide()},
  hide: function() {FwmTipsTime = setTimeout(function() {$("#FwmTips").removeClass("show"); 0 == musicfirsttip && (musicfirsttip = 1, "open" == welcome && FwmTips.show(tips))}, 4E3)}}
  random ? ($(".moshi", $player).html('<i class = "random fa fa-random" aria-hidden = 1></i> ' + pollsL10n.Shuffle)) : ($(".moshi", $player).html('<i class = "random fa fa-retweet" aria-hidden = 1></i> ' + pollsL10n.Order));
  $lrc.hasClass("hide") ? ($geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.close)) : (localStorage.player_tlrc == 1 ? $geci.html('<i class = "fa fa-check-square" aria-hidden = 1></i> ' + pollsL10n.trans) : $geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.open));
  audio.addEventListener("play", FwmMedia.play, 0);
  audio.addEventListener("pause", FwmMedia.pause, 0);
  audio.addEventListener("ended", FwmMedia.next, 0);
  audio.addEventListener("playing", FwmMedia.playing, 0);
  audio.addEventListener("volumechange", FwmMedia.volumechange, 0);
  audio.addEventListener("error", FwmMedia.error, 0);
  audio.addEventListener("seeking", FwmMedia.seeking, 0);
  audio.addEventListener("timeupdate", FwmMedia.timeupdate, 0);
  audio.addEventListener("seeked", FwmMedia.seeked, 0);
//主页键
  $(".switch-info", $player).click(function() {window.open("http://eric.cn.com/?p=1187", "newwindow")})
//隐藏/展开播放器键
  $play.click(function() {$player.toggleClass("show"); $player.hasClass("show") ? ($(this).attr("title", pollsL10n.hide)) : ($(this).attr("title", pollsL10n.show))})
//暂停键
  $(".pause", $player).click(function() {
    hasgeci = localStorage.player_autoplay = 0;
    $("li", $albumList).eq(albumId).find(".artist").html(pollsL10n.Pause + "> ").parent().siblings().find(".artist").html("").parent();
    FwmTips.show(pollsL10n.Stop + origin + "：" + FwmLists[albumId].song_list[songId].song_title + " - " + FwmLists[albumId].song_list[songId].singer);
    setTimeout(function() {FwmTips.show(pollsL10n.SNext)}, 4E3);
    $cover.removeClass("coverplay");
    $bar.removeClass("animate");
    $player.removeClass("showSongList");
    audio.pause()
  })
//播放键
  $(".play", $player).click(function() {
    hasgeci = localStorage.player_autoplay = 1;
    auto = "";
    $lrc.show();
    $("li", $albumList).eq(albumId).find(".artist").html(pollsL10n.play + "> ").parent().siblings().find(".artist").html("").parent();
    FwmTips.show(pollsL10n.from + origin + "：" + FwmLists[albumId].song_list[songId].song_title + " - " + FwmLists[albumId].song_list[songId].singer);
    setTimeout(function() {FwmTips.show(pollsL10n.ANext)}, 4E3);
    $cover.addClass("coverplay");
    $bar.addClass("animate");
    audio.play()
  })
//上一首键
  $(".prev", $player).click(function() {localStorage.player_autoplay = hasgeci = 1; auto = ""; $lrc.show(); FwmMedia.prev(); $(".loading").show()})
//下一首键
  $(".next", $player).click(function() {localStorage.player_autoplay = hasgeci = 1; auto = ""; $lrc.show(); FwmMedia.next(); $(".loading").show()})
//上一专辑键
  $(".aprev", $player).click(function() {localStorage.player_autoplay = hasgeci = 1; auto = ""; $lrc.show(); FwmMedia.aprev(); $player.removeClass("showSongList"); $(".loading").show()})
//下一专辑键
  $(".anext", $player).click(function() {localStorage.player_autoplay = hasgeci = 1; auto = ""; $lrc.show(); FwmMedia.anext(); $player.removeClass("showSongList"); $(".loading").show()})
//播放模式键
  $(".moshi", $player).click(function() {random ? (random = 0, FwmTips.show(pollsL10n.Order), $(this).html('<i class = "random fa fa-retweet" aria-hidden = 1></i> ' + pollsL10n.Order)) : (loop ?  (random = 1, audio.loop = loop = 0, FwmTips.show(pollsL10n.Shuffle), $(this).html('<i class = "random fa fa-random" aria-hidden = 1></i> ' + pollsL10n.Shuffle))
 : (random = 0, audio.loop = loop = 1, FwmTips.show(pollsL10n.Single), $(this).html('<i class = "random fa fa-refresh" aria-hidden = 1></i> ' + pollsL10n.Single)))})
//音量调节
  $volumeprogress.mousedown(function() {isDown = 1}).mouseup(function() {isDown = 0}).mousemove(function(a) {isDown && (a = ((100 - (a.pageY - $(this).offset().top - 6)) / 100).toFixed(2), a = a > 1 ? 1 : a < 0 ? 0 : a, $(".ts", $volumeprogress).css("top", 100 * (1 - a) + "px"), $(".progressbg1", $volumeprogress).height(100 * a), mute && (mute = 0, $(".volume", $player).removeClass("fa-volume-off").addClass("fa-volume-up")), audio.volume = localStorage.player_volume = a)}).click(function(a) {
    a = ((100 - (a.pageY - $(this).offset().top - 6)) / 100).toFixed(2);
    a = a > 1 ? 1 : a < 0 ? 0 : a; 
    $(".ts", $volumeprogress).css("top", 100 * (1 - a) + "px");
    $(".progressbg1", $volumeprogress).height(100 * a);
    mute && (mute = 0, $(".volume", $player).removeClass("fa-volume-off").addClass("fa-volume-up"));
    audio.volume = localStorage.player_volume = a
  })
//歌曲进度
  $playprogress.mousedown(function() {isDown = 1}).mouseup(function() {isDown = 0}).mousemove(function(a) {isDown && (a = ((a.pageX - $(this).offset().left) / $(this).width()).toFixed(2), $(".progressbg1", $playprogress).width(a), audio.currentTime = audio.duration * a)}).click(function(a) {
    a = ((a.pageX - $(this).offset().left) / $(this).width()).toFixed(2);
    $(".progressbg1", $playprogress).width(a);
    audio.currentTime = audio.duration * a
  })
//静音键
  $(".volume", $player).click(function() {mute ? (audio.volume = localStorage.player_volume, mute = 0, $(this).removeClass("fa-volume-off").addClass("fa-volume-up")) : (audio.volume = 0,  mute = 1, $(this).removeClass("fa-volume-up").addClass("fa-volume-off"))})
//时间模式键
  $(".timestyle", $player).click(function() {setime = setime ? 0 : 1})
//播放列表键
  $(".switch-playlist").click(function() {$player.toggleClass("showAlbumList")})
  $songList.mCustomScrollbar();
//歌单列表键
  $(".song-list .musicheader, .song-list .fa-angle-right", $player).click(function() {$player.removeClass("showSongList")})
//歌词模式键
  $geci.click(function(){
    localStorage.player_tlrc == 1 ? (!$lrc.hasClass("hide") && (localStorage.player_tlrc = ycgeci = 0, $lrc.addClass("hide"), hasLrc && $(this).html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.close), FwmTips.show(pollsL10n.close))) : ($lrc.hasClass("hide") ? (localStorage.player_tlrc = 0, $lrc.removeClass("hide"), ycgeci = 1, setTimeout(function() {FwmLrc.lrc.format(cont)}, 500), hasLrc && $(this).html('<i class = "fa fa-check-circle" aria-hidden = 1></i> ' + pollsL10n.open), FwmTips.show(pollsL10n.open)) : (localStorage.player_tlrc = ycgeci = 1, $lrc.removeClass("hide"), setTimeout(function() {FwmLrc.lrc.format(contt)}, 500), hasLrc && $(this).html('<i class = "fa fa-check-square" aria-hidden = 1></i> ' + pollsL10n.trans), FwmTips.show(pollsL10n.trans)))
  })
  function switchtype(type) {
    switch(type) {
      case "tencent": $qq.addClass(des).attr("title", pollsL10n.change + pollsL10n.qqm); break;
      case "baidu": $bd.addClass(des).attr("title", pollsL10n.change + pollsL10n.bdm); break;
      case "xiami": $xm.addClass(des).attr("title", pollsL10n.change + pollsL10n.xmm); break;
      case "netease": $wy.addClass(des).attr("title", pollsL10n.change + pollsL10n.wym); break;
      case "kugou": $kg.addClass(des).attr("title", pollsL10n.change + pollsL10n.kgm); break
    }
  }
//切换QQ音乐键
  $qq.click(function() {
  qqid != "NO" && type != "tencent" && (switchtype(type), id = qqid, origin = pollsL10n.qqm, type = "tencent", $qq.removeClass(des).attr("title", pollsL10n.play + "：" + origin), switchmusic())
  qqid == "NO" && $qq.attr("title", pollsL10n.qq)
  })
//切换百度音乐键
  $bd.click(function() {
  bdid != "NO" && type != "baidu" && (switchtype(type), id = bdid, origin = pollsL10n.bdm, type = "baidu", $bd.removeClass(des).attr("title", pollsL10n.play + "：" + origin), switchmusic())
  bdid == "NO" && $bd.attr("title", pollsL10n.bd)
  })
//切换虾米音乐键
  $xm.click(function() {
  xmid != "NO" && type != "xiami" && (switchtype(type), id = xmid, origin = pollsL10n.xmm, type = "xiami", $xm.removeClass(des).attr("title", pollsL10n.play + "：" + origin), switchmusic())
  xmid == "NO" && $xm.attr("title", pollsL10n.xm)
  })
//切换网易云音乐键
  $wy.click(function() {
  wyid != "NO" && type != "netease" && (switchtype(type), id = wyid, origin = pollsL10n.wym, type = "netease", $wy.removeClass(des).attr("title", pollsL10n.play + "：" + origin), switchmusic())
  wyid == "NO" && $wy.attr("title", pollsL10n.wy)
  })
//切换酷狗音乐键
  $kg.click(function() {
  kgid != "NO" && type != "kugou" && (switchtype(type), id = kgid, origin = pollsL10n.kgm, type = "kugou", $kg.removeClass(des).attr("title", pollsL10n.play + "：" + origin), switchmusic())
  kgid == "NO" && $kg.attr("title", pollsL10n.kg)
  })
//切换来源
  function switchmusic() {
    $player.removeClass("showSongList");
    $(".loading").show();
    data = {action: 'Fwm_api', do: 'song', type: type, id: id, sj: suiji, from: pollsL10n.from + origin}
    $.ajax({url: ajax_url, type: "GET", dataType: "script", data: data, success: function() {FwmTips.show(FwmLists[albumId].song_album + " - " + pollsL10n.success); FwmPlayer.playList.creat.album(); $(".play", $player).click()}, error: function(a, c, b) {FwmTips.show(pollsL10n.Playlist + pollsL10n.Failed)}})
    musictooltip()
  }
  typeid = new Array("netease", "tencent", "xiami", "baidu", "kugou");
//是否随机来源
  rs == "YES" && typeid.sort(function() {return Math.random() > 0.5 ? -1 : 1});
  for (var i=0; i<5; i++) {
    type = typeid[i];
    switch(type) {
      case "tencent": origin = pollsL10n.qqm; id = qqid; break;
      case "baidu": origin = pollsL10n.bdm; id = bdid; break;
      case "xiami": origin = pollsL10n.xmm; id = xmid; break;
      case "netease": origin = pollsL10n.wym; id = wyid; break;
      case "kugou": origin = pollsL10n.kgm; id = kgid; break
    }
  if (id != "NO") {$(".switch-" + type, $player).removeClass(des).attr("title", pollsL10n.play + "：" + origin); break}
  }
  data = {action: 'Fwm_api', do: 'song', type: type, id: id, sj: suiji, from: pollsL10n.from + origin}
  $.ajax({url: ajax_url, type: "GET", dataType: "script", data: data, success: function() {FwmPlayer.playList.creat.album()}, error: function(a, c, b) {FwmTips.show(pollsL10n.Playlist + pollsL10n.Failed)}})
//建立歌曲列表
  FwmPlayer.playList = {
    creat: {
      album: function() {
        var a = albumTotal = FwmLists.length, c = "";
        $(".musicheader", $albumList).text(LimitStr(name + "(" + a + pollsL10n.List + origin + ")", 20));
        for (var b = 0; b < a; b++) c += '<li title = "' + FwmLists[b].song_album + " - " + FwmLists[b].song_album1 + '"><i class = "fa fa-angle-right" aria-hidden = 1></i><span class = "index">' + (b + 1) + '</span><span class = "artist"></span>' + LimitStr(FwmLists[b].song_album + " - " + FwmLists[b].song_album1, 20) + "</li>";
        $(".list", $albumList).html("<ul>" + c + "</ul>").mCustomScrollbar();
//歌曲列表键
        $("li", $albumList).click(function() {
          var a = $(this).index();
          $(this).hasClass(cur) ? (FwmPlayer.playList.creat.song(a, 1), $("li", $(".song-list", $player)).eq(songId).find(".artist").html(pollsL10n.play + "> ").parent().siblings().find(".artist").html("").parent()) : FwmPlayer.playList.creat.song(a, 0);
          $player.addClass("showSongList")
        })
        songTotal = FwmLists[albumId].song_list.length;
        random ? FwmMedia.getInfos(window.parseInt(Math.random() * songTotal), albumId) : FwmMedia.getInfos(FwmMedia.getSongId(songId), albumId);
      },
      song: function(a, c) {
        songTotal = FwmLists[a].song_list.length;
        var b = "";
        $(".song-list .musicheader span", $player).text(LimitStr(FwmLists[a].song_album + "(" + songTotal + pollsL10n.Songs + origin + ")", 20)).attr("title", FwmLists[a].song_album + "(" + songTotal + pollsL10n.Songs + origin + ")");
        for (var d = 0; d < songTotal; d++) b += '<li title = "' + FwmLists[a].song_list[d].song_title + " - " + FwmLists[a].song_list[d].singer + '"><span class = "index">' + (d + 1) + '</span><span class = "artist"></span>' + LimitStr(FwmLists[a].song_list[d].song_title + " - " + FwmLists[a].song_list[d].singer, 20) + "</li>";
        $("ul", $songList).html(b);
        $songList.attr("data-album", a).mCustomScrollbar("update");
        c ? ($("li", $songList).eq(songId).addClass(cur).siblings().removeClass(cur), $songList.mCustomScrollbar("scrollTo", $("li.current", $songList).position().top - 120)) : $songList.mCustomScrollbar("scrollTo", "top");
        $("li", $songList).click(function() {
          hasgeci = 1;
          auto = "";
          $(".loading").show();
          albumId = a;
          $(this).hasClass(cur) ? ($(".loading").hide(), FwmTips.show(pollsL10n.from + origin + "：" + FwmLists[a].song_list[d].song_title + " - " + FwmLists[a].song_list[d].singer)) : (localStorage.player_autoplay = 1, $(this).addClass(cur).siblings().removeClass(cur), songId = $(this).index(), FwmMedia.getInfos(songId, albumId))
        })
      }
    }
  }
  var lrcTimeLine = [],
  lrcTime = null,
  lrcHeight = $lrc.height(),
//建立歌词
  FwmLrc = {
    load: function() {
      hasgeci || $lrc.addClass("hide");
      FwmLrc.lrc.hide();
      hasLrc = 0;
      $lrc.html("");
      hasgeci ? (localStorage.player_tlrc == 1 ? $geci.html('<i class = "fa fa-check-square" aria-hidden = 1></i> ' + pollsL10n.trans) : $geci.html('<i class = "fa fa-check-circle" aria-hidden = 1></i> ' + pollsL10n.open)) : $geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.close);
      $.ajax({
        url: ajax_url,
        type: "GET",
        dataType: "script",
        data: {action: 'Fwm_api', do: 'lyric', id: id, type: type},
        success: function() {
          if (contt.length < 100 && cont.length > 100) contt = cont;
          setTimeout(function() {localStorage.player_tlrc == 1 ? FwmLrc.lrc.format(contt) : FwmLrc.lrc.format(cont)}, 500)
        },
        error: function() {$geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.Nol)}
      })
    },
    lrc: {
      format: function(a) {
        function c(a) {
          var b = a.split(":"), c = 0;
          b[0].match("^[0-9][0-9]$") ? (a = +b[0], c = +b[1].split(".")[0], b = +b[1].split(".")[1]) : d -= 1;
          return 60 * a + c + Math.round(b / 1E3)
        }
        hasLrc = 1;
        a = a.replace(/\[[A-Za-z]+:(.*?)]/g, "").split(/[\]\[]/g);
        var b = "";
        lrcTimeLine = [];
        for (var d = 1; d < a.length; d += 2) {
          var e = c(a[d]);
          lrcTimeLine.push(e);
          b = 1 == d ? b + ('<li class = "FwmLrc' + e + ' current">' + a[d + 1].replace("\n", "") + "</li>") : b + ('<li class = "FwmLrc' + e + '">' + a[d + 1].replace("\n", "") + "</li>")
        }
        $lrc.html("<ul>" + b + "</ul>");
        setTimeout(function() {$lrc.addClass("show")}, 500);
        lrcTime = setInterval(FwmLrc.lrc.play, 500)
      },
      play: function() {
        var a = Math.round(audio.currentTime);
        0 < $.inArray(a, lrcTimeLine) && (a = $(".FwmLrc" + a), a.hasClass(cur) || (a.addClass(cur).siblings().removeClass(cur), $lrc.animate({scrollTop: lrcHeight * a.index()})))
      },
      hide: function() {clearInterval(lrcTime); $lrc.removeClass("show")}
    }
  }
}
function LimitStr(a, c, b) {
//限制显示字符数
  c = c || 5;
  b = b || "...";
  for (var d = "", e = a.length, f = 0, g = 0; f < 2 * c && g < e; g++)
  f += 128 < a.charCodeAt(g) ? 2 : 1,
  d += a.charAt(g);
  g < e && (d += b);
  return d
}
function loadblur(a) {
  var c = "",
  b = $(".blur"),
  d = new Image;
  d.onload = function() {a == c && (d = b.clone(), b.parent().append(d.css({display: "none", top: -b.height() - 3 + "px"}).attr("src", a)), d.fadeIn(1E3, function() {d.css("top", "0px"); b.remove(); b = d}))}
  c = d.src = a
}
function allmusic() {
  $("li", $albumList).eq(albumId).addClass(cur).find(".artist").html(pollsL10n.play + "> ").parent().siblings().removeClass(cur).find(".artist").html("").parent();
  $("li", $(".song-list", $player)).eq(songId).find(".artist").html(pollsL10n.play + "> ").parent().siblings().find(".artist").html("").parent();
  $(".list", $albumList).mCustomScrollbar("scrollTo", $("li.current", $(".list", $albumList)).position().top - 120);
  "" == !$("ul", $songList).html() && $("[data-album = " + albumId + "]").length && ($("[data-album = " + albumId + "]").find("li").eq(songId).addClass(cur).siblings().removeClass(cur), $songList.mCustomScrollbar("scrollTo", $("li.current", $songList).position().top - 120))
}
//自动变色
function playercolor() {
  musictooltip();
  cssdata = {background: "rgba(" + ccont + ", .8)", color: "rgb(" + ccont1 + ")"}
  $player.css(cssdata);
  $lrc.css(cssdata);
  $("#FwmTips").css(cssdata);
  $play.css(cssdata);
  $(".switch-sourse", $player).css(cssdata)
}
function formatSecond(a) {return ("00" + Math.floor(a / 60)).substr( - 2) + ":" + ("00" + Math.floor(a % 60)).substr( - 2)}
function GetCurrentFrame() {
  if (1 == audio.buffered.length) return 0;
  for (var b = parseInt($(".ts", $playprogress).css("left")) / $playprogress.width() * audio.duration, c = 0; c < audio.buffered.length; c++) if (b >= audio.buffered.start(c) && b <= audio.buffered.end(c)) return c;
  return 0
}
//提示框
function musictooltip() {
  $('#FwmPlayer .player span, #FwmPlayer .player i, #FwmPlayer .player div, #FwmPlayer.showAlbumList .playlist li').each(function() {
    $('#tooltip').remove();
    if (this.title) {
      var a = this.title;
      $(this).mouseover(function(b) {
      this.title = '';
      $('body').append('<div id = "tooltip">' + a + '</div>');
      $('#tooltip').css({left: b.pageX - 0xf + 'px', top: b.pageY + 0x1e + 'px', opacity: '0.9'}).fadeIn(0xfa)}).mouseout(function() {this.title = a; $('#tooltip').remove()}).mousemove(function(b) {$('#tooltip').css({left: b.pageX - 0xf + 'px',top: b.pageY + 0x1e + 'px'})})
    }
  })
}
//播放/暂停键
$(window.document).ready(function() {$(window).keydown(function(a) {192 == a.keyCode && (auto = "", audio.paused ? $(".play", $player).click() : $(".pause", $player).click())})})
//显示源选择器
$player.mouseover(function(){source == "YES" && $(".switch-sourse", $player).addClass("open")}).mouseout(function(){$(".switch-sourse", $player).removeClass("open")})
$(window).scroll(function() {$(this).scrollTop() + $(this).height() == $(window.document).height() ? hasgeci && ycgeci && ($lrc.addClass("hide"), $geci.html('<i class = "fa fa-times-circle" aria-hidden = 1></i> ' + pollsL10n.close), hasLrc && FwmTips.show(pollsL10n.close)) : $lrc.hasClass("hide") && hasgeci && ycgeci && ($lrc.removeClass("hide"), localStorage.player_tlrc == 1 ? (hasLrc && $geci.html('<i class = "fa fa-check-square" aria-hidden = 1></i> ' + pollsL10n.trans), FwmTips.show(pollsL10n.trans)) : (hasLrc && $geci.html('<i class = "fa fa-check-circle" aria-hidden = 1></i> ' + pollsL10n.open), FwmTips.show(pollsL10n.open)))})