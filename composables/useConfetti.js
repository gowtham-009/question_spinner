import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return { fireConfetti };
}
