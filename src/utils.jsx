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

export const normalizeSales = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' млн.'
  }  
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + ' тыс.'
  } 
  
}