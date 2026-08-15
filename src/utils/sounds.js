// Sound effects synthesized with the Web Audio API (no audio files required).

export function playSound(name) {
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

      case 'win': {
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
      }

      default:
        break;
    }
  } catch {
    // Audio not supported, silently fail
  }
}
