import React, { useState } from 'react';
import './ResizeBar.css';

export const cn = (...args: (string | boolean)[]) =>
    args.filter(Boolean).join(' ');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResizeBar = ({ id = 'drag-bar', dir, isDragging, ...props }: any) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div
            id={id}
            data-testid={id}
            className={cn(
                'sample-drag-bar',
                dir === 'horizontal' && 'sample-drag-bar--horizontal',
                (isDragging || isFocused) && 'sample-drag-bar--dragging',
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
};

export default ResizeBar;
