const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');
let isWiping = false;
let wipeCount = 0;

function startGame() {
    const name = document.getElementById('userName').value;
    if(name.trim() !== "") {
        document.getElementById('display-name').innerText = "প্রিয় " + name + ",";
        document.getElementById('name-screen').style.opacity = "0";
        setTimeout(() => document.getElementById('name-screen').style.display = "none", 500);
        initFog();
        createRain();
    }
}

// 1. Create Fog Layer
function initFog() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = 'rgba(20, 35, 50, 0.9)'; // Foggy glass look
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 2. Wiping Action
function wipe(e) {
    if(!isWiping) return;
    let x = (e.touches ? e.touches[0].clientX : e.clientX);
    let y = (e.touches ? e.touches[0].clientY : e.clientY);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
    
    wipeCount++;
    if(wipeCount > 150) { // Enough wiping to reveal card
        showCard();
    }
}

function showCard() {
    canvas.style.transition = "opacity 2s";
    canvas.style.opacity = "0";
    document.getElementById('premiumCard').classList.add('active');
    document.getElementById('msg').style.display = "none";
}

function closeCard() {
    document.getElementById('premiumCard').classList.remove('active');
    canvas.style.opacity = "1";
    initFog();
    wipeCount = 0;
}

// 3. Simple Rain Drop Generator
function createRain() {
    const rainLayer = document.getElementById('rainLayer');
    for(let i=0; i<50; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = '2px';
        drop.style.height = '15px';
        drop.style.background = 'rgba(255,255,255,0.2)';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = Math.random() * 100 + '%';
        drop.style.animation = `fall ${Math.random() * 1 + 0.5}s linear infinite`;
        rainLayer.appendChild(drop);
    }
}

// Event Listeners
canvas.addEventListener('mousedown', () => isWiping = true);
canvas.addEventListener('mouseup', () => isWiping = false);
canvas.addEventListener('mousemove', wipe);
canvas.addEventListener('touchstart', () => isWiping = true);
canvas.addEventListener('touchend', () => isWiping = false);
canvas.addEventListener('touchmove', wipe);

// Dynamic fall animation
const style = document.createElement('style');
style.innerHTML = `@keyframes fall { to { transform: translateY(100vh); } }`;
document.head.appendChild(style);
