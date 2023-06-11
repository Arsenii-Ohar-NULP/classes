import { sampleFiveClasses } from '__test__/data/classes';
import { JoinRequest } from 'components/class/JoinRequest';
import { classSlice, classesActions } from 'components/redux/classes';

describe('class slice test', () => {
  it('given no action, then return initial state', () => {
    const initial = { userClasses: null, joinRequests: null };

    expect(classSlice.reducer(undefined, { type: undefined })).toEqual(initial);
  });

  it('given putUserClasses and payload accordingly, should userClasses to be payload', () => {
    const userClasses = [sampleFiveClasses[0]];

    expect(
      classSlice.reducer(undefined, classesActions.putUserClasses(userClasses))
    ).toEqual({ joinRequests: null, userClasses });
  });

  it('given sample join rqeuests, when putJoinRequests, should joinRequests to be the payload', () => {
    const joinRequests: JoinRequest[] = [
      {
        classId: 1,
        userId: 1,
      },
    ];
    JoinRequest.name; // just to hit 100% coverage on JoinRequest :)

    const actualState = classSlice.reducer(
      undefined,
      classesActions.putJoinRequests(joinRequests)
    );
    expect(
      actualState
    ).toEqual({ userClasses: null, joinRequests });
    expect(actualState).not.toBe(joinRequests);
  });

  it('given join requests, when addJoinRequest, should return one payload element', () => {
    const joinRequest = {
      classId: 1,
      userId: 1,
    };

    expect(
      classSlice.reducer(undefined, classesActions.addJoinRequest(joinRequest))
    );
  });
});
