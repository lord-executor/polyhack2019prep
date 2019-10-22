// Connecting to ROS
// -----------------

import { data } from './data.js';
import {
    Vector,
    Pose,
    Map,
} from './geometry.js';
import {
    MapRenderer,
    PointCloud,
    Robot,
} from './drawing.js';

const config = window.config;
let lidarData = null;

if (config.lidar.source === "simulated") {
    lidarData = rxjs.interval(500).pipe(
        rxjs.operators.map(i => data[i % data.length])
    );
} else {
    var ros = new ROSLIB.Ros({
        url : 'ws://elcaduck.local:9001'
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

    var topic = new ROSLIB.Topic({
        ros : ros,
        name : '/scan',
        messageType : 'sensor_msgs/LaserScan'
    });

    lidarData = rxjs.Observable.create(function(observer) {
        topic.subscribe(data => {
            observer.next(data);
        });
    });
}

const map = new Map(config.map.width, config.map.height, 0.5);
const mapRenderer = new MapRenderer(map, config.map.tileSize, config.map.transform);
const cloud = new PointCloud('red', config.canvas.transform);
const robot = new Robot(config.duckiebot.pose, config.canvas.transform);

const canvas = document.getElementById('canvas');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext('2d');
window.ctx = ctx;

// function drawMap(ctx, map) {
//     const l = 800 / mapSize;
//     const hue = 120;
//     ctx.fillStyle = 'hsl(' + hue + ', 100%, 75%)';

//     map.each((v, x, y) => {
//         ctx.fillRect(x * l + 1, y * l + 1, l -2, l - 2);
//     });
// }

lidarData.pipe(rxjs.operators.take(100)).subscribe((message) => {
    console.log('Received message on ' + message.header.seq, message);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    mapRenderer.render(ctx);

    const points = message.ranges.map((r, i) => {
        const phi = i * message.angle_increment;
        return Vector.fromAngle(phi, r).add(config.duckiebot.pose.position);
    });

    cloud.render(ctx, points);
    robot.render(ctx);
}, null, () => {
    console.log(window.data);
});

window.v = Vector.fromAngle(0.2, 1);
