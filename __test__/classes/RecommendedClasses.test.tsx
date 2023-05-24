import { renderWithProviders } from '__test__/testUtils';
import React from 'react';
import RecommendedClasses from 'pages/classes/RecommendedClasses';
import { findAllClasses } from 'pages/class/ClassService';
import { ClassUI } from 'pages/classes/ClassUI';
import { screen, waitFor } from '@testing-library/react';
import { sampleFiveClasses } from '__test__/data/classes';
import ClassMock from './ClassMock';

jest.mock('pages/class/ClassService');
jest.mock('pages/classes/ClassUI');

describe('recommended classes tests', () => {
  it('when findAllClasses returns 5 classes, render 5 classes', () => {
    const classes = [...sampleFiveClasses];
    jest
      .mocked(findAllClasses)
      .mockImplementationOnce(() => Promise.resolve(classes));
    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    renderWithProviders(<RecommendedClasses />);
    for (const cls of classes) {
      screen.findByText(cls.title);
    }
  });

  it("when findAllClasses returns 0 classes, don't render any", async () => {
    const classes = [];
    jest
      .mocked(findAllClasses)
      .mockImplementationOnce(() => Promise.resolve(classes));
    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    renderWithProviders(<RecommendedClasses />);
    await waitFor(() =>
      expect(screen.queryByTestId('recommended-div')).toBeEmptyDOMElement()
    );
  });
});
