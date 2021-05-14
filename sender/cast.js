var castSession;
var initializeCastApi = function() {
  let applicationId = '37FFD8F7';
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: applicationId,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
  cast.framework.CastContext.getInstance().addEventListener('sessionstatechanged', startPlay);
};
var startPlay = function() {
  castSession = cast.framework.CastContext.getInstance().getCurrentSession();

  var currentMediaURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  var token = 'demo';
  var secret = 'demo';
  var stationName = "Station Two";
  var contentType =  'video/mp4';

  var stationId;
  var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL, contentType);
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  castSession.loadMedia(request).then(
    function() { console.log('Load succeed'); },
    function(errorCode) { console.log('Error code: ' + errorCode); });
  castSession.addMessageListener('urn:x-cast:fm.feed.cast', (namespace, message) => {
    jMessage = JSON.parse(message);
    if (jMessage.stations){
      stationId = jMessage.stations[0].id;
    }
    console.log(jMessage);
  });

  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'initialize':{'token':token,'secret':secret}, 'volume':5});
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'stations':{"name":stationName}});
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'station':stationId});
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'play':true});

};


