import * as React from 'react';
import Button from 'react-bootstrap/Button';

export default function EditClassButton({handleClick}: {handleClick: VoidFunction}){
    return <Button variant='primary' onClick={handleClick} className='m-2'>Edit</Button>
    
}