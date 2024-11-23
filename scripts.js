// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  /* Variables */
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const animationContainer = document.getElementById('animation-container');
  let width = window.innerWidth;
  let height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
  animationContainer.appendChild(canvas);

  /* Resize Canvas on Window Resize */
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  /* Graph Variables */
  const graphTL = createConnectedGraph(
    getRandomInt(3, 6), // Number of nodes between 3 and 6 inclusive
    0.3,                // Additional edge probability
    0,
    width / 3,
    0,
    height / 3
  );

  const graphBR = createConnectedGraph(
    getRandomInt(3, 6),
    0.3,
    (2 * width) / 3,
    width,
    (2 * height) / 3,
    height
  );

  /* Create Connected Graph Function */
  function createConnectedGraph(numNodes, edgeProbability, xMin, xMax, yMin, yMax) {
    const graph = { nodes: [], edges: [] };

    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
      const node = {
        x: Math.random() * (xMax - xMin) + xMin,
        y: Math.random() * (yMax - yMin) + yMin,
        vx: (Math.random() - 0.5) * 1.0, // Increased velocity
        vy: (Math.random() - 0.5) * 1.0
      };
      graph.nodes.push(node);
    }

    // Ensure the graph is connected
    const connected = new Set();
    connected.add(0);

    while (connected.size < numNodes) {
      const from = Array.from(connected)[Math.floor(Math.random() * connected.size)];
      const to = getRandomInt(0, numNodes - 1);
      if (!connected.has(to)) {
        graph.edges.push({ from, to });
        connected.add(to);
      }
    }

    // Add random additional edges
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        if (!edgeExists(graph.edges, i, j) && Math.random() < edgeProbability) {
          graph.edges.push({ from: i, to: j });
        }
      }
    }

    return graph;
  }

  /* Helper Function to Check if Edge Exists */
  function edgeExists(edges, from, to) {
    return edges.some(edge =>
      (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
    );
  }

  /* Update and Draw Graphs */
  function updateGraph(graph, xMin, xMax, yMin, yMax) {
    graph.nodes.forEach(node => {
      // Random movement with increased acceleration
      node.vx += (Math.random() - 0.5) * 0.1; // Increase acceleration
      node.vy += (Math.random() - 0.5) * 0.1;

      // Apply less damping for more movement
      node.vx *= 0.90; // Decrease damping
      node.vy *= 0.90;

      // Update positions
      node.x += node.vx;
      node.y += node.vy;

      // Keep nodes within bounds (wrap around)
      if (node.x < xMin) node.x = xMax;
      if (node.x > xMax) node.x = xMin;
      if (node.y < yMin) node.y = yMax;
      if (node.y > yMax) node.y = yMin;
    });
  }

  function drawGraph(graph) {
    // Draw edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = 6; // Bolder edges
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes[edge.from];
      const toNode = graph.nodes[edge.to];
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
    });

    // Draw nodes
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    graph.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, 2 * Math.PI); // Larger nodes (radius 24)
      ctx.fill();
    });
  }

  /* Sine Wave Variables */
  const sineWave = {
    amplitude: 50,
    frequency: 0.05,
    phase: 0,
    speed: 4,
    points: []
  };

  function updateWave() {
    sineWave.phase += sineWave.frequency;

    // Add new point at the end
    const x = (sineWave.points.length > 0) ? sineWave.points[sineWave.points.length - 1].x + sineWave.speed : 0;
    const y = sineWave.amplitude * Math.sin(x * 0.02 + sineWave.phase) + height / 2;

    sineWave.points.push({ x, y });

    // Remove old points to create tail effect
    if (sineWave.points.length > 300) { // Adjust length of tail
      sineWave.points.shift();
    }

    // Remove points that are off-screen
    sineWave.points = sineWave.points.filter(point => point.x <= width);
  }

  function drawWave() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    sineWave.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();
  }

  /* Animation Loop */
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw wave
  //  updateWave();
  //  drawWave();

    // Update and draw graphs
    updateGraph(graphTL, 0, width / 3, 0, height / 3);
    drawGraph(graphTL);

    updateGraph(graphBR, (2 * width) / 3, width, (2 * height) / 3, height);
    drawGraph(graphBR);

    requestAnimationFrame(animate);
  }

  animate();

  /* Helper Function to Get Random Integer Between min and max (inclusive) */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* Floating Text Animation */
  const title = document.querySelector('.title');
  const subtitle = document.querySelector('.subtitle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    title.style.transform = `translateY(${scrollY * 0.5}px)`;
    subtitle.style.transform = `translateY(${scrollY * 0.3}px)`;
  });

  /* Header and Footer Visibility on Scroll */
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scroll Down
      header.classList.add('hidden');
      footer.classList.add('hidden');
    } else {
      // Scroll Up
      header.classList.remove('hidden');
      footer.classList.remove('hidden');
    }
    lastScrollY = currentScrollY;
  });

  /* Parallax Effect for Background */
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / width) - 0.5;
    const y = (e.clientY / height) - 0.5;

    animationContainer.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  });

  /* Smooth Scroll for Links (if any) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* Accessibility: Keyboard Navigation */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  /* Accessibility: Remove focus outline when using mouse */
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

  /* Back to Top Button (optional) */
  const backToTopButton = document.createElement('button');
  backToTopButton.innerText = '↑';
  backToTopButton.classList.add('back-to-top');
  document.body.appendChild(backToTopButton);

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
});