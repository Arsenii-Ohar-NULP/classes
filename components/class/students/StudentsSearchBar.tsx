import React, {ChangeEvent, useEffect} from 'react';
import {FormControl} from "react-bootstrap";
import {useAppDispatch} from "../../redux/store";
import {searchActions} from "../../redux/search";


export const StudentsSearchBar = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(searchActions.searchStudents(null));

        return () => {
            dispatch(searchActions.searchStudents(null));
        }
    }, [])

    const onFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(searchActions.searchStudents(e.target.value));
    }

    return <FormControl className={'mb-3'}
                        type={'text'}
                        onChange={onFieldChange}
                        placeholder={'Search for a student'}
    />

}