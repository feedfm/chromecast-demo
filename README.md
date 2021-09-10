# chromecast-demo

# feed media group chromecast sender and receiver.


We have created a custom chromecast receiver that will play Feed.fm music in tandem with a full screen video and its associated audio. The receiver will respond to messages that control Feed.fm music playback, such as play, pause, and change station. There is a published public receiver that can be used by Feed.fm clients [37FFD8F7] (for an example sender application, https://demo.feed.fm/cast/demo/sender/index.html), unmodified, for simple integrations, or clients can access the source code for our receiver and create their own custom receiver with their own desired functionality.
 
We have created a live demo sender and receiver application. Clicking the cast button will allow you to cast a video to your device, and start playing an associated station with it. Skip, Pause, Play Stop and volume control for the feed audio stream are implemented.  We are working on a bug that when feed audio stops, the video audio stops. (for pause and stop, and momentarily during skip)

The Chromecast receiver app ID, which the sender uses is: 37FFD8F7, and can be used without development chromecast IDs (published).
Currently this demo implements a custom feed SDK
  
To get the receiever demo working on your system (for editing purposes, ** if you just want to mix music with your video and have it able to be cast to chromecast devices, it is sufficient to just use our reciever id [37FFD8F7], which will point to our latest working receiver, in your app.
  
  
clone this repo. 
```console
foo@bar:~$ git clone https://github.com/feedfm/chromecast_work.git
```
  
install any node modules needed for the later steps   
```console
foo@bar:~$ npm install -g http-server
foo@bar:~$ npm install -g ngrok
```
  
cd in to the repo. 
```console
foo@bar:~$ cd chromecast_work
```

start up http-server, and optionally, ngrok (if your http-server isnt 8080, you will need to change the 8080 part) to get it access to the web (or put this receiver somewhere with a public ip)

```console
foo@bar:~$ http-server
foo@bar:~$ ngrok http 8080
```
  
Go to   

https://cast.google.com/publish/?pli=1#/signup  

to add and register a custom reciever with the public IP you have as its address (free ngrok restarts every 2 hours)  

  
  
You will need to add a new device for testing/development purposes, then wait 15 minutes, and restart the device. (the devices can cache information, and restarting will ensure it has up to date information). 




Go to   

https://casttool.appspot.com/cactool/. 

and put in your cast reciever ID.  

click "set app id".  

Click the chromecast button at the top left, and connect to your development device.   

Go to the load media tab, and click load media by content url to kick off the message for the receiver to start casting new media.  
 

# just using our sample receiver 

to just use our sample receiver, first make sure your site is calling on the google cast framework
```<script type="text/javascript" src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>```  

when the framework is loaded, you will want to initialize some things.
```	
window['__onGCastApiAvailable'] = function(isAvailable) {
		if (isAvailable) {
			initializeCastApi();
		}
	}; 
 ```

the most important thing to initialize is the receiver app id: which is 37FFD8F7. that will tell googles cast framework which app to use, which points to where our receiver lives and uses our sdk.

``` 
var initializeCastApi = function() {
  let applicationId = '37FFD8F7';
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: applicationId,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  });
  cast.framework.CastContext.getInstance().addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED, startPlay);
};
```

in the init function we set an event handler for when the cast has successfully connected. here we call that startPlay

```
var startPlay = async function() {
  console.log("connected");
  castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  var currentMediaURL = 'https://demo.feed.fm/cast/TrimmedWorkout.mp4';

```

we also get send our client id. we can do that with 
```
var feedPlayer = new Feed.Player('demo','demo');
 ...
 ...
var clientId = await Feed.getClientId(); 
```

you can set up your token and secret for feed, as well as any options that you want to send in the options object. all of the communication with the feed api is done through messages. (these are our demo credentials, just like for the feed sdk. feel free to use for testing.)

```
  var token = 'demo';
  var secret = 'demo';
  var options = {'debug':true}
```
you will probably want to send the video you want to play to the cast device, since we will be casting. this is the standard cast way of doing it.

```
  var contentType =  'video/mp4';
  var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL, contentType);
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
```

heres how to send a message to the cast device (and how to initialize the actual player
```
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'initialize':{'token':token,'secret':secret, 'options':options, 'clientId':clientId}, 'volume':5});
```
heres how to set up a listener for when we receieve messages (like when we receiver our stations object, so we can change to the station we want) 
```
  castSession.addMessageListener('urn:x-cast:fm.feed.cast', (namespace, message) => {
    jMessage = JSON.parse(message);
    if (jMessage.stations){
      stationId = jMessage.stations[0].id;
      castSession.sendMessage('urn:x-cast:fm.feed.cast', {'station':stationId});
    }
```
heres how to ask for that object with the stations in it
```
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'stations':{"name":stationName}});
```
dont forget that you need to tell feed to play!
```
  castSession.sendMessage('urn:x-cast:fm.feed.cast', {'play':true});
```
you should see the video playing on the chrome cast device, and the song should be playing as well as some information about what song is playing in the bottom left corner. if you dont see that information, the receiver app may not be set correctly. if you see the information but it isnt filled correctly, or you dont hear music, its possible your clientId is overused or not set correctly. you can also try debugging in the sender console (f12 on your computer) or by typing chrome://inspect/#devices into the chrome address bar and debugging your remote device (the chromecast device aka the receiver)

the functions available to send messages are 
* initialize -- needs token, secret. optional are options and clientId (recommended) 
* clear -- clears stored client id
* volume -- set volume (0-1)
* videovolume -- set the video volume (0-1)
* play --play feed
* pause --pause feed
* stop --stop feed
* skip --skip feed
* station -- set the station ID (youll find that out from the stations object)
  * you can also supply timeskip along with the station object, if you are a first play station and you want to start at a specific time within the station, for example, starting 5 minutes in, so timeskip: 300, skips the first two, two-minute songs, and plays the third song at one minute in.
  * ```castSession.sendMessage('urn:x-cast:fm.feed.cast', {'station':stationId, 'timeskip':300});```
* stations -- get a list of stations, if you supply stations with an object inside specifying name, then if will filter based on that name before sending back, since chromecast has a limit on the size of the messages it can send back. if your stations object is really large, it will send back only 100 stations.
