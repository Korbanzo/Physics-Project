import './App.css';
import { useState, useRef, useEffect } from 'react';
import Ball from './Components/Ball';
import Paddle from './Components/Paddle';
import StartOverlay from './Components/StartOverlay';

//const framesPerSecond = 60;
const gravity = 9.8;
const positionXinit = window.innerWidth * 0.05; // 2% of the window viewis where the center of the paddle is at
const positionYinit = 0;
const velXinit = 0;
const velYinit = 0;
const roundTo = 2;
const frictionCoefficient = 0.2;

// These constants are scalar quantities representing the elasticity of it's collisions. (0 <= e <= 1) Where 0 is perfectly inelastic and 1 is perfectly elastic
const CoR_Array = { perfectlyInelastic: 0.0, baseBall: 0.546, tennisBall: 0.79919, perfectlyElastic: 1.0 };
const coefficientOfRestitution = CoR_Array.tennisBall;

const degreesToRadians = (angleInDegrees) => {
  return angleInDegrees * (Math.PI / 180);
}

const getPaddleXComponent = (angleInDegrees, paddleWidth) => {
  const angleInRadians = degreesToRadians(angleInDegrees);
  
  return Math.abs(paddleWidth * Math.cos(angleInRadians));
}

const getPaddleYComponent = (angleInDegrees, paddleWidth, paddleHeight) => {
  const angleInRadians = degreesToRadians(angleInDegrees);

  return paddleHeight + Math.abs((paddleWidth * Math.sin(angleInRadians)));
}

//const getDrag = (vel) => {}

const roundDecimal = (number, decimalPlaces) => {
  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

const isBallHitPaddle = (positionBall, positionPaddle, angleInDegrees, ballSize, paddleWidth, paddleHeight) => {
  const ballRadius = ballSize / 2;
  const angleInRadians = degreesToRadians(angleInDegrees);

  const ballCenter = {x: positionBall.x + ballRadius, y: positionBall.y + ballRadius};
  const paddleCenter = {x: positionPaddle.x + paddleWidth / 2, y: positionPaddle.y + paddleHeight / 2};  

  const dx = ballCenter.x - paddleCenter.x;
  const dy = ballCenter.y - paddleCenter.y;

  const localX = dx * Math.cos(-angleInRadians) - dy * Math.sin(-angleInRadians);
  const localY = dx * Math.sin(-angleInRadians) + dy * Math.cos(-angleInRadians);

  const halfWidth = paddleWidth / 2;
  const halfHeight = paddleHeight / 2;
  const clampedX = Math.max(-halfWidth, Math.min(localX, halfWidth));
  const clampedY = Math.max(-halfHeight, Math.min(localY, halfHeight));

  const diffX = localX - clampedX;
  const diffY = localY - clampedY;
  const diffSquared = Math.pow(diffX, 2) + Math.pow(diffY, 2);

  return diffSquared <= Math.pow(ballRadius, 2);
}

const handleCollisions = (positionBall, vel, windowSize, ballSize, isCollided, angleInDegrees, positionPaddle, paddleWidth, paddleHeight) => {
  let newPos = { ...positionBall };
  let newVel = { ...vel };
  let hasBounced = false;

  if (isCollided) {
    const ballRadius = ballSize / 2;
    const angleInRadians = degreesToRadians(angleInDegrees);

    const paddleCenter = {
      x: positionPaddle.x + paddleWidth / 2,
      y: positionPaddle.y + paddleHeight / 2,
    };

    const ballCenter = {
      x: positionBall.x + ballRadius,
      y: positionBall.y + ballRadius,
    };

    const dx = ballCenter.x - paddleCenter.x;
    const dy = ballCenter.y - paddleCenter.y;
    const localX = dx * Math.cos(-angleInRadians) - dy * Math.sin(-angleInRadians);
    const localY = dx * Math.sin(-angleInRadians) + dy * Math.cos(-angleInRadians);

    const halfWidth = paddleWidth / 2;
    const halfHeight = paddleHeight / 2;

    const clampedX = Math.max(-halfWidth, Math.min(localX, halfWidth));
    const clampedY = Math.max(-halfHeight, Math.min(localY, halfHeight));

    const diffX = localX - clampedX;
    const diffY = localY - clampedY;
    const distSq = diffX * diffX + diffY * diffY;

    if (distSq < ballRadius * ballRadius) {
      const dist = Math.sqrt(distSq) || 0.0001;
      const penetration = ballRadius - dist;

      let nx = diffX / dist;
      let ny = diffY / dist;

      const worldNormal = {
        x: nx * Math.cos(angleInRadians) - ny * Math.sin(angleInRadians),
        y: nx * Math.sin(angleInRadians) + ny * Math.cos(angleInRadians),
      };

      newPos.x += worldNormal.x * penetration;
      newPos.y += worldNormal.y * penetration;

      const dot = newVel.x * worldNormal.x + newVel.y * worldNormal.y;
      newVel.x -= 2 * dot * worldNormal.x;
      newVel.y -= 2 * dot * worldNormal.y;

      newVel.x *= coefficientOfRestitution;
      newVel.y *= coefficientOfRestitution;

      hasBounced = true;
    }
  }

  // Floor
  if (newPos.y + ballSize >= windowSize.height) {
    newPos.y = windowSize.height - ballSize;
    newVel.y *= -coefficientOfRestitution;
    hasBounced = true;
  }
  
  // Ceiling
  if (newPos.y <= 0) {
    newPos.y = 0;
    newVel.y *= -coefficientOfRestitution;
    hasBounced = true;
  }

  // Right
  if (newPos.x + ballSize >= windowSize.width) {
    newPos.x = windowSize.width - ballSize;
    newVel.x *= -coefficientOfRestitution;
    hasBounced = true;
  }

  // Left
  if (newPos.x <= 0) {
    newPos.x = ballSize;
    newVel.x *= -coefficientOfRestitution;
    hasBounced = true;
  }

  // Apply friction if ball is touching another solid
  if (hasBounced) {
    newVel.x *= (1 - frictionCoefficient);
  }

  return { positionBall: newPos, vel: newVel };
}

const App = () => { 
  var paddleRef = useRef();
  var ballRef = useRef();

  const [ballSize, setBallSize] = useState(0);
  const [positionBall, setBallPosition] = useState({ x: positionXinit, y: positionYinit });
  const [positionPaddle, setPaddlePosition] = useState({ x: positionXinit, y: positionYinit })
  const [isGameStarted, setGameStarted] = useState(false);
  const [angle, setAngle] = useState(0);
  const [paddleHeight, setPaddleHeight] = useState(0);
  const [paddleWidth, setPaddleWidth] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const vel = useRef({ x: velXinit, y: velYinit });  

  useEffect(() => {
    if (ballRef.current)  
      setBallSize(ballRef.current.offsetWidth);
  }, []);

  useEffect(() => {
  const handleResize = () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    setWindowSize({ width: newWidth, height: newHeight });

    if (paddleRef.current) {
      const paddleW = paddleRef.current.offsetWidth;
      const paddleH = paddleRef.current.offsetHeight;

      setPaddleWidth(paddleW);
      setPaddleHeight(paddleH);

      const newX = newWidth * 0.02;
      const newY = newHeight * 0.90 - paddleH / 2;

      setPaddlePosition({ x: newX, y: newY });
    }

    if (ballRef.current) {
      setBallSize(ballRef.current.offsetWidth);
    }
  };

  handleResize();

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  // Physics Loop
  useEffect(() => {
  if (!isGameStarted) return;

  let animationFrameId;
  let lastAnimationFrame = performance.now();

  const loop = (currentAnimationFrame) => {
    

    const dt = (currentAnimationFrame - lastAnimationFrame) / 1000;
    lastAnimationFrame = currentAnimationFrame;


    setBallPosition(prevPos => {
      const isCollided = isBallHitPaddle(prevPos, positionPaddle, angle, ballSize, paddleWidth, paddleHeight);

      vel.current = {x: vel.current.x, y: vel.current.y + gravity * dt};
      let newPos = {x: prevPos.x + vel.current.x, y: prevPos.y + vel.current.y};

      ({ positionBall: newPos, vel: vel.current } = handleCollisions(newPos, vel.current, windowSize, ballSize, isCollided, angle, positionPaddle, paddleWidth, paddleHeight));
      return newPos;
    });

    animationFrameId = requestAnimationFrame(loop);
  }

  animationFrameId = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(animationFrameId);
  }, [isGameStarted, ballSize, windowSize, angle, paddleWidth, paddleHeight, positionPaddle]);


  const startGame = () => {
    vel.current = { x: velXinit, y: velYinit };
    setPaddleWidth(paddleRef.current.offsetWidth);
    setGameStarted(true);
  };

  return (
    <>
      { !isGameStarted && (<StartOverlay angle={angle} setAngle={setAngle} onStart={startGame} />) }

      <div className="App">
        <p>
          Velocity: X: { roundDecimal(vel.current.x, roundTo) }px/s Y: { roundDecimal(vel.current.y, roundTo) }px/s Ball Size: {ballSize}px Paddle X Component: { roundDecimal(getPaddleXComponent(angle, paddleWidth, paddleHeight), roundTo) }px Paddle Y Component: { roundDecimal(getPaddleYComponent(angle, paddleWidth, paddleHeight), roundTo)}px
        </p>      
        <Ball ref={ ballRef } style={{ position: 'absolute', left: `${positionBall.x}px`, top: `${positionBall.y}px` }}/>
        <Paddle ref={ paddleRef } angle={ angle } position={positionPaddle} />
      </div>
    </>
  );
}

export default App;