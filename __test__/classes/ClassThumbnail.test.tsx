import * as React from 'react';

import {renderWithProviders} from '__test__/testUtils';
import ClassThumbnail from 'components/classes/ClassThumbnail';
import {sampleFiveClasses} from '__test__/data/classes';
import {screen, waitFor} from '@testing-library/react';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "components/redux/utils";

jest.mock('components/header/ClassThumbnailService');
describe('class thumbnail', () => {
    it('should render a pic, when fetched', async () => {
        const cls = sampleFiveClasses[0];
        const data = 'CLSDATA123';
        server.use(rest.get(`${CLASSES_API_URL}/class/img/${cls.id}`, (req, res, ctx) =>
            res(ctx.status(200), ctx.json({thumbnail: data}))
        ))
        renderWithProviders(<ClassThumbnail cls={cls}/>);

        await waitFor(() => {
            const image = screen.getByTestId('thumbnail');
            expect(image).toHaveAttribute('src', `data:image/png; base64, ${data}`);
        });
    });
});
