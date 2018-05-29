'use strict';

import * as actions from '../actions';

it('Fetch rooms', () => {
  expect(actions.fetchRooms(10)).toEqual({type: actions.FETCH_ROOMS, rooms: 10});
});