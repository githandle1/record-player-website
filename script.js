const record = document.getElementById('record');
const tonearm = document.getElementById('tonearm');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volume');
const volumeValue = document.getElementById('volumeValue');
const trackName = document.getElementById('trackName');

let isPlaying = false;
let audioContext = null;
let oscillator = null;
let gainNode = null;

// Initialize audio context
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = volumeSlider.value / 100;
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

// Create a simple tone for demonstration
function createTone() {
    if (!audioContext) return;
    
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    
    oscillator.connect(gainNode);
    oscillator.start();
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
}

function togglePlayPause() {
    if (!audioContext) {
        initAudio();
    }
    
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        // Start playing
        record.classList.add('playing');
        tonearm.classList.add('playing');
        playPauseBtn.classList.add('playing');
        trackName.textContent = 'Classic Vinyl - Side A';
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        createTone();
    } else {
        // Stop playing
        record.classList.remove('playing');
        tonearm.classList.remove('playing');
        playPauseBtn.classList.remove('playing');
        trackName.textContent = 'Paused';
        stopTone();
    }
}

function updateVolume() {
    const volume = volumeSlider.value;
    volumeValue.textContent = volume + '%';
    
    if (gainNode) {
        gainNode.gain.value = volume / 100;
    }
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);

volumeSlider.addEventListener('input', updateVolume);

// Initialize volume display
updateVolume();

// Initialize audio on first user interaction
document.addEventListener('click', () => {
    if (!audioContext) {
        initAudio();
    }
}, { once: true });
