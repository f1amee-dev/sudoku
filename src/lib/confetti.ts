import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  // fire multiple bursts of confetti
  const count = 3;
  const defaults = { 
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 100,
    disableForReducedMotion: true
  };

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(200 * particleRatio)
    });
  };

  // fire in sequence for better visual effect
  fire(0.25, {
    origin: { y: 0.7, x: 0.1 },
    colors: ['#4F46E5', '#818CF8', '#C7D2FE']
  });

  setTimeout(() => {
    fire(0.35, {
      origin: { y: 0.7, x: 0.5 },
      colors: ['#4F46E5', '#818CF8', '#C7D2FE']
    });
  }, 250);

  setTimeout(() => {
    fire(0.25, {
      origin: { y: 0.7, x: 0.9 },
      colors: ['#4F46E5', '#818CF8', '#C7D2FE']
    });
  }, 500);
}; 