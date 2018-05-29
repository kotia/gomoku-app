import * as React from "react";
import { connect } from 'react-redux';

import RoomsList from "./roomsList";
import Room from "./room";
import UserField from "./userfield";

export class GameContainer extends React.Component {
    render() {
        return (
            <div>
                <UserField />
                {this.props.room.table ? <Room /> : <RoomsList />}
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    room: store.room
});

export default connect(mapStateToProps)(GameContainer);
