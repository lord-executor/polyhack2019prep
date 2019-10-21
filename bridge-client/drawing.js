import { Vector } from "./geometry.js";

const identityTransform = x => x;

export class MapRenderer {

}

export class PointCloud {
    constructor(color, transform = identityTransform) {
        this.color = color;
        this.transform = transform;
        this.origin = new Vector(0, 0);
    }

    render(ctx, points) {
        ctx.fillStyle = this.color;
        let count = 0;
        for (let point of points) {
            const p = this.transform(point);
            // if (count % 10 === 0) {
            //     this.drawRadial(ctx, p);
            // }
            ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
            count++;
        }
    }

    drawRadial(ctx, dest) {
        const o = this.transform(this.origin);
        ctx.strokeStyle = 'hsl(180, 100%, 85%)';
        ctx.moveTo(o.x, o.y);
        ctx.lineTo(dest.x, dest.y);
        ctx.stroke();
    }
}

export class Robot {
    constructor(position, transform = identityTransform) {
        this.position = position;
        this.transform = transform;
    }

    update(position) {
        this.position = position;
    }

    render(ctx) {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'blue';

        const p = this.transform(this.position);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 10);
        ctx.lineTo(p.x - 7, p.y + 10);
        ctx.lineTo(p.x + 7, p.y + 10);
        ctx.fill();
    }
}