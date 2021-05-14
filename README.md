# chromecast-demo

# feed media group chromecast sender and receiver.

We have created a custom chromecast receiver that will play Feed.fm music in tandem with a full screen video and its associated audio. The receiver will respond to messages that control Feed.fm music playback, such as play, pause, and change station. There is a published public receiver that can be used by Feed.fm clients [37FFD8F7], unmodified, for simple integrations, or clients can access the source code for our receiver and create their own custom receiver with their own desired functionality.
 
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
 
