import { Howl } from 'howler';

// Sound effects - we'll use simple synthesized sounds or load from files
const sounds = {};

// Initialize sounds - using base64 encoded simple sounds for now
// These can be replaced with actual sound files later
function initSounds() {
  // Simple click/tap sound
  sounds.click = new Howl({
    src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'],
    volume: 0.3,
  });

  // Move sound - slightly longer
  sounds.move = new Howl({
    src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'],
    volume: 0.5,
  });

  // Capture sound - more impactful
  sounds.capture = new Howl({
    src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'],
    volume: 0.7,
  });

  // Check sound - alert
  sounds.check = new Howl({
    src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'],
    volume: 0.6,
  });

  // Win sound - celebration
  sounds.win = new Howl({
    src: ['data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'],
    volume: 0.8,
  });
}

// Lazy initialization
let initialized = false;

export function playSound(name) {
  if (!initialized) {
    initSounds();
    initialized = true;
  }

  // Use Web Audio API to generate simple sounds since base64 sounds are placeholders
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different sounds for different actions
    switch (name) {
      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;

      case 'move':
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.15;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case 'capture':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
        break;

      case 'check':
        oscillator.frequency.value = 600;
        oscillator.type = 'square';
        gainNode.gain.value = 0.15;
        // Two beeps
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);

        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 700;
          osc2.type = 'square';
          gain2.gain.value = 0.15;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.1);
        }, 120);
        break;

      case 'win':
        // Celebratory ascending notes
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.2;
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            osc.start();
            osc.stop(audioContext.currentTime + 0.2);
          }, i * 100);
        });
        break;

      default:
        break;
    }
  } catch (e) {
    // Audio not supported, silently fail
    console.log('Audio not available');
  }
}
