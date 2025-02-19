"use client";

import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

export const useConfetti = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Set initial dimensions
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Handle window resize
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startConfetti = () => {
    setIsActive(true);
  };

  const handleConfettiComplete = () => {
    setIsActive(false);
  };

  const ConfettiComponent = () => (
    <>
      {isActive && (
        <ReactConfetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
          onConfettiComplete={handleConfettiComplete}
          colors={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]}
        />
      )}
    </>
  );

  return {
    startConfetti,
    ConfettiComponent,
  };
};
