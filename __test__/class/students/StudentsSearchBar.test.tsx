import React from 'react';
import {StudentsSearchBar} from "../../../components/class/students/StudentsSearchBar";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {useDispatch} from "react-redux";
    jest.mock('react-redux');

describe('Students Search Bar', () => {
    it('should match a snapshot', () => {
        jest.mocked(useDispatch).mockReturnValue(jest.fn());
        const searchBar = render(<StudentsSearchBar/>)
        expect(searchBar).toMatchSnapshot();
    })

    it('should dispatch `search students`, when field has been changed', async () => {
        const dispatch = jest.fn();
        jest.mocked(useDispatch).mockReturnValue(dispatch);
        render(<StudentsSearchBar/>);
        const input = await screen.findByPlaceholderText('Search for a student');
        fireEvent.change(input, {target: {value: 'Hello'}});

        await waitFor(() => {
            expect(dispatch).toBeCalledTimes(2);
        });
    })
})