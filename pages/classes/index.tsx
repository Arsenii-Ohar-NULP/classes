import React, { useState, useContext, useEffect } from 'react';
import Class from './Class';
import { useClassRepository, useLoginRedirect } from '../hooks';
function ClassUI({cls}: {cls: Class}){
    return <div className="text-center m-2">
        <p>{cls.title}</p>
    </div>;
}
export default function Classes() {
    useLoginRedirect();
    
    const classRepository = useClassRepository();
    const [classes, initClasses] = useState<Class[]>([]);

    const loadClasses = async () => {
        const loadedClasses = await classRepository.findAll();
        initClasses(loadedClasses);
    }
    useEffect(() => {
        if (!classes){
            loadClasses();
        }
    })
    return <div>
        <div>
            {classes.map((cls) => <ClassUI key={cls.id} cls={cls}/>)}
        </div>
    </div>;
}