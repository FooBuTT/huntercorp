import React, { useState, useEffect, useRef } from "react";
import { Ball } from "../futures/types/Types/ts";

const initialBalls: Ball[] = [
  //1 ряд
  { x: 405, y: 300, radius: 20, color: "black", dx: 0, dy: 0 },
  //2 ряд
  { x: 440, y: 279, radius: 20, color: "yellow", dx: 0, dy: 0 },
  { x: 440, y: 321, radius: 20, color: "cyan", dx: 0, dy: 0 },
  //3 ряд
  { x: 475, y: 300, radius: 20, color: "blue", dx: 0, dy: 0 },
  { x: 475, y: 341, radius: 20, color: "red", dx: 0, dy: 0 },
  { x: 475, y: 259, radius: 20, color: "purple", dx: 0, dy: 0 },
  //4 ряд
  { x: 510, y: 279, radius: 20, color: "orange", dx: 0, dy: 0 },
  { x: 510, y: 321, radius: 20, color: "green", dx: 0, dy: 0 },
  { x: 510, y: 238, radius: 20, color: "darkcyan", dx: 0, dy: 0 },
  { x: 510, y: 362, radius: 20, color: "chartreuse", dx: 0, dy: 0 },
  //5 ряд
  { x: 546, y: 300, radius: 20, color: "darkblue", dx: 0, dy: 0 },
  { x: 546, y: 341, radius: 20, color: "brown", dx: 0, dy: 0 },
  { x: 546, y: 259, radius: 20, color: "pink", dx: 0, dy: 0 },
  { x: 546, y: 218, radius: 20, color: "darkgreen", dx: 0, dy: 0 },
  { x: 546, y: 382, radius: 20, color: "darkred", dx: 0, dy: 0 },
  //Биток
  { x: 200, y: 300, radius: 20, color: "white", dx: 0, dy: 0 },
];

export default function Board() {
  const [balls, setBalls] = useState(initialBalls);
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setBalls(initialBalls);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach((ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    });
    // Направление движения шара
    if (selectedBall && mousePosition) {
      ctx.beginPath();
      ctx.moveTo(selectedBall.x, selectedBall.y);
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Выделяем выбранный шар
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
    }
  }, [balls, selectedBall, mousePosition]);

  const handleSelectBall = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Проверяем, попал ли клик в какой-либо из шаров
    const clickedBall = balls.find((ball) => {
      const dx = ball.x - mouseX;
      const dy = ball.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
    });

    setSelectedBall(clickedBall || null);
    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid black", backgroundColor: "grey" }}
      onClick={handleSelectBall}
      onMouseMove={handleMouseMove}
    ></canvas>
  );
}
