
// --- Elementos del DOM cacheados ---
    const controlButtonsDiv = document.getElementById('control-buttons');
    const clockDiv = document.getElementById('clock');
    const headerElement = document.querySelector('header');
    const mainElement = document.querySelector('main');
    const footerElement = document.querySelector('footer');
    const overlayGradient = document.getElementById('overlay-gradient');
    const overlayGradientLg = document.getElementById('overlay-gradient-lg');

    // Botones de control
    const hideHudBtn = document.getElementById('hide-hud-btn');
    const showHudBtn = document.getElementById('show-hud-btn');
    const showClockBtn = document.getElementById('show-clock-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const toggleRotationBtn = document.getElementById('toggle-rotation-btn');
let clockIntervalId = null;
let inactivityTimerId = null;

// --- Lógica de Controles del HUD y Reloj ---
function hideControlsOnInactivity() {
    if (controlButtonsDiv && !controlButtonsDiv.classList.contains('invisible')) {
        controlButtonsDiv.classList.add('opacity-0');
        controlButtonsDiv.classList.add('pointer-events-none');
    }
}

function resetInactivityTimer() {
    if (controlButtonsDiv) {
        clearTimeout(inactivityTimerId);
        if (!controlButtonsDiv.classList.contains('invisible')) {
            controlButtonsDiv.classList.remove('opacity-0');
            controlButtonsDiv.classList.remove('pointer-events-none');
            inactivityTimerId = setTimeout(hideControlsOnInactivity, 2000);
        }
    }
}
  
if (hideHudBtn) {
    hideHudBtn.addEventListener('click', function() {
        if (headerElement) headerElement.classList.add('invisible');
        if (mainElement) mainElement.classList.add('invisible');
        if (footerElement) footerElement.classList.add('invisible');
        if (overlayGradient) overlayGradient.style.display = 'none';
        if (overlayGradientLg) overlayGradientLg.style.display = 'none';
        
        if (controlButtonsDiv) {
            controlButtonsDiv.classList.remove('invisible');
            controlButtonsDiv.classList.remove('opacity-0');
            controlButtonsDiv.classList.remove('pointer-events-none');
            resetInactivityTimer();
        }
    });
}

if (showHudBtn) {
    showHudBtn.addEventListener('click', function() {
        if (headerElement) headerElement.classList.remove('invisible');
        if (mainElement) mainElement.classList.remove('invisible');
        if (footerElement) footerElement.classList.remove('invisible');
        if (overlayGradient) overlayGradient.style.display = 'block';
        if (overlayGradientLg) overlayGradientLg.style.display = 'block';
        
        clearTimeout(inactivityTimerId);
        inactivityTimerId = null;

        if (controlButtonsDiv) {
            controlButtonsDiv.classList.remove('opacity-0');
            controlButtonsDiv.classList.remove('pointer-events-none');
            controlButtonsDiv.classList.add('invisible');
        }

        if (clockDiv) clockDiv.style.display = 'none';
        if (clockIntervalId) {
            clearInterval(clockIntervalId);
            clockIntervalId = null; 
        }
    });
}

if (showClockBtn) {
    showClockBtn.addEventListener('click', function() {
        if (clockDiv) {
            if (clockDiv.style.display === 'none') {
                clockDiv.style.display = 'block';
                updateClock(); 
                if (clockIntervalId) clearInterval(clockIntervalId);
                clockIntervalId = setInterval(updateClock, 1000);
            } else {
                clockDiv.style.display = 'none';
                if (clockIntervalId) {
                    clearInterval(clockIntervalId);
                    clockIntervalId = null;
                }
            }
        }
    });
}

function updateClock() {
    if (clockDiv) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clockDiv.textContent = `${hours}:${minutes}`;
    }
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    });
}

if (toggleRotationBtn) {
    toggleRotationBtn.addEventListener('click', function() {
        // Asume que window.toggleRotationMode() está definido globalmente en script.js
        if (typeof window.toggleRotationMode === 'function') {
            const isRotating = window.toggleRotationMode();
            this.textContent = isRotating ? 'Rotación ON' : 'Rotación OFF';
        } else {
            console.error("toggleRotationMode function not found on window object.");
        }
    });
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('touchstart', resetInactivityTimer);



