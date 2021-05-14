# chromecast-demo

# feed media group chromecast proof of concept.

## this is meant as a proof of concept, currently it plays a given video, and a given mp3. ##

## future versions will play any video like a normal reciever, but will also require a feed key, and will use chrome recievers messaging to send commands to feeds javascript sdk. ##
  
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
 
