import React from 'react';
import {renderWithProviders} from "../../testUtils";
import {sampleUser} from "../../data/user";
import {StudentCard} from "../../../components/class/students/StudentCard";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {act} from "react-dom/test-utils";

describe('Student Card', () => {
    it('should match a snapshot', () => {
        const user = sampleUser;
        const onDelete = jest.fn();
        const card = renderWithProviders(<StudentCard student={user} onDelete={onDelete}/>);

        expect(card).toMatchSnapshot();
    })

    it('should output user info', () => {
        const user = sampleUser;
        const onDelete = jest.fn();
        renderWithProviders(<StudentCard student={user} onDelete={onDelete}/>);
        screen.findByText(`${user.firstName} ${user.lastName}`);
        screen.findByText(user.email);
        screen.findByText(user.phone);
    })

    it('should show delete button, when the mouse is over card', async () => {
        const user = sampleUser;
        const onDelete = jest.fn();
        renderWithProviders(<StudentCard student={user} onDelete={onDelete}/>);
        fireEvent.mouseOver(screen.getByRole('row'));

        await waitFor(() => {
            const button = screen.getByTestId('invisible-button');
            expect(button).toHaveStyle('visibility: visible');
        })
    })

    it('should have invisible delete button, when mouse is not over the card', async () => {
         const user = sampleUser;
        const onDelete = jest.fn();
        renderWithProviders(<StudentCard student={user} onDelete={onDelete}/>);
        await act(async () => {
        fireEvent.mouseOut(await screen.findByTestId('student-card'));
        })
        await waitFor(() => {
            const button = screen.getByTestId('invisible-button');
            expect(button).toHaveClass('invisible');
        })
    })
})