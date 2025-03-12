// Scene setup for main container
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
camera.position.z = 15;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Sephirot data with updated colors and additional info based on the image
const sephirotData = [
    { 
        name: "כתר", 
        position: [0, 6, 2], 
        color: 0xFFFFFF, // לבן, מתאים לתמונה
        frequency: 800, 
        description: "כתר - הרצון האלוהי המוחלט. מלאך: מטטרון. סמלים: שלושה גלגלים, אפס הטארוט (הנשמה הטיפשית). קשר לטארוט: אפס - הנשמה הטיפשית.",
        angel: "מטטרון",
        symbols: "שלושה גלגלים",
        tarot: "אפס - הנשמה הטיפשית"
    },
    { 
        name: "חכמה", 
        position: [2, 4, 1.5], 
        color: 0xADD8E6, // כחול בהיר, מתאים לתמונה
        frequency: 700, 
        description: "חכמה - נקודת ההשראה הראשונית. מלאך: רזיאל. סמלים: כסא, עשרים וארבעה זקני הכסא. קשר לטארוט: אחת - הקוסם.",
        angel: "רזיאל",
        symbols: "כסא, עשרים וארבעה זקני הכסא",
        tarot: "אחת - הקוסם"
    },
    { 
        name: "בינה", 
        position: [-2, 4, 1.5], 
        color: 0x800080, // סגול, מתאים לתמונה
        frequency: 600, 
        description: "בינה - הבנה עמוקה. מלאך: צפקיאל. סמלים: כד, שלושה גלגלים. קשר לטארוט: שתיים - הכוהנת.",
        angel: "צפקיאל",
        symbols: "כד, שלושה גלגלים",
        tarot: "שתיים - הכוהנת"
    },
    { 
        name: "חסד", 
        position: [4, 2, 1], 
        color: 0x00CED1, // טורקיז, מתאים לתמונה
        frequency: 500, 
        description: "חסד - אהבה וחמלה. מלאך: צדקיאל. סמלים: כתר, אריה. קשר לטארוט: שלוש - הקיסרית.",
        angel: "צדקיאל",
        symbols: "כתר, אריה",
        tarot: "שלוש - הקיסרית"
    },
    { 
        name: "גבורה", 
        position: [-4, 2, 1], 
        color: 0xFF4500, // כתום-אדום, מתאים לתמונה
        frequency: 400, 
        description: "גבורה - כוח ושיפוט. מלאך: כמאל. סמלים: חרב, מגדל. קשר לטארוט: ארבע - הקיסר.",
        angel: "כמאל",
        symbols: "חרב, מגדל",
        tarot: "ארבע - הקיסר"
    },
    { 
        name: "תפארת", 
        position: [0, 0, 0], 
        color: 0xFFFF00, // צהוב, מתאים לתמונה
        frequency: 350, 
        description: "תפארת - הרמוניה ויופי. מלאך: מיכאל. סמלים: שמש, לב. קשר לטארוט: חמש - הכוהן הגדול.",
        angel: "מיכאל",
        symbols: "שמש, לב",
        tarot: "חמש - הכוהן הגדול"
    },
    { 
        name: "נצח", 
        position: [3, -2, -1], 
        color: 0x9ACD32, // ירוק בהיר, מתאים לתמונה
        frequency: 300, 
        description: "נצח - נצחיות וניצחון. מלאך: חניאל. סמלים: נר, נחש. קשר לטארוט: שש - האוהבים.",
        angel: "חניאל",
        symbols: "נר, נחש",
        tarot: "שש - האוהבים"
    },
    { 
        name: "הוד", 
        position: [-3, -2, -1], 
        color: 0xFF69B4, // ורוד, מתאים לתמונה
        frequency: 250, 
        description: "הוד - תהילה והודיה. מלאך: רפאל. סמלים: נר, שפה. קשר לטארוט: שבע - המרכבה.",
        angel: "רפאל",
        symbols: "נר, שפה",
        tarot: "שבע - המרכבה"
    },
    { 
        name: "יסוד", 
        position: [0, -4, -2], 
        color: 0xFFA500, // כתום, מתאים לתמונה
        frequency: 200, 
        description: "יסוד - גשר בין הרוחני לגשמי. מלאך: סנדלפון. סמלים: איבר מין, שרשרת. קשר לטארוט: תשע - החסד.",
        angel: "סנדלפון",
        symbols: "איבר מין, שרשרת",
        tarot: "תשע - החסד"
    },
    { 
        name: "מלכות", 
        position: [0, -6, -4], 
        color: 0xFFD700, // זהב, מתאים לתמונה
        frequency: 150, 
        description: "מלכות - השתקפות האלוהית בעולם. מלאך: גבריאל. סמלים: כדור הארץ, כתר. קשר לטארוט: עשר - גלגל המזל.",
        angel: "גבריאל",
        symbols: "כדור הארץ, כתר",
        tarot: "עשר - גלגל המזל"
    }
];

// Create glowing Sephirot
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
        mesh.userData = { ...data }; // כולל את כל המידע (name, frequency, description, angel, symbols, tarot)
        scene.add(mesh);
        const light = new THREE.PointLight(data.color, 1, 10);
        light.position.set(...data.position);
        scene.add(light);
        return mesh;
    });
}
initializeSephirot();

// Paths between all Sephirot
const paths = [];
for (let i = 0; i < sephirotData.length; i++) {
    for (let j = i + 1; j < sephirotData.length; j++) {
        paths.push({ start: i, end: j });
    }
}

// Create paths and moving dots
const pathDots = [];
paths.forEach(path => {
    const startPos = new THREE.Vector3(...sephirotData[path.start].position);
    const endPos = new THREE.Vector3(...sephirotData[path.end].position);
    const points = [startPos, endPos];
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 1, transparent: true, opacity: 0.8 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    for (let i = 0; i < 3; i++) {
        const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.9 });
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        scene.add(dot);
        const direction = i % 2 === 0 ? 1 : -1;
        pathDots.push({ dot, startPos, endPos, direction, offset: Math.random() });
    }
});

// Setup Merkaba scene
const merkabaScene = new THREE.Scene();
const merkabaCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const merkabaRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
merkabaRenderer.setSize(150, 150);
merkabaRenderer.setClearColor(0x000000, 0);
document.getElementById('merkaba3DContainer').appendChild(merkabaRenderer.domElement);

// Add 3D Merkaba with two tetrahedrons
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

const tetra1Geometry = new THREE.TetrahedronGeometry(0.8, 0);
const tetra2Geometry = new THREE.TetrahedronGeometry(0.8, 0);

const tetra1 = new THREE.Mesh(tetra1Geometry, merkabaMaterial);
const tetra1Wireframe = new THREE.Mesh(tetra1Geometry, wireframeMaterial);
const tetra2 = new THREE.Mesh(tetra2Geometry, merkabaMaterial);
const tetra2Wireframe = new THREE.Mesh(tetra2Geometry, wireframeMaterial);

tetra1.rotation.x = -Math.PI / 2;
tetra2.rotation.x = Math.PI / 2;

const merkabaGroup = new THREE.Group();
merkabaGroup.add(tetra1);
merkabaGroup.add(tetra1Wireframe);
merkabaGroup.add(tetra2);
merkabaGroup.add(tetra2Wireframe);
merkabaScene.add(merkabaGroup);

merkabaCamera.position.z = 2.5;

const merkabaLight = new THREE.AmbientLight(0xffffff, 0.8);
merkabaScene.add(merkabaLight);

// Audio setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
let gainNode = null;
let isMuted = false;
let audioInitialized = false;

function initializeAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            audioInitialized = true;
            console.log('Audio initialized and resumed');
            playTestSound();
        }).catch(error => {
            console.error('Failed to resume audio context:', error);
            // נסה שוב לאחר 1 שנייה
            setTimeout(initializeAudio, 1000);
        });
    } else {
        audioInitialized = true;
        console.log('Audio initialized');
        playTestSound();
    }
}

function playTestSound() {
    if (!isMuted && audioInitialized) {
        playSound(440);
    }
}

function playSound(frequency) {
    if (isMuted || !audioInitialized) {
        console.log('Sound not played: Muted or audio not initialized');
        return;
    }
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
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.1); // עוצמה מלאה
        currentOscillator.start();
        setTimeout(() => {
            if (gainNode) gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            setTimeout(() => { if (currentOscillator) currentOscillator.stop(); currentOscillator = null; }, 600);
        }, 500);
        console.log(`Playing sound at frequency ${frequency} Hz`);
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

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

// Merkaba interaction
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
merkaba3DContainer.addEventListener('touchstart', () => { isTouchActive = true; const personImage = document.getElementById('personImage'); if (personImage) personImage.style.opacity = '1'; });
merkaba3DContainer.addEventListener('touchend', () => { isTouchActive = false; const personImage = document.getElementById('personImage'); if (personImage) personImage.style.opacity = '0'; });

// Sephirot interaction (hover for info, click for sound)
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
            <strong>מלאך:</strong> ${sephira.angel}<br>
            <strong>סמלים:</strong> ${sephira.symbols}<br>
            <strong>קשר לטארוט:</strong> ${sephira.tarot}
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
            <strong>מלאך:</strong> ${sephira.angel}<br>
            <strong>סמלים:</strong> ${sephira.symbols}<br>
            <strong>קשר לטארוט:</strong> ${sephira.tarot}
        `;
    } else {
        document.getElementById('sephiraInfo').style.display = 'none';
    }
}

function onClickOrTouchStart(event) {
    event.preventDefault();
    const coords = event.type === 'touchstart' ? event.touches[0] : event;
    mouse.x = (coords.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(coords.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(sephirotMeshes);
    if (intersects.length > 0) {
        const selectedSephira = intersects[0].object;
        playSound(selectedSephira.userData.frequency);
        const currentColor = new THREE.Color(ambientLight.color);
        new TWEEN.Tween(currentColor).to(new THREE.Color(selectedSephira.material.color), 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => ambientLight.color.set(currentColor))
            .start();
    }
}

function onMouseOutOrTouchEnd(event) {
    document.getElementById('sephiraInfo').style.display = 'none';
    const personImage = document.getElementById('personImage');
    if (personImage && !isTouchActive) personImage.style.opacity = '0';
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('click', onClickOrTouchStart, false);
window.addEventListener('touchstart', onClickOrTouchStart, false);
window.addEventListener('mouseout', onMouseOutOrTouchEnd, false);
window.addEventListener('touchend', onMouseOutOrTouchEnd, false);

// Footer link interaction
document.querySelectorAll('.footer a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) window.open(href, link.target || '_blank');
        playSound(400); // צליל קליק
    });
    link.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) window.open(href, link.target || '_blank');
        playSound(400); // צליל קליק
    });
});

// Letter combinations
const combinations = [
    { combination: "אלד", meaning: "ברכה כללית, מעוררת אנרגיה חיובית..." },
    { combination: "סאל", meaning: "רפואה, מחזקת את הגוף והנשמה..." },
    { combination: "מהש", meaning: "שפע, פותחת דלתות לשגשוג..." }
];

document.getElementById('generateButton').addEventListener('click', () => {
    const request = document.getElementById('requestInput').value.trim();
    let selectedCombination = request ? combinations.find(c => c.meaning.toLowerCase().includes(request.toLowerCase())) : null;
    if (!selectedCombination) {
        selectedCombination = combinations[Math.floor(Math.random() * combinations.length)] || { combination: "אלד", meaning: "ברכה כללית, מעוררת אנרגיה חיובית..." };
    }
    document.getElementById('combinationOutput').innerHTML = `<span class="combination">${selectedCombination.combination}</span> <span class="meaning">${selectedCombination.meaning}</span>`;
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    
    tetra1.rotation.y += 0.02;
    tetra2.rotation.y -= 0.02;
    tetra1Wireframe.rotation.y += 0.02;
    tetra2Wireframe.rotation.y -= 0.02;
    
    pathDots.forEach(({ dot, startPos, endPos, direction, offset }) => {
        const time = (Date.now() % 4000) / 4000;
        const progress = (time + offset) % 1;
        dot.position.lerpVectors(direction === 1 ? startPos : endPos, direction === 1 ? endPos : startPos, progress);
    });
    
    renderer.render(scene, camera);
    merkabaRenderer.render(merkabaScene, merkabaCamera);
}
animate();
