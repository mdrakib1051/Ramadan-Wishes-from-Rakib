const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');
let isWiping = false;
let wipedPixels = 0;
let userName = "";

function startGame() {
    userName = document.getElementById('userName').value;
    if (userName.trim() !== "") {
        document.getElementById('display-name').innerText = "প্রিয় " + userName + ",";
        document.getElementById('name-screen').style.opacity = "0";
        setTimeout(() => document.getElementById('name-screen').style.display = "none", 500);
        
        initFog();
        createRain();
        createStars();
    }
}

// 1. Setup Canvas for Fog/Rain Layer
function initFog() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Translucent blue-ish fog layer (For realistic look)
    ctx.fillStyle = 'rgba(15, 30, 45, 0.9)'; // Deep fog color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 2. Wiping Action (Touch & Mouse)
function startWiping(e) {
    isWiping = true;
    wipe(e); // Clear initial point
}

function stopWiping() {
    isWiping = false;
    ctx.beginPath(); // Reset drawing path
}

function wipe(e) {
    if (!isWiping || document.getElementById('premiumCard').classList.contains('active')) return;

    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    // Set "erase" mode
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 45; // Wipe brush size
    ctx.lineCap = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y);

    countWipedPixels(); // Check if enough fog is cleared
}

// 3. Logic to Reveal Letter
function countWipedPixels() {
    // analyzed wiped pixels mechanism
    wipedPixels++;

    if (wipedPixels > 100) { // Enough wiping detected to open card
        wipedPixels = 0; // Reset
        setTimeout(() => {
            showPremiumLetter();
        }, 800);
    }
}

function showPremiumLetter() {
    // Gently fading out the canvas layer
    canvas.style.transition = 'opacity 1.5s ease';
    canvas.style.opacity = '0';
    document.getElementById('msg').style.display = 'none';

    // Bring in the premium card with 3D animation
    document.getElementById('premiumCard').classList.add('active');
}

function closeCard() {
    document.getElementById('premiumCard').classList.remove('active');
    // Gently fading in the canvas layer again
    canvas.style.transition = 'opacity 1s ease';
    canvas.style.opacity = '1';
    initFog(); // Re-add fog
}

// 4. Standard Rain Drop Generator
function createRain() {
    const rainLayer = document.getElementById('rainLayer');
    for(let i=0; i<60; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = '2px';
        drop.style.height = '15px';
        drop.style.background = 'rgba(255,255,255,0.2)';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = Math.random() * 100 + '%';
        drop.style.animation = `fall ${Math.random() * 1.5 + 0.8}s linear infinite`;
        rainLayer.appendChild(drop);
    }
}

// 5. Aesthetic Star Generator
function createStars() {
    const sky = document.querySelector('.sky-background');
    for(let i=0; i<30; i++) {
        const star = document.createElement('div');
        star.innerText = "✨";
        star.style.position = 'absolute';
        star.style.fontSize = Math.random() * 8 + 4 + 'px';
        star.style.left = Math.random() * 80 + 10 + '%';
        star.style.top = Math.random() * 50 + 10 + '%';
        star.style.opacity = Math.random() * 0.5 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 2 + 1}s infinite alternate`;
        sky.appendChild(star);
    }
}

// Event Listeners (Mouse & Touch)
canvas.addEventListener('mousedown', startWiping);
canvas.addEventListener('mousemove', wipe);
window.addEventListener('mouseup', stopWiping);

canvas.addEventListener('touchstart', startWiping);
canvas.addEventListener('touchmove', wipe);
window.addEventListener('touchend', stopWiping);

// Add dynamic animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fall { to { transform: translateY(100vh); } }
    @keyframes twinkle { from { opacity: 0.2; } to { opacity: 0.6; } }
`;
document.head.appendChild(style);
