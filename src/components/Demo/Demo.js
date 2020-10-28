import React from 'react';

const Demo = (props) => {
    return(
        <div>
            <input onChange={props.yo} />
            <p>{'this is a demo and passed props are ' + props.yo+ 'the end'}</p>
        </div>
    );
}
export default Demo;