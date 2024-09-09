let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const bubbles: Bubble[] = [];

class Bubble {
    public x: number;
    public y: number;
    public radius: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    public draw() {
        ctx.fillStyle = '#6366f140';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

export function setup(canvashtml: HTMLCanvasElement) {
    const context = canvashtml.getContext('2d');
    if (!context) {
        throw new Error('Could not get 2d context from canvas');
    }

    canvashtml.width = window.innerWidth;
    canvashtml.height = window.innerHeight;

    requestAnimationFrame(render);

    ctx = context;
    canvas = canvashtml;

    bubbles.splice(0, bubbles.length);
    for (let i = 6; i >= 0; i--) {
        addBubble();
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const bubble of bubbles) {
        bubble.draw();
    }

    requestAnimationFrame(render);
}

export function onScroll(amount: number) {
    for (const bubble of bubbles) {
        bubble.y -= (amount * bubble.radius) / 100;
    }
}

export function onScrollEnd() {
    addBubble(canvas.height);

    for (const bubble of bubbles) {
        if (bubble.y < -100) {
            bubbles.splice(bubbles.indexOf(bubble), 1);
        }
    }
}

export function addBubble(shift: number = 0) {
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height + shift;
        const radius = Math.random() * 20 + 5;

        bubbles.push(new Bubble(x, y, radius));
    }
}