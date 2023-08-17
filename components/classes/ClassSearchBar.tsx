"use client"
import clsx from 'clsx';
import { searchActions } from 'components/redux/search';
import { useAppDispatch } from 'components/redux/store';
import React, { FunctionComponent, useEffect } from 'react';

const ClassSearchBar: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(searchActions.searchClasses(null));
  }, [])

  return (
    <div className={'container my-2 w-100'}>
    <input
      type="text"
      placeholder={'Search for a class'}
      className="form-control"
      onChange={(e) => dispatch(searchActions.searchClasses(e.target.value))}
    />
    </div>
  );
};

export default ClassSearchBar;
