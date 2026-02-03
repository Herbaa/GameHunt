import confetti from "canvas-confetti";

export const normalize = (t) => {
  return (t || "").trim().toLowerCase();
}

export const win = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      y: 0.6
    }
  });
};

export const normalizeSales = () => {
  
}