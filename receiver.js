const TRACK_MEDIA_PROGRESS_INTERVAL = 45

const context = cast.framework.CastReceiverContext.getInstance();

const playerManager = context.getPlayerManager()

var feedPlayer;

let lastCurrentMediaTime = 0
let config = { events: {} }

function play_started(x){
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
    if (data.volume)
    {
      feedPlayer.setVolume(data.volume);
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
      feedPlayer.setStationId(data.station);
    }
    if (data.stations)
    {
      let stationPromise = feedPlayer.getStations();
      if (data.stations.name)
      {
        Promise.resolve(stationPromise).then(stations => {
          let filteredStations = stations.filter(y=>y.name.includes(data.stations.name));
          // Chromecast has a limit on their message sizes, so best to limit or filter on the receiver end before
          // sending the message back
          context.sendCustomMessage(FEEDFM, event.senderId ,{"stations":filteredStations.splice(0,100)});
        }); 
      }
      else
      {
        Promise.resolve(stationPromise).then(stations => {
          context.sendCustomMessage(FEEDFM, event.senderId ,{"stations":stations.splice(0,100)});
        }); 
      }  

    }

  }


});




const options = new cast.framework.CastReceiverOptions();
context.start(options)
