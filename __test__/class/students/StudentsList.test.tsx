import React from 'react';
import {sampleFiveClasses} from "../../data/classes";
import {renderWithProviders} from "../../testUtils";
import {StudentsList} from "../../../components/class/students/StudentsList";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {sampleFiveUsers } from "../../data/user";
import {act} from "react-dom/test-utils";

const navigateMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    pathname: '/',
  }),
}));

describe('Students List', () => {
    it('should match a snapshot, when students are loaded', () => {
         const students = sampleFiveUsers;
        const isLoading = false;
        const cls = sampleFiveClasses[0];
        const onDelete = jest.fn();

        const {container} = renderWithProviders(<StudentsList isLoading={isLoading} students={students} cls={cls.id} onDelete={onDelete}/>);

        expect(container).toMatchSnapshot();
    })

    it('should return nothing, when students are loading(being fetched)', async () => {
        const isLoading = true;
        const students = null;
        const cls = sampleFiveClasses[0];
        const onDelete = null;

        const {container} = renderWithProviders(<StudentsList isLoading={isLoading}
                                          students={students}
                                          cls={cls.id}
                                          onDelete={onDelete}/> );



        await waitFor(() => {
            expect(container).toBeEmptyDOMElement();
        })
    });

    it('should return table with students info, when students are loaded', async () => {
        const students = sampleFiveUsers;
        const isLoading = false;
        const cls = sampleFiveClasses[0];
        const onDelete = jest.fn();

        renderWithProviders(<StudentsList isLoading={isLoading} students={students} cls={cls.id} onDelete={onDelete}/>);
        await waitFor(() => {
            for (const student of students){
                screen.findByText(`${student.firstName} ${student.lastName}`);
            }
        })
    })

    it('should show modal, when delete button of a student card is clicked', async () => {
        const students = sampleFiveUsers.slice(0, 1);
        const isLoading = false;
        const cls = sampleFiveClasses[0];
        const onDelete = jest.fn();

        renderWithProviders(<StudentsList isLoading={isLoading} students={students} cls={cls.id} onDelete={onDelete}/>);
        await act(async () =>  {
            const button = await screen.findByRole('button');
            fireEvent.click(button);
        })

        await waitFor(async () => {
            await screen.findByRole('dialog');
        })
    })
})

