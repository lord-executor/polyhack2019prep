// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros({
    url : 'ws://elcaduck2.local:9001'
});

ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});

// Subscribing to a Topic
// ----------------------

var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/scan',
    messageType : 'sensor_msgs/LaserScan'
});

var max = 2;
var current = 0;
window.data = [];
listener.subscribe(function(message) {
    current++;
    window.data.push(message);
    //console.log(message);
    console.log('Received message on ' + listener.name);
    if (current >= max) {
        listener.unsubscribe();
        console.log(data);
    }
});
