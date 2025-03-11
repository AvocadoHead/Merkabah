// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
camera.position.z = 10;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Sephirot data with updated colors for Chokhmah and Chesed
const sephirotData = [
    { name: "כתר", position: [0, 5, 0], color: 0xffffff, frequency: 800, description: "כתר היא הספירה העליונה, מייצגת את הרצון האלוהי." },
    { name: "חכמה", position: [2, 4, 0], color: 0x808080, frequency: 700, description: "חכמה היא התחלת היצירה, המחשבה הראשונית." }, // Gray
    { name: "בינה", position: [-2, 4, 0], color: 0x333333, frequency: 600, description: "בינה היא ההבנה וההתבוננות." },
    { name: "חסד", position: [3, 2, 0], color: 0x0047AB, frequency: 500, description: "חסד מייצגת את החסד והאהבה ללא גבולות." }, // Deep cobalt blue
    { name: "גבורה", position: [-3, 2, 0], color: 0xff0000, frequency: 400, description: "גבורה היא כוח השיפוט והגבורה." },
    { name: "תפארת", position: [0, 1, 0], color: 0xffd700, frequency: 350, description: "תפארת היא היופי והאיזון." },
    { name: "נצח", position: [2, -1, 0], color: 0x00ff00, frequency: 300, description: "נצח מייצגת את הניצחון וההתמדה." },
    { name: "הוד", position: [-2, -1, 0], color: 0xffa500, frequency: 250, description: "הוד היא ההוד וההדר." },
    { name: "יסוד", position: [0, -3, 0], color: 0x800080, frequency: 200, description: "יסוד היא היסוד והקשר." },
    { name: "מלכות", position: [0, -5, 0], color: 0x8b4513, frequency: 150, description: "מלכות היא המלכות והשפע." }
];

// Create glowing Sephirot
const sephirotMeshes = [];
sephirotData.forEach(data => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...data.position);
    mesh.userData = { name: data.name, frequency: data.frequency, description: data.description };
    scene.add(mesh);
    sephirotMeshes.push(mesh);

    const light = new THREE.PointLight(data.color, 1, 10);
    light.position.set(...data.position);
    scene.add(light);
});

// Paths between Sephirot (22 paths)
const paths = [
    { start: 0, end: 1 }, { start: 0, end: 2 }, { start: 0, end: 5 },
    { start: 1, end: 3 }, { start: 1, end: 5 }, { start: 2, end: 4 }, { start: 2, end: 5 },
    { start: 3, end: 4 }, { start: 3, end: 5 }, { start: 3, end: 6 },
    { start: 4, end: 5 }, { start: 4, end: 7 }, { start: 5, end: 6 }, { start: 5, end: 7 }, { start: 5, end: 8 },
    { start: 6, end: 7 }, { start: 6, end: 8 }, { start: 6, end: 9 },
    { start: 7, end: 8 }, { start: 7, end: 9 }, { start: 8, end: 9 }
];

// Create paths and moving dots
const pathDots = [];
paths.forEach(path => {
    const startPos = new THREE.Vector3(...sephirotData[path.start].position);
    const endPos = new THREE.Vector3(...sephirotData[path.end].position);
    const points = [startPos, endPos];
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    for (let i = 0; i < 3; i++) {
        const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        scene.add(dot);
        const direction = i % 2 === 0 ? 1 : -1;
        pathDots.push({ dot, startPos, endPos, direction, offset: Math.random() });
    }
});

// Audio setup with fade-in and fade-out
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
let gainNode = null;
let isMuted = false;

function playSound(frequency) {
    if (isMuted) return;
    if (currentOscillator) currentOscillator.stop();
    currentOscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    currentOscillator.type = 'sine';
    currentOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    currentOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 2);
    currentOscillator.start();
    setTimeout(() => {
        if (gainNode) {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
        }
        setTimeout(() => {
            if (currentOscillator) {
                currentOscillator.stop();
                currentOscillator = null;
            }
        }, 2000);
    }, 58000);
}

document.getElementById('muteButton').addEventListener('click', () => {
    isMuted = !isMuted;
    document.getElementById('muteButton').textContent = isMuted ? 'בטל השתקה' : 'השתק';
    if (isMuted && currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }
});

// 2D Merkaba interaction
const merkaba2D = document.getElementById('merkaba2D');
merkaba2D.addEventListener('mouseover', () => {
    document.getElementById('merkabaOverlay').style.display = 'block';
});
merkaba2D.addEventListener('mouseout', () => {
    document.getElementById('merkabaOverlay').style.display = 'none';
});

// Interaction with Sephirot
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(sephirotMeshes);
    if (intersects.length > 0) {
        const selectedSephira = intersects[0].object;
        playSound(selectedSephira.userData.frequency);
        
        const currentColor = new THREE.Color(ambientLight.color);
        const targetColor = new THREE.Color(selectedSephira.material.color);
        new TWEEN.Tween(currentColor)
            .to(targetColor, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                ambientLight.color.set(currentColor);
            })
            .start();
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    const intersectsSephirot = raycaster.intersectObjects(sephirotMeshes);
    if (intersectsSephirot.length > 0) {
        const sephira = intersectsSephirot[0].object.userData;
        document.getElementById('sephiraName').textContent = sephira.name;
        document.getElementById('sephiraDescription').textContent = sephira.description;
    } else {
        document.getElementById('sephiraName').textContent = '';
        document.getElementById('sephiraDescription').textContent = '';
    }
}

window.addEventListener('click', onMouseClick);
window.addEventListener('mousemove', onMouseMove);

// Letter combinations
const combinations = [
    { combination: "אלד", meaning: "ברכה כללית" },
    { combination: "סאל", meaning: "רפואה" },
    { combination: "מהש", meaning: "שפע" }
];

document.getElementById('generateButton').addEventListener('click', () => {
    const request = document.getElementById('requestInput').value.trim();
    let selectedCombination = request ? combinations.find(c => c.meaning.includes(request)) : null;
    if (!selectedCombination) {
        selectedCombination = combinations[Math.floor(Math.random() * combinations.length)];
    }
    document.getElementById('combinationOutput').textContent = `הצירוף: ${selectedCombination.combination} - ${selectedCombination.meaning}`;
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    
    pathDots.forEach(({ dot, startPos, endPos, direction, offset }) => {
        const time = (Date.now() % 2000) / 2000;
        const progress = (time + offset) % 1;
        if (direction === 1) {
            dot.position.lerpVectors(startPos, endPos, progress);
        } else {
            dot.position.lerpVectors(endPos, startPos, progress);
        }
    });
    
    renderer.render(scene, camera);
}
animate();