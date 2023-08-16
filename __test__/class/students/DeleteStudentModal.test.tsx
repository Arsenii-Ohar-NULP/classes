import React from 'react';
import {renderWithProviders} from "../../testUtils";
import DeleteStudentModal from "../../../components/class/students/DeleteStudentModal";
import {act} from "react-dom/test-utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {removeStudentFromClass} from "../../../components/class/students/StudentsService";

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
      replace: pushMock
  }),
}));
jest.mock('components/class/students/StudentsService');

describe('Delete Student Modal', () => {
    it('should remove student from class, when OK button is pressed', async () => {
        const classUser = {class: 1, student: 1};
        const onDelete = jest.fn();
        const show = true;
        const close = jest.fn();

        jest.mocked(removeStudentFromClass).mockReturnValue(Promise.resolve());
        renderWithProviders(<DeleteStudentModal classUser={classUser} onDelete={onDelete} show={show} close={close}/>);

        await act(async () => {
            const button = await screen.findByText('Delete');
            fireEvent.click(button);
        })

        await waitFor(() => {
            expect(jest.mocked(removeStudentFromClass)).toHaveBeenCalled();
            expect(onDelete).toHaveBeenCalled();
            expect(close).toHaveBeenCalled();
        })
    })
})