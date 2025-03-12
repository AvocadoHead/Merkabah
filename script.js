// -----------------------------------------
//  Main Scene (Tree of Life)
// -----------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
camera.position.z = 15;

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Sephirot Data
const sephirotData = [
  { 
    name: "כתר",
    position: [0, 6, 0.5],
    color: 0xFFFFFF,
    frequency: 800,
    nameOfGod: "אהיה",
    angel: "מטטרון",
    symbols: "שורש עליון, אין סוף",
    description: "כתר - הרצון האלוהי המוחלט, המקור העליון של כל המציאות."
  },
  {
    name: "חכמה",
    position: [2, 4, 1],
    color: 0xADD8E6,
    frequency: 700,
    nameOfGod: "יה",
    angel: "רזיאל",
    symbols: "אור ראשוני, רעיון",
    description: "חכמה - התגלות האור האלוהי הראשוני, ה'רעיון' לפני העיבוד."
  },
  {
    name: "בינה",
    position: [-2, 4, 1],
    color: 0x800080,
    frequency: 600,
    nameOfGod: "יהוה אלוהים",
    angel: "צפקיאל",
    symbols: "תבונה, עיבוד החוכמה",
    description: "בינה - הבנה ועיבוד, הופכת את החוכמה למושגים ותובנות."
  },
  {
    name: "חסד",
    position: [3, 2, 0.5],
    color: 0x00CED1,
    frequency: 500,
    nameOfGod: "אל",
    angel: "צדקיאל",
    symbols: "אהבה, נתינה",
    description: "חסד - מידת החסד והאהבה, נתינה בלי גבולות."
  },
  {
    name: "גבורה",
    position: [-3, 2, 0.5],
    color: 0xFF4500,
    frequency: 400,
    nameOfGod: "אלוהים",
    angel: "כמואל",
    symbols: "כוח, גבולות, אש",
    description: "גבורה - כוח ושיפוט, מציב גבולות ומאזן את החסד."
  },
  {
    name: "תפארת",
    position: [0, 0, -1.5],
    color: 0xFFFF00,
    frequency: 350,
    nameOfGod: "יהוה",
    angel: "רפאל",
    symbols: "איזון, שמש, רחמים",
    description: "תפארת - המרכז, איזון הרמוני בין חסד לגבורה."
  },
  {
    name: "נצח",
    position: [3, -2, -0.5],
    color: 0x9ACD32,
    frequency: 300,
    nameOfGod: "יהוה צבאות",
    angel: "חניאל",
    symbols: "ניצחון, התמדה",
    description: "נצח - התגברות, נצחיות ותנועה קדימה."
  },
  {
    name: "הוד",
    position: [-3, -2, -0.5],
    color: 0xFF69B4,
    frequency: 250,
    nameOfGod: "אלוהים צבאות",
    angel: "מיכאל",
    symbols: "הודיה, הכנעה",
    description: "הוד - הוד והדר, ענוה והכרה בגדולת האל."
  },
  {
    name: "יסוד",
    position: [0, -4, -1],
    color: 0xFFA500,
    frequency: 200,
    nameOfGod: "שדי",
    angel: "גבריאל",
    symbols: "חיבור הרוחני והגשמי",
    description: "יסוד - גשר המעביר את השפע מהעליון אל התחתון."
  },
  {
    name: "מלכות",
    position: [0, -6, -1.5],
    color: 0xFFD700,
    frequency: 150,
    nameOfGod: "אדני",
    angel: "סנדלפון",
    symbols: "ארץ, קבלת השפע",
    description: "מלכות - ביטוי האלוהות בעולם, הכלי שבו מתגשמת המציאות."
  }
];

// Create glowing spheres for Sephirot
let sephirotMeshes = [];
function initializeSephirot() {
  sephirotMeshes = sephirotData.map(data => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.5,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...data.position);
    mesh.userData = { ...data };
    scene.add(mesh);

    // small point light at each sephira
    const light = new THREE.PointLight(data.color, 1, 10);
    light.position.set(...data.position);
    scene.add(light);

    return mesh;
  });
}
initializeSephirot();

// -----------------------------------------
//  Lines and moving dots between Sephirot
// -----------------------------------------
const paths = [];
for (let i = 0; i < sephirotData.length; i++) {
  for (let j = i + 1; j < sephirotData.length; j++) {
      paths.push({ start: i, end: j });
  }
}

const pathDots = [];
paths.forEach(path => {
  const startPos = new THREE.Vector3(...sephirotData[path.start].position);
  const endPos = new THREE.Vector3(...sephirotData[path.end].position);
  const points = [startPos, endPos];
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x666666, 
    linewidth: 1, 
    transparent: true, 
    opacity: 0.8
  });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  
  // create 3 moving dots on each line
  for (let i = 0; i < 3; i++) {
      const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const dotMaterial = new THREE.MeshBasicMaterial({
          color: 0xcccccc, 
          transparent: true, 
          opacity: 0.9
      });
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      scene.add(dot);
      const direction = i % 2 === 0 ? 1 : -1;
      pathDots.push({ dot, startPos, endPos, direction, offset: Math.random() });
  }
});

// -----------------------------------------
//  Separate scene for the Merkaba
// -----------------------------------------
const merkabaScene = new THREE.Scene();
const merkabaCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const merkabaRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
merkabaRenderer.setSize(200, 200);
merkabaRenderer.setClearColor(0x000000, 0);
document.getElementById('merkaba3DContainer').appendChild(merkabaRenderer.domElement);

const merkabaMaterial = new THREE.MeshPhongMaterial({
  color: 0xffd700,
  emissive: 0xffd700,
  emissiveIntensity: 0.5,
  transparent: true,
  opacity: 0.6,
  shininess: 100,
  side: THREE.DoubleSide
});
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd700,
  wireframe: true,
  transparent: true,
  opacity: 0.8
});

// Two tetrahedrons => Merkaba
const tetra1Geometry = new THREE.TetrahedronGeometry(0.8, 0);
const tetra2Geometry = new THREE.TetrahedronGeometry(0.8, 0);

const tetra1 = new THREE.Mesh(tetra1Geometry, merkabaMaterial);
const tetra1Wireframe = new THREE.Mesh(tetra1Geometry, wireframeMaterial);
const tetra2 = new THREE.Mesh(tetra2Geometry, merkabaMaterial);
const tetra2Wireframe = new THREE.Mesh(tetra2Geometry, wireframeMaterial);

const merkabaGroup = new THREE.Group();
merkabaGroup.add(tetra1);
merkabaGroup.add(tetra1Wireframe);
merkabaGroup.add(tetra2);
merkabaGroup.add(tetra2Wireframe);

// Initial rotation
tetra1.rotation.x = -Math.PI / 2;
tetra2.rotation.x = Math.PI / 2;

// Scale up Merkaba
merkabaGroup.scale.set(1.5, 1.5, 1.5);

merkabaScene.add(merkabaGroup);
merkabaCamera.position.z = 2.5;

const merkabaLight = new THREE.AmbientLight(0xffffff, 0.8);
merkabaScene.add(merkabaLight);

// -----------------------------------------
//  Audio config: longer fade in/out
// -----------------------------------------
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
let gainNode = null;
let isMuted = false;
let audioInitialized = false;

function initializeAudio() {
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      audioInitialized = true;
      playTestSound();
    }).catch(error => {
      console.error('Failed to resume audio context:', error);
      setTimeout(initializeAudio, 1000);
    });
  } else {
    audioInitialized = true;
    playTestSound();
  }
}

function playTestSound() {
  if (!isMuted && audioInitialized) {
    playSound(440);
  }
}

function playSound(frequency) {
  if (isMuted || !audioInitialized) return;

  try {
    if (currentOscillator) {
      currentOscillator.stop();
      currentOscillator = null;
    }
    currentOscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    currentOscillator.type = 'sine';
    currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    currentOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    const fadeInTime = 0.3;
    const sustainTime = 1.0;
    const fadeOutTime = 0.7;
    const totalTime = fadeInTime + sustainTime + fadeOutTime;

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + fadeInTime);

    currentOscillator.start(now);

    gainNode.gain.setValueAtTime(0.8, now + fadeInTime);
    gainNode.gain.linearRampToValueAtTime(0, now + fadeInTime + sustainTime + fadeOutTime);

    currentOscillator.stop(now + totalTime);

    currentOscillator.onended = () => {
      currentOscillator = null;
    };
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Mute/unmute button
document.getElementById('muteButton').addEventListener('click', () => {
  isMuted = !isMuted;
  document.getElementById('muteButton').textContent = isMuted ? 'בטל השתקה' : 'השתק';

  if (!isMuted && !audioInitialized) {
    initializeAudio();
  } else if (!isMuted && audioInitialized) {
    playTestSound();
  }
  if (isMuted && currentOscillator) {
    currentOscillator.stop();
    currentOscillator = null;
  }
});

// -----------------------------------------
//  Interaction with Merkaba (hover => show person image)
// -----------------------------------------
const merkaba3DContainer = document.getElementById('merkaba3DContainer');
let isTouchActive = false;

merkaba3DContainer.addEventListener('mouseover', () => {
  const personImage = document.getElementById('personImage');
  if (personImage) personImage.style.opacity = '1';
});
merkaba3DContainer.addEventListener('mouseout', () => {
  const personImage = document.getElementById('personImage');
  if (personImage) personImage.style.opacity = '0';
});
merkaba3DContainer.addEventListener('touchstart', () => {
  isTouchActive = true; 
  const personImage = document.getElementById('personImage');
  if (personImage) personImage.style.opacity = '1';
});
merkaba3DContainer.addEventListener('touchend', () => {
  isTouchActive = false; 
  const personImage = document.getElementById('personImage');
  if (personImage) personImage.style.opacity = '0';
});

// -----------------------------------------
//  Interaction with Sephirot
// -----------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sephirotMeshes);
  if (intersects.length > 0) {
    const sephira = intersects[0].object.userData;
    document.getElementById('sephiraInfo').style.display = 'block';
    document.getElementById('sephiraName').textContent = sephira.name;
    document.getElementById('sephiraDescription').innerHTML = `
      ${sephira.description}<br>
      <strong>שם ה':</strong> ${sephira.nameOfGod}<br>
      <strong>מלאך:</strong> ${sephira.angel}<br>
      <strong>סמלים:</strong> ${sephira.symbols}
    `;
  } else {
    document.getElementById('sephiraInfo').style.display = 'none';
  }
}

function onTouchMove(event) {
  if (!isTouchActive) return;
  event.preventDefault();
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sephirotMeshes);
  if (intersects.length > 0) {
    const sephira = intersects[0].object.userData;
    document.getElementById('sephiraInfo').style.display = 'block';
    document.getElementById('sephiraName').textContent = sephira.name;
    document.getElementById('sephiraDescription').innerHTML = `
      ${sephira.description}<br>
      <strong>שם ה':</strong> ${sephira.nameOfGod}<br>
      <strong>מלאך:</strong> ${sephira.angel}<br>
      <strong>סמלים:</strong> ${sephira.symbols}
    `;
  } else {
    document.getElementById('sephiraInfo').style.display = 'none';
  }
}

function onClickOrTouchStart(event) {
  event.preventDefault();
  if (!audioInitialized) {
    initializeAudio();
  }

  const coords = event.type === 'touchstart' ? event.touches[0] : event;
  mouse.x = (coords.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(coords.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sephirotMeshes);
  if (intersects.length > 0) {
    const selectedSephira = intersects[0].object;
    playSound(selectedSephira.userData.frequency);

    // Tween ambient light color
    const currentColor = new THREE.Color(ambientLight.color);
    new TWEEN.Tween(currentColor)
      .to(new THREE.Color(selectedSephira.material.color), 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => ambientLight.color.set(currentColor))
      .start();
  }
}

function onMouseOutOrTouchEnd() {
  document.getElementById('sephiraInfo').style.display = 'none';
  const personImage = document.getElementById('personImage');
  if (personImage && !isTouchActive) {
    personImage.style.opacity = '0';
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('click', onClickOrTouchStart, false);
window.addEventListener('touchstart', onClickOrTouchStart, false);
window.addEventListener('mouseout', onMouseOutOrTouchEnd, false);
window.addEventListener('touchend', onMouseOutOrTouchEnd, false);

// -----------------------------------------
//  Footer links (sound on click/touch)
// -----------------------------------------
document.querySelectorAll('.footer a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href) window.open(href, link.target || '_blank');
    playSound(400); // short click sound
  });
  link.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href) window.open(href, link.target || '_blank');
    playSound(400); // short click sound
  });
});

// -----------------------------------------
//  Local letter combinations (no external server)
// -----------------------------------------
const combinations = [
  { combination: "אלד", meaning: "ברכה כללית, אנרגיה חיובית..." },
  { combination: "סאל", meaning: "רפואה, חיזוק הגוף והנפש..." },
  { combination: "מהש", meaning: "שפע, פותחת דלתות לשגשוג..." },
  { combination: "אני", meaning: "חיבור פנימי, גילוי עצמי..." },
  { combination: "נשש", meaning: "הגנה מפני עין הרע..." },
  { combination: "ההה", meaning: "עזרה מלמעלה בעת משבר..." },
  { combination: "אאל", meaning: "טיהור אנרגטי, בהירות מחשבה..." },
  { combination: "לוי", meaning: "התעלות רוחנית, קשר עליון..." },
  { combination: "יצי", meaning: "יצירתיות, זרימה והשראה..." },
  { combination: "חבב", meaning: "חיזוק אהבה, שימור זוגיות..." },
  { combination: "אליה", meaning: "גילוי אליהו, הארה פנימית..." },
  { combination: "ענו", meaning: "ענווה והכנעה חיובית..." },
  { combination: "קסת", meaning: "הגנה ושמירה במסעות..." }
];

document.getElementById('generateButton').addEventListener('click', () => {
  const request = document.getElementById('requestInput').value.trim();
  
  // For now, we ignore 'request' and pick random
  if (!combinations || combinations.length === 0) {
    document.getElementById('combinationOutput').innerHTML = `
      <span class="combination">אלד</span> 
      <span class="meaning">ברכה כללית, אנרגיה חיובית...</span>
    `;
    return;
  }

  const selectedCombination = combinations[Math.floor(Math.random() * combinations.length)];
  document.getElementById('combinationOutput').innerHTML = `
    <span class="combination">${selectedCombination.combination}</span> 
    <span class="meaning">${selectedCombination.meaning}</span>
  `;
});

// -----------------------------------------
//  Animation loop
// -----------------------------------------
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
  
  // Rotate Merkaba
  tetra1.rotation.y += 0.02;
  tetra2.rotation.y -= 0.02;
  tetra1Wireframe.rotation.y += 0.02;
  tetra2Wireframe.rotation.y -= 0.02;
  
  // Move dots on lines
  pathDots.forEach(({ dot, startPos, endPos, direction, offset }) => {
    const time = (Date.now() % 4000) / 4000;
    const progress = (time + offset) % 1;
    dot.position.lerpVectors(
      direction === 1 ? startPos : endPos, 
      direction === 1 ? endPos : startPos, 
      progress
    );
  });
  
  renderer.render(scene, camera);
  merkabaRenderer.render(merkabaScene, merkabaCamera);
}
animate();
