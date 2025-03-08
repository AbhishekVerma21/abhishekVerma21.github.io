// Scene, Camera, Renderer
const scene = new THREE.Scene();
const container = document.getElementById('rubiks-cube-container');
const width = container.clientWidth;
const height = container.clientHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Create the Rubik's Cube
const cubeSize = 3;
const cubelets = [];
const cubeGroup = new THREE.Group();

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0xffffff]; // Red, Green, Blue, Yellow, Orange, White

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const materials = colors.map(color => new THREE.MeshPhongMaterial({ color }));
      const cubelet = new THREE.Mesh(geometry, materials);
      cubelet.position.set(x, y, z);
      cubeGroup.add(cubelet);
      cubelets.push(cubelet);
    }
  }
}

scene.add(cubeGroup);

// Camera Position
camera.position.z = 5;

// Interaction
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

container.addEventListener('mousedown', () => (isDragging = true));
container.addEventListener('mouseup', () => (isDragging = false));
container.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    cubeGroup.rotation.y += deltaX * 0.01;
    cubeGroup.rotation.x += deltaY * 0.01;
  }
  previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Face Rotation Logic
function rotateFace(face) {
  const rotationAxis = { x: 0, y: 0, z: 0 };
  const angle = Math.PI / 2; // 90 degrees

  switch (face) {
    case 'front':
      rotationAxis.z = 1;
      break;
    case 'back':
      rotationAxis.z = -1;
      break;
    case 'left':
      rotationAxis.x = -1;
      break;
    case 'right':
      rotationAxis.x = 1;
      break;
    case 'up':
      rotationAxis.y = 1;
      break;
    case 'down':
      rotationAxis.y = -1;
      break;
  }

  // Rotate the cubelets on the selected face
  cubelets.forEach(cubelet => {
    if (Math.abs(cubelet.position[face]) === 1) {
      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(new THREE.Vector3(rotationAxis.x, rotationAxis.y, rotationAxis.z), angle);
      cubelet.position.applyQuaternion(quaternion);
      cubelet.quaternion.multiply(quaternion);
    }
  });
}

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();