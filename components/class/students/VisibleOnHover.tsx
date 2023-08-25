import React, {ReactNode} from 'react';
import clsx from "clsx";

interface VisibleOnHoverProps {
    children: ReactNode;
    isHover: boolean;
}

export const VisibleOnHover = ({children, isHover}: VisibleOnHoverProps) => {
    return <div className={clsx(!isHover && 'invisible')} data-testid={'invisible-button'}>
        {children}
    </div>;
}