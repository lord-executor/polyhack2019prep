// Connecting to ROS
// -----------------

import { data } from './data.js';
import {
    Vector,
    Map,
} from './geometry.js';
import {
    MapRenderer,
    PointCloud,
    Robot,
} from './drawing.js';

// var ros = new ROSLIB.Ros({
//     url : 'ws://elcaduck2.local:9001'
// });

// ros.on('connection', function() {
//     console.log('Connected to websocket server.');
// });

// ros.on('error', function(error) {
//     console.log('Error connecting to websocket server: ', error);
// });

// ros.on('close', function() {
//     console.log('Connection to websocket server closed.');
// });

// Subscribing to a Topic
// ----------------------

// var listener = new ROSLIB.Topic({
//     ros : ros,
//     name : '/scan',
//     messageType : 'sensor_msgs/LaserScan'
// });

// var listener = rxjs.from(data).pipe(
//     rxjs.operators.delay(2000)
//     //rxjs.operators.flatMap(x => rxjs.of(x).pipe(rxjs.operators.delay(2000)))
// );

const listener = rxjs.interval(2000).pipe(
    rxjs.operators.map(i => data[i])
);

const position = { x: 1.5, y: 1.5 }
const mapSize = 20;
const map = new Map(mapSize, mapSize, 0);
const robotOffset = new Vector(400, 400);
const cloud = new PointCloud('red', x => x.add(robotOffset));
const robot = new Robot(new Vector(0, 0), x => x.add(robotOffset));

const canvas = document.getElementById('canvas');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext('2d');
window.ctx = ctx;

function drawMap(ctx, map) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const l = 800 / mapSize;
    const hue = 120;
    ctx.fillStyle = 'hsl(' + hue + ', 100%, 75%)';

    map.each((v, x, y) => {
        ctx.fillRect(x * l + 1, y * l + 1, l -2, l - 2);
    });
}

function drawPoints(ctx, points) {
    ctx.fillStyle = 'red';
    for (let p of points) {
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
    }
}

listener.pipe(rxjs.operators.take(2)).subscribe((message) => {
    console.log('Received message on ' + message.header.seq, message);
    drawMap(ctx, map);

    const points = message.ranges.map((r, i) => {
        const phi = i * message.angle_increment;
        return Vector.fromAngle(phi, 50 * r);
    });

    cloud.render(ctx, points);
    robot.render(ctx);
}, null, () => {
    console.log(window.data);
});

window.v = Vector.fromAngle(0.2, 1);
