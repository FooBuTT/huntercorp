import React, { useEffect, useRef } from "react";
import { Ball } from "../futures/types/types";

interface BoardProps {
  balls: Ball[];
  selectedBallIndex: number | null;
  mousePosition: { x: number; y: number } | null;
  power: number;
  onSelectBall: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

const BoardView: React.FC<BoardProps> = ({
  balls,
  selectedBallIndex,
  mousePosition,
  power,
  onSelectBall,
  onMouseMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    });

    if (selectedBallIndex !== null && mousePosition) {
      const selectedBall = balls[selectedBallIndex];
      const angle = Math.atan2(
        mousePosition.y - selectedBall.y,
        mousePosition.x - selectedBall.x
      );
      const fixedLength = 100;
      const startX =
        selectedBall.x + (selectedBall.radius + 1) * Math.cos(angle);
      const startY =
        selectedBall.y + (selectedBall.radius + 1) * Math.sin(angle);
      const endX = startX + fixedLength * Math.cos(angle);
      const endY = startY + fixedLength * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "cyan";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(
        selectedBall.x,
        selectedBall.y,
        selectedBall.radius + 1,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      const powerX = selectedBall.x;
      const powerY = selectedBall.y + selectedBall.radius + 10;
      ctx.beginPath();
      ctx.moveTo(powerX - selectedBall.radius, powerY);
      ctx.lineTo(
        powerX - selectedBall.radius + (selectedBall.radius * 2 * power) / 10,
        powerY
      );
      ctx.strokeStyle = "red";
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
    }
  }, [balls, selectedBallIndex, mousePosition, power]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black", backgroundColor: "darkgreen" }}
        onClick={onSelectBall}
        onMouseMove={onMouseMove}
      ></canvas>
    </div>
  );
};

export default BoardView;
