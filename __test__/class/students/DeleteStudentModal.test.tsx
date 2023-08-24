import React from 'react';
import {renderWithProviders} from "../../testUtils";
import DeleteStudentModal from "../../../components/class/students/DeleteStudentModal";
import {act} from "react-dom/test-utils";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {server} from "../../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "../../../components/redux/utils";

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: pushMock
    }),
}));

describe('Delete Student Modal', () => {
    it('should remove student from class, when OK button is pressed', async () => {
        server.use(rest.delete(`${CLASSES_API_URL}/class/student`, (req, res, ctx) =>
            res(ctx.status(200))
        ))
        const classUser = {class: 1, student: 1};
        const onDelete = jest.fn();
        const show = true;
        const close = jest.fn();

        renderWithProviders(<DeleteStudentModal classUser={classUser} onDelete={onDelete} show={show} close={close}/>);

        await act(async () => {
            const button = await screen.findByText('Delete');
            fireEvent.click(button);
        })

        await waitFor(() => {
            expect(onDelete).toHaveBeenCalled();
            expect(close).toHaveBeenCalled();
        })
    })
})