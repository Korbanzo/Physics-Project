import React from 'react';
import '../App.css';
import perfectlyElasticBackground from '../Balls/perfectlyElasticBackground.webp';
import tennisBallBackground from '../Balls/tennisBallBackground.jpg';
import baseballBackground from '../Balls/baseballBackground.webp';

const Ball = React.forwardRef(( {style, ballType}, ballRef ) =>  {
    let ballBackground;
    let zoomAmount; 

    if (ballType === "Perfectly Elastic") {
        ballBackground = perfectlyElasticBackground;
        zoomAmount = 150;

    } else if (ballType === 'Tennis') {
        ballBackground = tennisBallBackground
        zoomAmount = 120;

    } else if (ballType === 'Baseball') {
        ballBackground = baseballBackground;
        zoomAmount = 165;
    } else if (ballType === "Perfectly Inelastic") {
        ballBackground = baseballBackground;
        zoomAmount = 165;
    }


    return <div className="ball" ref={ballRef} ballType={ballType} style={{backgroundImage: `url(${ballBackground})`, backgroundSize: `${zoomAmount}%` ,...style}}/>;
})

export default Ball;