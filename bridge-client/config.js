import { Vector, Pose } from "./geometry.js"

const canvasCenter = new Vector(2, 2);

window.config = {
    duckiebot: {
        hostname: "elcaduck.local",
        pose: new Pose(
            new Vector(0, 0),
            2 // radians - 0 points to positive X
        ),
    },
    canvas: {
        transform: (point) => {
            return point.invertY().add(canvasCenter).scale(200);
        },
    },
    lidar: {
        source: "simulated",
    },
    map: {
        width: 20,
        height: 20,
        tileSize: 40,
        transform: (point) => point.scale(window.config.map.tileSize),
    },
};
