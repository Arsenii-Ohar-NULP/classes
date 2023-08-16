import React from 'react';
import {renderWithProviders} from "../../testUtils";
import {DeleteStudentButton} from "../../../components/class/students/DeleteStudentButton";
import {fireEvent, screen, waitFor} from "@testing-library/react";

describe('Delete Student Button', () => {
    it('should match a snapshot', () => {
        const button = renderWithProviders(<DeleteStudentButton onDelete={jest.fn()}/>);
        expect(button).toMatchSnapshot();
    })
    it('should call onDelete, when clicked', async () => {
        const onDelete = jest.fn();
        renderWithProviders(<DeleteStudentButton onDelete={onDelete}/>);
        const deleteButton = screen.getByRole('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(onDelete).toHaveBeenCalled();
        })
    })
})