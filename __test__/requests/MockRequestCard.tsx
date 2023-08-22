import * as React from 'react';

export function MockRequestCard({
                                    userId,
                                    classId,
                                    onResolved
                                }: {
    userId: number;
    classId: number;
    onResolved: VoidFunction;
}){
    return <div>
        {userId}-{classId}
    </div>;
}
