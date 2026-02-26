const canvas = document.getElementById('fogCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let userName = "";

function startGame() {
    userName = document.getElementById('userName').value;
    if (userName.trim() !== "") {
        document.getElementById('display-name').innerText = "প্রিয় " + userName + ",";
        document.getElementById('name-screen').style.display = "none";
        initCanvas();
    }
}

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create the initial Fog
    ctx.fillStyle = 'rgba(25, 40, 55, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleStart(e) { isDrawing = true; wipe(e); }
function handleEnd() { 
    isDrawing = false; 
    checkUnblurPercentage(); // Check after each lift
}

function wipe(e) {
    if (!isDrawing) return;
    
    // Prevent screen movement/scrolling
    e.preventDefault();

    let x = (e.touches ? e.touches[0].clientX : e.clientX);
    let y = (e.touches ? e.touches[0].clientY : e.clientY);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
}

// Pixel Detection Logic: User koto tuku porishkar korlo
function checkUnblurPercentage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Harami logic: protiti 4th pixel check korbe speed baranor jonno
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }

    const totalPixels = pixels.length / 4;
    const percentage = (transparentPixels / totalPixels) * 100;

    // Jodi 40% area porishkar hoy tobei card ashbe
    if (percentage > 40) {
        showCard();
    }
}

function showCard() {
    canvas.style.transition = "opacity 1.5s";
    canvas.style.opacity = "0";
    setTimeout(() => {
        document.getElementById('premiumCard').classList.add('active');
        document.getElementById('msg').style.display = "none";
    }, 500);
}

function closeCard() {
    document.getElementById('premiumCard').classList.remove('active');
    canvas.style.opacity = "1";
    initCanvas(); // Reset fog
}

// Listeners
canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('mousemove', wipe);
window.addEventListener('mouseup', handleEnd);

canvas.addEventListener('touchstart', handleStart, {passive: false});
canvas.addEventListener('touchmove', wipe, {passive: false});
canvas.addEventListener('touchend', handleEnd);
