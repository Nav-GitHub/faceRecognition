import React from 'react';

const Rank = (props) => {
    const name = props.name;
    const entries = props.entries;
    return(
        <div>
            <div className='white f3'>
                {`${name} , Your current rank is...`}
            </div>
            <div className='white f3'>
                {entries}
            </div>
        </div>
    );
}
export default Rank;
