import "./style.css";

window.addEventListener("load", () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas1")!;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    originX: number;
    originY: number;
    ease: number;
    dx: number;
    dy: number;
    distance: number;
    force: number;
    angle: number;
    friction: number;
    active: boolean;
    timeout: number | undefined;

    constructor(
      private effect: Effect,
      x: number,
      y: number,
      private color: string
    ) {
      this.x = Math.random() * this.effect.width;
      this.y = 0;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.03;
      this.friction = 0.98;
      this.dx = 0;
      this.dy = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
      this.active = true;
      this.timeout = undefined;
    }

    draw(context: CanvasRenderingContext2D) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      if (!this.active) return;
      if (this.effect.mouse.x && this.effect.mouse.y) {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx ** 2 + this.dy ** 2;
        this.force = -this.effect.mouse.radius / this.distance;
      }

      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      this.x +=
        (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
      this.y +=
        (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.1;
      this.size = this.effect.gap;
    }
    blocks() {
      this.x = Math.random() * this.effect.width;
      this.y =
        Math.random() > 0.5
          ? Math.random() * this.effect.height
          : this.effect.height;
      this.ease = 0.04;
      this.size = 10;
    }
    assemble() {
      clearTimeout(this.timeout);
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.2;
      this.size = this.effect.gap;
      this.active = false;
      this.effect.counter++;
      this.timeout = setTimeout(() => {
        this.active = true;
      }, this.effect.counter * 0.5);
    }
    particlePrint() {
      clearTimeout(this.timeout);
      this.x = this.effect.width * 0.5;
      this.y = this.effect.height;
      this.ease = 0.2;
      this.size = this.effect.gap;
      this.active = false;
      this.effect.counter++;
      this.timeout = setTimeout(() => {
        this.active = true;
      }, this.effect.counter);
    }
  }

  class Effect {
    particlesArray: Particle[];
    image: HTMLImageElement;
    centerX: number;
    centerY: number;
    x: number;
    y: number;
    gap: number;
    mouse: Mouse;
    counter: number;

    constructor(public width: number, public height: number) {
      this.particlesArray = [];
      this.image = document.querySelector<HTMLImageElement>("#image1")!;
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 5;
      this.mouse = {
        radius: 3000,
        x: undefined,
        y: undefined,
      };
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
      });
      this.counter = 0;
    }

    init(context: CanvasRenderingContext2D) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red},${green},${blue})`;

          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }

    draw(context: CanvasRenderingContext2D) {
      this.particlesArray.forEach((particle) => {
        particle.draw(context);
      });
    }

    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }

    warp() {
      this.particlesArray.forEach((particle) => particle.warp());
    }

    blocks() {
      this.particlesArray.forEach((particle) => particle.blocks());
    }

    assemble() {
      this.counter = 0;
      this.particlesArray.forEach((particle) => particle.assemble());
    }

    particlePrint() {
      this.counter = 0;
      this.particlesArray.forEach((particle) => particle.particlePrint());
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);
  console.log(effect);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
  }
  animate();

  const warpButton = document.querySelector<HTMLButtonElement>(".warpButton")!;
  warpButton.addEventListener("click", () => {
    effect.warp();
  });

  const blocksButton =
    document.querySelector<HTMLButtonElement>(".blocksButton")!;
  blocksButton.addEventListener("click", () => {
    effect.blocks();
  });

  const assembleButton =
    document.querySelector<HTMLButtonElement>(".assembleButton")!;
  assembleButton.addEventListener("click", () => {
    effect.assemble();
  });

  const particlePrintButton = document.querySelector<HTMLButtonElement>(
    ".particlePrintButton"
  )!;
  particlePrintButton.addEventListener("click", () => {
    effect.particlePrint();
  });
});

type Mouse = {
  radius: number;
  x: number | undefined;
  y: number | undefined;
};
