// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const container = document.getElementById('rubiks-cube-container');
const width = container.clientWidth;
const height = 400; // Fixed height for the cube container
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Create the Rubik's Cube
const cubeSize = 3;
const cube = new THREE.Group();

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0xffffff]; // Red, Green, Blue, Yellow, Orange, White

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const material = colors.map(color => new THREE.MeshPhongMaterial({ color }));
      const cubelet = new THREE.Mesh(geometry, material);
      cubelet.position.set(x, y, z);
      cube.add(cubelet);
    }
  }
}

scene.add(cube);

// Position the camera
camera.position.z = 5;

// Add interactivity
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

container.addEventListener('mousedown', () => (isDragging = true));
container.addEventListener('mouseup', () => (isDragging = false));
container.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    cube.rotation.y += deltaX * 0.01;
    cube.rotation.x += deltaY * 0.01;
  }
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = 400; // Fixed height
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();