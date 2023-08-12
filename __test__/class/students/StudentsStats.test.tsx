import React from 'react';
import {renderWithProviders} from "../../testUtils";
import {StudentsStats} from "../../../components/class/students/StudentsStats";
import {waitFor} from "@testing-library/react";
import {sampleFiveUsers} from "../../data/user";

describe('Students Stats', ( )=> {
    it('should return nothing, when students number is null', async () => {
        const students = null;
        const {container} = renderWithProviders(<StudentsStats students={students}/>);

        await waitFor(() => {
            expect(container).toBeEmptyDOMElement();
        })
    })

    it('should match a snapshot, when students number is not 0 or null', async () => {
        const {container} = renderWithProviders(<StudentsStats students={sampleFiveUsers}/>);

        await waitFor(() => {
            expect(container).toMatchSnapshot();
        })
    })
})