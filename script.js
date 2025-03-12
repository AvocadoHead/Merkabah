// -----------------------------------------
//  הגדרות סצנה ראשית של עץ הספירות
// -----------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// בקרת מצלמה
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
camera.position.z = 15;

// תאורה כללית
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// -----------------------------------------
//  נתוני הספירות (ללא קלפי טארוט)
// -----------------------------------------
// נוסיף 'nameOfGod' עבור שם ה' בכל ספירה, ונשאיר מלאך וסמלים
const sephirotData = [
    { 
        name: "כתר",
        position: [0, 6, 2],
        color: 0xFFFFFF,
        frequency: 800,
        nameOfGod: "אהיה", // שם האלוהות
        angel: "מטטרון",
        symbols: "שלושה גלגלים",
        description: "כתר - הרצון האלוהי המוחלט. השורש העליון של כל המציאות."
    },
    { 
        name: "חכמה",
        position: [2, 4, 1.5],
        color: 0xADD8E6,
        frequency: 700,
        nameOfGod: "יה",
        angel: "רזיאל",
        symbols: "כסא, מעיין החוכמה",
        description: "חכמה - נקודת ההשראה הראשונית, התגלות האור האלוהי הראשוני."
    },
    { 
        name: "בינה",
        position: [-2, 4, 1.5],
        color: 0x800080,
        frequency: 600,
        nameOfGod: "יהוה אלוהים",
        angel: "צפקיאל",
        symbols: "כד, תבונה עמוקה",
        description: "בינה - הבנה עמוקה, עיבוד החוכמה והפיכתה לתובנה."
    },
    { 
        name: "חסד",
        position: [4, 2, 1],
        color: 0x00CED1,
        frequency: 500,
        nameOfGod: "אל",
        angel: "צדקיאל",
        symbols: "אהבה וחמלה",
        description: "חסד - מידת החסד, נתינה ואהבה בלתי מוגבלת."
    },
    { 
        name: "גבורה",
        position: [-4, 2, 1],
        color: 0xFF4500,
        frequency: 400,
        nameOfGod: "אלוהים גיבור",
        angel: "כמאל",
        symbols: "חרב הדין",
        description: "גבורה - כוח, גבולות ושיפוט, מציב גבולות כדי לאזן את החסד."
    },
    { 
        name: "תפארת",
        position: [0, 0, 0],
        color: 0xFFFF00,
        frequency: 350,
        nameOfGod: "יהוה",
        angel: "מיכאל",
        symbols: "איזון, שמש, לב",
        description: "תפארת - איזון ויופי, החיבור בין חסד לגבורה."
    },
    { 
        name: "נצח",
        position: [3, -2, -1],
        color: 0x9ACD32,
        frequency: 300,
        nameOfGod: "יהוה צבאות",
        angel: "חניאל",
        symbols: "ניצחון, התמדה",
        description: "נצח - נצחיות וניצחון, הכוח להמשיך ולהתקדם."
    },
    { 
        name: "הוד",
        position: [-3, -2, -1],
        color: 0xFF69B4,
        frequency: 250,
        nameOfGod: "אלוהים צבאות",
        angel: "רפאל",
        symbols: "תהילה והודיה",
        description: "הוד - הוד והדר, ענוה והכרה בגדולת האל."
    },
    { 
        name: "יסוד",
        position: [0, -4, -2],
        color: 0xFFA500,
        frequency: 200,
        nameOfGod: "שדי אל חי",
        angel: "סנדלפון",
        symbols: "גשר בין הרוחני לגשמי",
        description: "יסוד - היסוד המקשר בין הספירות העליונות לעולם החומרי."
    },
    { 
        name: "מלכות",
        position: [0, -6, -4],
        color: 0xFFD700,
        frequency: 150,
        nameOfGod: "אדני הארץ",
        angel: "גבריאל",
        symbols: "כדור הארץ, מלכות בשפלות",
        description: "מלכות - ביטוי האלוהות במציאות הגשמית, המקום שבו הכול מתגשם."
    }
];

// יצירת ספירות זוהרות
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

        // הוספת נקודת אור קטנה בכל ספירה
        const light = new THREE.PointLight(data.color, 1, 10);
        light.position.set(...data.position);
        scene.add(light);

        return mesh;
    });
}
initializeSephirot();

// -----------------------------------------
//  חיבורי קווים בין הספירות (רשת כללית)
//  כאן אפשר לשנות לפי רצונך איזה ספירות יתחברו לאיזה
// -----------------------------------------
const paths = [];
for (let i = 0; i < sephirotData.length; i++) {
    for (let j = i + 1; j < sephirotData.length; j++) {
        paths.push({ start: i, end: j });
    }
}

// יצירת הקווים והנקודות הנעות עליהם
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
    
    // יצירת 3 נקודות נעות לכל קו
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
//  סצנה למרכבה (Merkaba) בתצוגה מוקטנת
// -----------------------------------------
const merkabaScene = new THREE.Scene();
const merkabaCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const merkabaRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
merkabaRenderer.setSize(150, 150);
merkabaRenderer.setClearColor(0x000000, 0);
document.getElementById('merkaba3DContainer').appendChild(merkabaRenderer.domElement);

// חומר למרכבה
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

// שני טטראהדרונים יוצרים מרכבה
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

// -----------------------------------------
//  הגדרות אודיו
// -----------------------------------------
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
let gainNode = null;
let isMuted = false;
let audioInitialized = false;

function initializeAudio() {
    // ניסיון לדרוש אינטראקציה מהמשתמש כדי להפעיל אודיו (במיוחד בסלולר)
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
    if (isMuted || !audioInitialized) {
        return;
    }
    try {
        // עצירת צליל קודם אם קיים
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

        // fade in
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 0.1);

        currentOscillator.start();

        // השמעה קצרה של חצי שנייה + fade out
        setTimeout(() => {
            if (gainNode) {
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            }
            setTimeout(() => {
                if (currentOscillator) {
                    currentOscillator.stop();
                    currentOscillator = null;
                }
            }, 600);
        }, 500);

    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// כפתור השתק/ביטול השתקה
document.getElementById('muteButton').addEventListener('click', () => {
    isMuted = !isMuted;
    document.getElementById('muteButton').textContent = isMuted ? 'בטל השתקה' : 'השתק';

    // אם מבטלים השתקה ועדיין לא אותחל האודיו, נאתחל
    if (!isMuted && !audioInitialized) {
        initializeAudio();
    } else if (!isMuted && audioInitialized) {
        playTestSound();
    }
    // עצירת הצליל אם משתיקים
    if (isMuted && currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }
});

// -----------------------------------------
//  אינטראקציה עם המרכבה (הצגת תמונה/אנימציה)
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
//  אינטראקציה עם הספירות
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
    // בכל קליק/טאץ' נוודא שהאודיו אותחל
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

        // שינוי צבע התאורה לרגע על פי צבע הספירה
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

// אירועים
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('click', onClickOrTouchStart, false);
window.addEventListener('touchstart', onClickOrTouchStart, false);
window.addEventListener('mouseout', onMouseOutOrTouchEnd, false);
window.addEventListener('touchend', onMouseOutOrTouchEnd, false);

// -----------------------------------------
//  אינטראקציה עם קישורי הפוטר
// -----------------------------------------
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

// -----------------------------------------
//  יצירת צירופים של אותיות
// -----------------------------------------
const combinations = [
    { combination: "אלד", meaning: "ברכה כללית, מעוררת אנרגיה חיובית..." },
    { combination: "סאל", meaning: "רפואה, מחזקת את הגוף והנשמה..." },
    { combination: "מהש", meaning: "שפע, פותחת דלתות לשגשוג..." }
];

document.getElementById('generateButton').addEventListener('click', () => {
    const request = document.getElementById('requestInput').value.trim();
    let selectedCombination = request 
        ? combinations.find(c => c.meaning.toLowerCase().includes(request.toLowerCase())) 
        : null;
    
    if (!selectedCombination) {
        selectedCombination = combinations[Math.floor(Math.random() * combinations.length)] 
            || { combination: "אלד", meaning: "ברכה כללית, מעוררת אנרגיה חיובית..." };
    }
    document.getElementById('combinationOutput').innerHTML = `
        <span class="combination">${selectedCombination.combination}</span> 
        <span class="meaning">${selectedCombination.meaning}</span>
    `;
});

// -----------------------------------------
//  לולאת אנימציה
// -----------------------------------------
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    
    // סיבוב המרכבה
    tetra1.rotation.y += 0.02;
    tetra2.rotation.y -= 0.02;
    tetra1Wireframe.rotation.y += 0.02;
    tetra2Wireframe.rotation.y -= 0.02;
    
    // הנעת הנקודות על הקווים
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
