import * as React from 'react';
import Button from 'react-bootstrap/Button';

function SaveEditButton({handleClick, isSaving}: {handleClick: VoidFunction, isSaving: boolean}) {
    return ( 
        <Button variant='success' type='submit' onClick={handleClick} disabled={isSaving}>
            Save
        </Button>
     );
}

export default SaveEditButton;