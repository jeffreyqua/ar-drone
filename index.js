var arDrone = require('ar-drone');
var client = arDrone.createClient();
//client.createRepl();
var control = arDrone.createUdpControl();

var http    = require('http');


console.log('Connecting png stream ...');

// var pngStream = arDrone.createClient().getPngStream();
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

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});

var callback = function(err) { if (err) console.log(err+'hallo'); else console.log("no problemo");};
//var callback =  function() {console.log('----!!!!!--!!!!!callback');}
//client.config({ key: 'control:altitude_max', value: 600, timeout: 10 }, callback);

// Maximum Altitude 1m
// Minimum Altitude 20cm
// Max vertical speed: 200mm/s
// client.config({key: 'control:altitude_max', value: 600}, callback);
// client.config('control:altitude_min', 200);
// //console.log(client.config('control:altitude_max'));
//client.config('control:altitude_max', '1');
//client.config('control:control_vz_max', 100);
//console.log('VZ_max:' + client.config({key:'CONTROL:control_vz_max'}) );
//client.config('general:navdata_demo', 'TRUE');
//client.on('navdata', console.log);

// // Minimum Altitude 20cm
// client.config('control:control_yaw', 1.0);
// client.config('control:outdoor', false);
// client.config('control:euler_angle_max', 0.25);

//client.config({key: 'CONTROL:altitude_max', value: 500, timeout: 500}, callback);
// client.takeoff();

// client
// .after(10,function() {
// 	this.stop();
// 	this.up(500);
// })
// .after(10000, function() {
//     this.stop();
//     this.land();
//   });


// New


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
