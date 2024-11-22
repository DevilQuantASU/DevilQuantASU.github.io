document.addEventListener("DOMContentLoaded", () => {
    const bg = document.querySelector(".animated-background");
  
    // Create and Append Canvas for Math Animation
    const canvas = document.createElement("canvas");
    canvas.classList.add("math-canvas");
    bg.appendChild(canvas);
  
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Resize Canvas on Window Resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    // Navier-Stokes Inspired Fluid Animation (Simplified Particle Flow)
    const particles = [];
    const particleCount = 150;
  
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.size = Math.random() * 2 + 1;
        this.color = `rgba(230, 57, 70, ${Math.random() * 0.5 + 0.2})`;
      }
  
      update() {
        this.x += this.vx;
        this.y += this.vy;
  
        // Reflect particles off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
  
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  
    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };
  
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
  
      // Connect particles with lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(230, 57, 70, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
  
      requestAnimationFrame(animateParticles);
    };
  
    // Initialize and Start Animation
    initParticles();
    animateParticles();
  });