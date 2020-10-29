import React from 'react';

const FaceRecognition = (props) => {
    const imgUrl = props.imgUrl;
    return (
        <div className='center ma'>
            <div className = 'absolute mt2'>
                <img id='inputimage' src={imgUrl} alt={''} width='500px' height='auto'/>
            </div>
        </div>
    );
}
export default FaceRecognition;
