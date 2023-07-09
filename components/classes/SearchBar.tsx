import clsx from 'clsx';
import { searchActions } from 'components/redux/search';
import { useAppDispatch } from 'components/redux/store';
import React, { FunctionComponent, useEffect } from 'react';
interface SearchBarProps {}

const SearchBar: FunctionComponent<SearchBarProps> = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(searchActions.searchClasses(null));
  }, [])

  return (
    <div className={clsx('container', 'my-2', 'w-100')}>
    <input
      type="text"
      placeholder={'Search for a class'}
      className="form-control"
      onChange={(e) => dispatch(searchActions.searchClasses(e.target.value))}
    />
    </div>
  );
};

export default SearchBar;
