import React from 'react';
import '../App.css';
const Ball = React.forwardRef(( props, ballRef ) =>  {
    return <div className="ball" ref={ballRef} style={props.style}/>;
})

export default Ball;