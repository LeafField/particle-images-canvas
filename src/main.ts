import "./style.css";

window.addEventListener("load", () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas1")!;
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const image = document.querySelector<HTMLImageElement>("#image1")!;

  class Particle {
    x: number;
    y: number;
    size: number;
    constructor() {
      this.x = 0;
      this.y = 0;
      this.size = 30;
    }

    draw() {
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  class Effect {}

  const particle1 = new Particle();
  particle1.draw();

  function animate() {}
});
