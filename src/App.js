import './App.css';
import { useState, useRef, useEffect } from 'react';
import Ball from './Components/Ball';
import Paddle from './Components/Paddle';
import StartOverlay from './Components/StartOverlay';

const updatesPerSecond = 60;
const intervalDelay = 1000 / updatesPerSecond;
const gravity = 9.8 / updatesPerSecond;
const positionXinit = window.innerWidth * 0.05; // 2% of the window viewis where the center of the paddle is at
const positionYinit = 0;
const velXinit = 0;
const velYinit = 0;
const roundTo = 2;

const airDensity = 1.188 // @ 75°F
const dt = 1 / updatesPerSecond;
const dragCoefficientArray = {tennisBall: 0.65}

// These constants are scalar quantities representing the elasticity of it's collisions. (0 <= e <= 1) Where 0 is perfectly inelastic and 1 is perfectly elastic
const CoR_Array = { perfectlyInelastic: 0.0, baseBall: 0.546, tennisBall: 0.79919, perfectlyElastic: 1.0 };
const coefficientOfRestitution = CoR_Array.tennisBall;

const massArray = { tennisBall: 0.057, baseBall: 0.145 } // kg
const ballMass = massArray.tennisBall;

//const ballHitPaddle = (positionBall, positionPaddle) => {}

const degreesToRadians = (angleInDegrees) => {
  return angleInDegrees * (Math.PI / 180);
}

const getPaddleXComponent = (angleInDegrees, paddleWidth) => {
  const angleInRadians = degreesToRadians(angleInDegrees);
  
  return Math.abs(paddleWidth * Math.cos(angleInRadians));
}

const getPaddleYComponent = (angleInDegrees, paddleWidth, paddleHeight) => {
  const angleInRadians = degreesToRadians(angleInDegrees);

  return Math.abs(paddleHeight + (paddleWidth * Math.sin(angleInRadians)));
}

const getDrag = (vel) => {



}

const roundDecimal = (number, decimalPlaces) => {
  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

const updateVelocity = (vel) => {
  return {x: vel.x, y: vel.y + gravity};
}

const updatePosition = (position, vel) => {
  return {
    x: position.x + vel.x,
    y: position.y + vel.y
  };
}

const handleCollisions = (positionBall, vel, windowSize, ballSize) => {
  let newPos = { ...positionBall };
  let newVel = { ...vel };

  // Floor
  if (newPos.y + ballSize >= windowSize.height) {
    newPos.y = windowSize.height - ballSize;
    newVel.y *= -coefficientOfRestitution;
  }
  
  // Ceiling
  if (newPos.y <= 0) {
    newPos.y = 0;
    newVel.y *= -coefficientOfRestitution;
  }

  // Right
  if (newPos.x + ballSize >= windowSize.width) {
    newPos.x = windowSize.width - ballSize;
    newVel.x *= -coefficientOfRestitution;
  }

  // Left
  if (newPos.x <= 0) {
    newPos.x = ballSize;
    newVel.x *= -coefficientOfRestitution;
  }

  return { positionBall: newPos, vel: newVel };
}

const App = () => {  
  var paddleRef = useRef();
  var ballRef = useRef();

  const [ballSize, setBallSize] = useState(0);
  const [positionBall, setBallPosition] = useState({ x: positionXinit, y: positionYinit });
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
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      if (paddleRef.current) {
        setPaddleWidth(paddleRef.current.offsetWidth);
        setPaddleHeight(paddleRef.current.offsetHeight);
      } else {
        console.log("paddleRef.current does not exist.");
      }

      if (ballRef.current) { 
        setBallSize(ballRef.current.offsetWidth); 
      } else { 
        console.log("ballRef.current does not exist."); 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Physics Loop
  useEffect(() => {
  if (!isGameStarted) return;

  const interval = setInterval(() => {
    setBallPosition(prevPos => {
      let paddleXComponent = getPaddleXComponent(angle, paddleWidth);
      let newVel = updateVelocity(vel.current);
      let newPos = updatePosition(prevPos, newVel);
      ({ positionBall: newPos, vel: newVel } = handleCollisions(newPos, newVel, windowSize, ballSize));

      vel.current = newVel;
      return newPos;
    });
  }, intervalDelay);

  return () => clearInterval(interval);
  }, [isGameStarted, ballSize, windowSize]);


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
          Velocity: X: { roundDecimal(vel.current.x, roundTo) }px/s Y: { roundDecimal(vel.current.y, roundTo) }px/s Ball Size: {ballSize}px Paddle X Component: { roundDecimal(getPaddleXComponent(angle, paddleWidth, paddleHeight), roundTo) }px Paddle Y Component: { roundDecimal(getPaddleYComponent(angle, paddleWidth), roundTo)}px
        </p>
        
        <Ball ref={ ballRef } style={{ position: 'absolute', left: `${positionBall.x}px`, top: `${positionBall.y}px` }}/>
        <Paddle ref={ paddleRef } angle={ angle } />
      </div>
    </>
  );
}

export default App;