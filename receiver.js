const obe = {
  events: {
    live: {
      chromecast_started: 'Stream Chromecast Started',
      chromecast_stopped: 'Stream Chromecast Stopped',
      paused: 'Stream Paused',
      played: 'Stream Played by User',
      progress: 'Stream Continued Watching',
      started: 'Stream Started',
      started_automatically: 'Stream Started Automatically',
    },
    vod: {
      chromecast_started: 'Video Chromecast Started',
      chromecast_stopped: 'Video Chromecast Stopped',
      ended: 'Video Completed',
      paused: 'Video Paused by User',
      played: 'Video Played by User',
      progress: 'Video in Progress',
      seeked: 'Video Seek by User',
      started: 'Video Started',
      started_automatically: 'Video Started Automatically',
      viewed: 'Viewed VOD',
    }
  }
}

var player = new Feed.Player('demo', 'demo', {"debug":true});
player.on('all', function(event) {
  console.log('player triggered event \'' + event + '\' with arguments:', Array.prototype.splice.call(arguments, 1));
});
player.setVolume(5);

const TRACK_MEDIA_PROGRESS_INTERVAL = 45

const context = cast.framework.CastReceiverContext.getInstance();

const playerManager = context.getPlayerManager()

let lastCurrentMediaTime = 0
let config = { events: {} }

const FEEDFM = 'urn:x-cast:fm.feed.cast';
context.addCustomMessageListener(FEEDFM, function(customEvent) {
  console.log(customEvent);
  console.log("dkj0");
  // handle customEvent.
});

playerManager.addEventListener(window.cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, (event) => {
  //play feed fm 
  player.play();

  const { media: { duration, metadata, customData } } = event
  const { title: videoTitle } = metadata
  const { userId, videoId, isLiveStream } = customData


  console.log("hijijsi");

  const media = {
    live: {
      events: obe.events.live,
      tracking: { isCasting: true },
    },
    vod: {
      events: obe.events.vod,
      tracking: { isCasting: true, id: videoId, duration, videoTitle },
    },
  }

  config = isLiveStream
    ? media.live
    : media.vod

  window.analytics.identify(userId)
})

playerManager.addEventListener(window.cast.framework.events.EventType.TIME_UPDATE, (event) => {
  if (event.currentMediaTime - lastCurrentMediaTime > TRACK_MEDIA_PROGRESS_INTERVAL) {
    window.analytics.track(config.events.progress, { ...config.tracking })
    lastCurrentMediaTime = event.currentMediaTime
  }
})

playerManager.addEventListener(window.cast.framework.events.EventType.MEDIA_FINISHED, () => {
  if (config.events.ended) {
    window.analytics.track(config.events.ended, { ...config.tracking })
  }
  
})



context.start()