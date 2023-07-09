import * as React from 'react';

import { renderWithProviders } from '__test__/testUtils';
import ClassThumbnail from 'components/classes/ClassThumbnail';
import { findClassThumbnail } from 'components/header/ClassThumbnailService';
import { sampleFiveClasses } from '__test__/data/classes';
import { screen, waitFor } from '@testing-library/react';

jest.mock('components/header/ClassThumbnailService');
describe('class thumbnail', () => {
  it('should render a pic, when fetched', async () => {
    const data = 'CLSDATA123';
    jest.mocked(findClassThumbnail).mockResolvedValue(data);
    renderWithProviders(<ClassThumbnail cls={sampleFiveClasses[0]} />);

    await waitFor(() => {
      const image = screen.getByTestId('thumbnail');
      expect(image).toHaveAttribute('src', `data:image/png; base64, ${data}`);
    });
  });
});
