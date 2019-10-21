// Connecting to ROS
// -----------------

import { data } from './data.js';

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
const mapSize = 30;
const map = [];
for (let r = 0; r < mapSize; r++) {
    const row = [];
    for (let c = 0; c < mapSize; c++) {
        row.push(0);
    }
    map.push(row);
}

const canvas = document.getElementById('canvas');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext('2d');
window.ctx = ctx;

function drawMap(ctx, map) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const l = 800 / mapSize;
    ctx.fillStyle = 'green';

    for (let r = 0; r < mapSize; r++) {
        for (let c = 0; c < mapSize; c++) {
            const value = map[r][c];
            ctx.fillRect(c * l + 1, r * l + 1, l -2, l - 2);
        }
    }
}

function drawRobot(ctx, pos) {
    const p = { x: 400, y: 400 };

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - 10);
    ctx.lineTo(p.x - 7, p.y + 10);
    ctx.lineTo(p.x + 7, p.y + 10);
    ctx.fill();
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
        const p = { x: 400, y: 400 };
        const phi = i * message.angle_increment;

        p.x = p.x + Math.cos(phi) * r * 50;
        p.y = p.y + Math.sin(phi) * r * 50;

        return p;
    });
    points.push({ x: 400, y: 400 });

    drawPoints(ctx, points);
    drawRobot(ctx, position);
}, null, () => {
    console.log(window.data);
});