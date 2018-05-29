/**
 * Created by eugene on 27.05.2018.
 */
import React from 'react';

import { shallow } from 'enzyme';
import { GameContainer } from '../components/game';
import * as mocks from './mocks';

describe('Game component', () => {

    it('renders user info component and room if room is not empty', () => {
        const component = shallow(<GameContainer
            user={mocks.user}
            room={mocks.room}
        />);
        expect(component.text()).toContain('UserField');
        expect(component.text()).toContain('(Room)');
    });

    it('renders user info component and rooms list if room is empty', () => {
        const component = shallow(<GameContainer
            user={mocks.user}
            room={{}}
        />);
        expect(component.text()).toContain('UserField');
        expect(component.text()).toContain('(RoomsList');
    });
});


