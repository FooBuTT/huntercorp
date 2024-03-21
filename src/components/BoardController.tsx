import React, { useState, useEffect } from "react";
import { Ball } from "../futures/types/types";
import BoardView from "./BoardView";
import ColorMenu from "./ColorMenu";

const initialBalls: Ball[] = [
  { x: 300, y: 300, radius: 40, color: "black", dx: 0, dy: 0 },
  { x: 440, y: 321, radius: 20, color: "cyan", dx: 0, dy: 0 },
  { x: 475, y: 100, radius: 20, color: "purple", dx: 0, dy: 0 },
  { x: 510, y: 279, radius: 50, color: "orange", dx: 0, dy: 0 },
  { x: 546, y: 382, radius: 10, color: "darkred", dx: 0, dy: 0 },
  { x: 200, y: 300, radius: 20, color: "white", dx: 0, dy: 0 },
];

const BoardController: React.FC = () => {
  const [balls, setBalls] = useState(initialBalls);
  const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [power, setPower] = useState(0);
  const [powerDirection, setPowerDirection] = useState<"increase" | "decrease">(
    "increase"
  );
  const [resetAnimation, setResetAnimation] = useState(false);
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    const interval = setInterval(() => {
      setPower((prevPower) => {
        const powerChangeSpeed = 0.05;
        let newPower = prevPower;

        if (powerDirection === "increase") {
          newPower += powerChangeSpeed;
          if (newPower >= 10) {
            setPowerDirection("decrease");
          }
        } else {
          newPower -= powerChangeSpeed;
          if (newPower <= 3) {
            setPowerDirection("increase");
          }
        }

        return newPower;
      });

      setBalls((prevBalls) =>
        prevBalls.map((ball, index) => {
          if (index === selectedBallIndex) {
            const { x, y, dx, dy } = ball;

            if (dx !== undefined && dy !== undefined) {
              return {
                ...ball,
                x: x + dx / 10,
                y: y + dy / 10,
              };
            }
          }
          return ball;
        })
      );
    }, 1);

    return () => clearInterval(interval);
  }, [selectedBallIndex, powerDirection, resetAnimation]);

  useEffect(() => {
    const updateBalls = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball, index) => {
          let newX = ball.x + ball.dx / 10;
          let newY = ball.y + ball.dy / 10;
          let newDx = ball.dx;
          let newDy = ball.dy;

          if (newX - ball.radius <= 0 || newX + ball.radius >= canvasWidth) {
            newDx = -ball.dx * 0.8;
            newX = newX < ball.radius ? ball.radius : canvasWidth - ball.radius;
          }
          if (newY - ball.radius <= 0 || newY + ball.radius >= canvasHeight) {
            newDy = -ball.dy * 0.8;
            newY =
              newY < ball.radius ? ball.radius : canvasHeight - ball.radius;
          }

          for (let i = index + 1; i < prevBalls.length; i++) {
            const otherBall = prevBalls[i];
            const distanceX = newX - otherBall.x;
            const distanceY = newY - otherBall.y;
            const distance = Math.sqrt(
              distanceX * distanceX + distanceY * distanceY
            );
            const minDistance = ball.radius + otherBall.radius;

            if (distance < minDistance) {
              const angle = Math.atan2(distanceY, distanceX);
              const targetX = otherBall.x + Math.cos(angle) * minDistance;
              const targetY = otherBall.y + Math.sin(angle) * minDistance;
              const acceleration = 0.05;
              newDx -= acceleration * (newX - targetX);
              newDy -= acceleration * (newY - targetY);

              const impulseRatio = 0.8;
              otherBall.dx += acceleration * (newX - targetX) * impulseRatio;
              otherBall.dy += acceleration * (newY - targetY) * impulseRatio;
            }
          }

          newDx *= 0.99;
          newDy *= 0.99;

          return {
            ...ball,
            x: newX,
            y: newY,
            dx: newDx,
            dy: newDy,
          };
        })
      );
    };

    const interval = setInterval(updateBalls, 10);

    return () => clearInterval(interval);
  }, []);

  const handleSelectBall = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const clickedBallIndex = balls.findIndex((ball) => {
      const dx = ball.x - mouseX;
      const dy = ball.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
    });

    if (selectedBallIndex !== null) {
      setResetAnimation(true);
      console.log(power);
      setSelectedBallIndex(null);

      setBalls((prevBalls) =>
        prevBalls.map((ball, index) => {
          if (index === selectedBallIndex) {
            const powerMultiplier = power / 10;
            const newDx = ball.x - mouseX || 0;
            const newDy = ball.y - mouseY || 0;
            return {
              ...ball,
              dx: newDx * powerMultiplier,
              dy: newDy * powerMultiplier,
            };
          }
          return ball;
        })
      );
    }

    setSelectedBallIndex(clickedBallIndex !== -1 ? clickedBallIndex : null);
    setMousePosition({ x: mouseX, y: mouseY });
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });
  };
  const handleColorChange = (color: string) => {
    if (selectedBallIndex !== null) {
      setBalls((prevBalls) =>
        prevBalls.map((ball, index) =>
          index === selectedBallIndex ? { ...ball, color: color } : ball
        )
      );
    }
  };
  return (
    <>
      <BoardView
        balls={balls}
        selectedBallIndex={selectedBallIndex}
        mousePosition={mousePosition}
        power={power}
        onSelectBall={handleSelectBall}
        onMouseMove={handleMouseMove}
      />
      {selectedBallIndex !== null && (
        <ColorMenu onColorChange={handleColorChange} />
      )}
    </>
  );
};

export default BoardController;
