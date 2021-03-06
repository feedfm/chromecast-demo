const TRACK_MEDIA_PROGRESS_INTERVAL = 45;

const context = cast.framework.CastReceiverContext.getInstance();

const playerManager = context.getPlayerManager();

var feedPlayer;

let lastCurrentMediaTime = 0;
let config = { events: {} };
let feedInfoShow = "ALWAYS";

function hideInfo(x){
  document.getElementById("feed-info").style.opacity = 0
}
function toggleInfo(x){
  document.getElementById("feed-info").style.transition ="opacity 1s"
  document.getElementById("feed-info").style.opacity = 1
  setTimeout(hideInfo, 3000);
}
function play_started(x){
  if (feedInfoShow === "SOMETIMES")
  {
    toggleInfo();
  }
  let audio_file = x.audio_file;
  let artist = audio_file.artist.name;
  let release = audio_file.release.title;
  let title = audio_file.track.title;
  let feedInfo = document.getElementById("feed-info");    
  let feedTitle = document.getElementById("title"); 
  let feedArtist = document.getElementById("artist");
  let feedRelease = document.getElementById("release");
  feedTitle.innerHTML = title;
  feedArtist.innerHTML = artist;
  feedRelease.innerHTML = release;
}



const FEEDFM = 'urn:x-cast:fm.feed.cast';
context.addCustomMessageListener(FEEDFM, event => {
  if (event.data){
    let data = event.data;
    if (data.initialize)
    {
      var feedInitialize = data.initialize;
      feedPlayer = new Feed.Player(feedInitialize.token, feedInitialize.secret, feedInitialize.options || {});
      if (feedInitialize.clientId)
      {
        feedPlayer.session._setStoredCid(feedInitialize.clientId);
      }
      // feedPlayer.on('all', function(fEvent) {
      //   let sendText = 'player triggered event \'' + fEvent + '\' with arguments:';
      //   context.sendCustomMessage(FEEDFM, event.senderId ,sendText);
      // });
      
      feedPlayer.on('play-started', play_started, play_started);  
      feedPlayer.tune();
    }
    if (data.clear)
    {
      feedPlayer.session._deleteStoredCid();
    }
    if (data.style)
    {
      document.getElementById("feed-info").style = data.style;
    }
    if (data.infoshow)
    {
      feedInfoShow = data.infoshow;

      if (feedInfoShow === "NEVER")
      {
        document.getElementById("feed-info").style = "display: none;";
      }
      else
      {
      if (feedInfoShow === "SOMETIMES")
        {
          toggleInfo();
        }
        document.getElementById("feed-info").style.display = "block";
        document.getElementById("feed-info").style.opacity = 1;
        
      }
    }
    if (data.volume !== undefined)
    {
      feedPlayer.setVolume(data.volume);
    }
    if (data.videovolume !== undefined)
    {
       var volumeRequest = new cast.framework.messages.VolumeRequestData();
       volumeRequest.volume.level = data.videovolume; // 0 - 1
       playerManager.sendLocalMediaRequest(volumeRequest);
    }
    if (data.play)
    {
      feedPlayer.play();
    }
    if (data.pause)
    {
      feedPlayer.pause();
    }
    if (data.stop)
    {
      feedPlayer.stop();
    }
    if (data.skip)
    {
      feedPlayer.skip();
    }
    if (data.station)
    {    
      if (data.timeskip)
      {
        feedPlayer.setStationId(data.station, data.timeskip);
      }
      else
      {
        feedPlayer.setStationId(data.station);
      }
      
    }
    if (data.stations)
    {
      let stationPromise = feedPlayer.getStations();
      if (data.stations.name)
      {
        stationPromise.then(stations => {
          let filteredStations = stations.filter(y=>y.name.includes(data.stations.name));
          // Chromecast has a limit on their message sizes, so best to limit or filter on the receiver end before
          // sending the message back
          context.sendCustomMessage(FEEDFM, event.senderId ,{"stations":filteredStations.splice(0,100)});
        }); 
      }
      else
      {
        stationPromise.then(stations => {
          context.sendCustomMessage(FEEDFM, event.senderId ,{"stations":stations.splice(0,100)});
        }); 
      }  

    }

  }


});




const options = new cast.framework.CastReceiverOptions();
context.start(options)
