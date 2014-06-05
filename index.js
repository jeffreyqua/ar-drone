// Init Air Drone API
var arDrone = require('ar-drone');
// Init Air Drone Client
var client = arDrone.createClient();
// Init Air Drone Controls
var control = arDrone.createUdpControl();
// Init http (For PNG stream)
var http    = require('http');
// Init Keypress
var keypress = require('keypress');

/****************************************************** 

Drone Camera Streaming API

*******************************************************/
console.log('Connecting png stream ...');

var pngStream = client.getPngStream();

var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }
  // Send PNG steam to server at port 8080
  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

// Listen for PNG image steam
server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});


/****************************************************** 

Drone Flight API

*******************************************************/

// Minimum drone altitude in millimeters.
// Should be left to default value (50), for control stabilities issues
client.config('control:altitude_min', 50);

// Maximum drone altitude in millimeters.
// On AR.Drone 1.0 : Give an integer value between 500 and 5000 to prevent the drone from ﬂying above this limit,
// or set it to 10000 to let the drone ﬂy as high as desired. On AR.Drone 2.0 : Any value will be set as a maximum
// altitude, as the pressure sensor allow altitude measurement at any height. Typical value for "unlimited" altitude
// will be 100000 (100 meters from the ground)
client.config('control:altitude_max', 250);
// console.log(client.config('control:altitude_max'));

// // Maximum vertical speed of the AR.Drone, in milimeters per second.
// // Recommanded values goes from 200 to 2000. Others values may cause instability.
// // This value will be saved to indoor/outdoor_control_vz_max, according to the CONFIG:outdoor setting.
// client.config('control:control_vz_max', 50);
// // console.log('VZ_max:' + client.config({key:'CONTROL:control_vz_max'}) );

// // The drone can either send a reduced set of navigation data to its clients 
// client.config('general:navdata_demo', 'TRUE');
// client.on('navdata', console.log);

// // Maximum yaw speed of the AR.Drone, in radians per second.
// // Recommanded values goes from 40/s to 350/s (approx 0.7rad/s to 6.11rad/s). Others values may cause instability.
// // This value will be saved to indoor/outdoor_control_yaw, according to the CONFIG:outdoor setting 
// client.config('control:control_yaw', 1.0);

// // This settings tells the control loop that the AR.Drone is flying outside. Setting the indoor/outdoor flight will load the corresponding indoor/outdoor_control_yaw, indoor/outdoor_eu- ler_angle_max and indoor/outdoor_control_vz_max.
// // Note : This settings enables the wind estimator of the AR.Drone 2.0 , and thus should always be enabled when flying outside. Note : This settings corresponds to the Outdoor flight setting of AR.FreeFlight
client.config('control:outdoor', false);

// // Maximum bending angle for the drone in radians, for both pitch and roll angles.
// // The progressive command function and its associated AT command refer to a percentage of this. Note : For
// // AR.Drone 2.0 , the new progressive command function is preferred (with the corresponding AT command).
// // This parameter is a positive floating-point value between 0 and 0.52 (ie. 30 deg). Higher values might be available
// // on a specific drone but are not reliable and might not allow the drone to stay at the same altitude.
// // This value will be saved to indoor/outdoor_euler_angle_max, according to the CONFIG:outdoor setting.
// client.config('control:euler_angle_max', 0.25);

client.takeoff();

client
.after(5000, function() {
  this.stop();
})
.after(1005000, function() {
  this.stop();
  this.land();
});


// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  //console.log('got "keypress"', key);
  if (key.name == 'k') {
  	console.log('kill drone!');
  	client.stop();
  	client.land();
  }
  if (key.name == 'l') {
  	console.log('land drone');
  }
  if (key.name == 'r') {
  	console.log('rotate drone');
  	client.clockwise(0.1);
  }
  if (key.name == 'h') {
  	console.log('stop and hover drone');
  }
  if (key.name == 'm') {
  	process.stdin.pause();
  	process.kill();
  }
});

process.stdin.setRawMode(true);
// process.stdin.resume();


// client
// .after(5000, function() {
// 	this.stop();
// })
// .after(5000, function() {
//   this.stop();
//   this.left(0.5);
// })
// .after(10000, function() {
//   this.stop();
//   this.right(0.5);
// })
// .after(5000, function() {
//   this.stop();
//   this.left(0.5);
// })
// .after(5000, function() {
//   this.stop();
//   this.land();
// });

/****************************************************** 

Drone Flight API Low Level Control (Not using)

*******************************************************/
// New (Not using)
//   var arDrone = require('ar-drone');
// var control = arDrone.createUdpControl();
// var start   = Date.now();

// var ref  = {};
// var pcmd = {
// 	up: 0.5
//   };

// console.log('Recovering from emergency mode if there was one ...');
// ref.emergency = false;

// // When it takes off
// setTimeout(function() {
//   console.log('Takeoff ...');
//   ref.emergency = false;
//   ref.fly       = true;

// }, 1000);


// // setTimeout(function() {
// //   console.log('Turning clockwise ...');

// //   pcmd.clockwise = 0;
// // }, 6000);

// // Determines when it lands
// setTimeout(function() {
//   console.log('Lowering ...');
//   //ref.fly = false;
//   pcmd = {
//   	down: 0.8
//   };
// }, 13000);


// // Determines when it lands
// setTimeout(function() {
//   console.log('Landing ...');
//   ref.fly = false;
//   pcmd = {};
// }, 20000);


// setInterval(function() {
//   control.ref(ref);
//   control.pcmd(pcmd);
//   control.flush();
  
// }, 30);
