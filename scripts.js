

let ctx,
    img,
    mask,
    w,
    h,
    n,
    drops = [],
    url;

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.r = 3;
}

function setup() {
    let canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");

    img = new Image();

    img.onload = function () {
        document.body.appendChild(canvas);
        n = 7000;
        w = 500;
        h = parseInt((500 * img.naturalHeight) / img.naturalWidth);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        for (let j = 0; j < n; j++) {
            drops[j] = new Point(parseInt(w * Math.random()), 0);
        }

        img = ctx.getImageData(0, 0, w, h);
        mask = ctx.createImageData(w, h);

        // Roberts Cross
        let gx, gy;

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                gx = img.data[4 * (i * w + j)] - img.data[4 * ((i + 1) * w + (j + 1))];
                gy = img.data[4 * (i * w + (j + 1))] - img.data[4 * ((i + 1) * w + j)];
                mask.data[4 * (i * w + j)] = 10 * (gx ** 2 + gy ** 2) ** 0.5;
            }
        }

        requestAnimationFrame(draw);
    };

    img.src = './images/darkForest3.jpg';

}

let ii, jj, r;

function drawDrop(d) {
    for (ii = -d.r - 1; ii <= d.r + 1; ii++) {
        for (jj = -d.r - 1; jj <= d.r + 1; jj++) {
            r = ii * ii + jj * jj;
            if (
                img.data[4 * ((d.y + ii) * w + d.x + jj) + 1] != 0 &&
                img.data[4 * ((d.y + ii) * w + d.x + jj) + 1] != 0 &&
                d.r <= r
            ) {
                img.data[4 * ((d.y + ii) * w + d.x + jj) + 1] -= 50 / r;
                img.data[4 * ((d.y + ii) * w + d.x + jj) + 2] -= 100 / r;
            }
        }
    }
}

function draw() {
    let drop,
        pos,
        c = 0;

    for (let id = 0; id < n; id++) {
        if (drops[id].y < h) {
            c++;

            pos = 4 * (drops[id].y * w + drops[id].x);
            if (260 * Math.random() > img.data[pos]) {
                drawDrop(drops[id]);
                if (drops[id].r > 2) drops[id].r--;

                if (mask.data[pos] > 200 && drops[id].x < w) {
                    if (mask.data[pos + 4] >= mask.data[pos - 4]) {
                        if (drops[id].x < w) drops[id].x++;
                    } else {
                        if (drops[id].x > -1) drops[id].x--;
                    }
                }

                if (Math.random() > 0.2) drops[id].y += (5 - drops[id].r) / 2;
            } else {
                if (drops[id].r < 5) drops[id].r++;
            }
        }
    }

    ctx.putImageData(img, 0, 0);
    if (c != 0) requestAnimationFrame(draw);
}

window.onload = setup;