import { renderWithProviders } from '__test__/testUtils';
import React from 'react';
import RecommendedClasses from 'components/classes/RecommendedClasses';
import { findAllClasses } from 'components/class/ClassService';
import { ClassUI } from 'components/classes/ClassUI';
import { screen, waitFor } from '@testing-library/react';
import { sampleFiveClasses } from '__test__/data/classes';
import ClassMock from './ClassMock';
import {server} from "../api/server";
import {rest} from "msw";
import {CLASSES_API_URL} from "components/redux/utils";
import Class from "components/classes/Class";

jest.mock('components/class/ClassService');
jest.mock('components/classes/ClassUI');

describe('recommended classes tests', () => {
  const mockApiClasses = (classes: Class[]) => {
    server.use(rest.get(`${CLASSES_API_URL}/class`, (req, res, ctx) =>
        res(ctx.json(classes), ctx.status(200))
    ));
  }
  it('when findAllClasses returns 5 classes, render 5 classes', () => {
    const classes = [...sampleFiveClasses];
    mockApiClasses(classes);

    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    renderWithProviders(<RecommendedClasses />);
    for (const cls of classes) {
      screen.findByText(cls.title);
    }
  });

  it("when findAllClasses returns 0 classes, don't render any", async () => {
    const classes = [];
    mockApiClasses(classes);

    jest.mocked(ClassUI).mockImplementationOnce(ClassMock);
    renderWithProviders(<RecommendedClasses />);
    await waitFor(() =>
      expect(screen.queryByTestId('recommended-classes-empty')).toBeInTheDocument()
    );
  });
});
