import * as React from 'react';
import Button from 'react-bootstrap/Button'

function CancelEditButton({ handleClick, isSaving }: {handleClick: VoidFunction, isSaving: boolean}) {
    return ( 
        <Button variant='danger' onClick={handleClick} disabled={isSaving}>
            Cancel
        </Button>
     );
}

export default CancelEditButton;