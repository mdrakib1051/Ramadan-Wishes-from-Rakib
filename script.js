const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('premiumCard');
let isWiping = false;
let userName = "";

// 1. Start Game: Shudhu Fog dekhabe, Card na
function startGame() {
    userName = document.getElementById('userName').value;
    if (userName.trim() !== "") {
        document.getElementById('display-name').innerText = "প্রিয় " + userName + ",";
        
        // Name screen shore jabe
        const nameScreen = document.getElementById('name-screen');
        nameScreen.style.opacity = "0";
        setTimeout(() => {
            nameScreen.style.display = "none";
            // Ekhon kanch foggy hobe
            initFog();
        }, 500);
    } else {
        alert("দয়া করে তোমার নামটি লিখো");
    }
}

// 2. Fog Layer create kora (Card thakbe pichone lukiye)
function initFog() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Deep foggy blue color
    ctx.fillStyle = 'rgba(20, 35, 50, 0.98)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 3. Wiping Mechanism
function wipe(e) {
    if (!isWiping) return;
    
    // Mobile-e screen scroll/movement bondho korbe
    if (e.cancelable) e.preventDefault();

    let x = (e.touches ? e.touches[0].clientX : e.clientX);
    let y = (e.touches ? e.touches[0].clientY : e.clientY);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2); // Brush size ektu boro kora holo
    ctx.fill();
}

// 4. Pixel Detection: Purota ghosheche kina check kora
function checkProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let cleared = 0;

    // Protiti 4th pixel check (Performance-er jonno)
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) cleared++;
    }

    const total = pixels.length / 4;
    const percentage = (cleared / total) * 100;

    // 50% ghosha holei card ashbe
    if (percentage > 50) {
        triggerCardReveal();
    }
}

function triggerCardReveal() {
    // Canvas fade out hoye jabe dhire dhire
    canvas.style.transition = "opacity 2s ease";
    canvas.style.opacity = "0";
    
    document.getElementById('msg').style.display = "none";

    // Card-ta 3D animation niye ashbe
    setTimeout(() => {
        card.classList.add('active');
        canvas.style.display = "none"; // Purapuri shore jabe
    }, 500);
}

function closeCard() {
    card.classList.remove('active');
    canvas.style.display = "block";
    canvas.style.opacity = "1";
    initFog(); // Abar foggy hoye jabe
}

// Event Listeners (Mouse & Touch)
canvas.addEventListener('mousedown', () => isWiping = true);
window.addEventListener('mouseup', () => {
    isWiping = false;
    checkProgress(); // Haath chharle check korbe koto tuku holo
});
canvas.addEventListener('mousemove', wipe);

canvas.addEventListener('touchstart', (e) => {
    isWiping = true;
}, {passive: false});
canvas.addEventListener('touchend', () => {
    isWiping = false;
    checkProgress();
});
canvas.addEventListener('touchmove', wipe, {passive: false});
