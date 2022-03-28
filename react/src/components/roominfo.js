"use strict";
import * as React from "react";
import { connect } from 'react-redux';

import {
    sendExitRoom
} from "../actions";
import { userIsWhite, isUserTurn } from '../getUserInfo';

const RoomInfo = (props) => {
    const { room,onExitRoom } = props;

    return (
        <div className="gomoku-container__info">
            <button onClick={onExitRoom}>Exit this room!</button>
            <br/>
            {'Your color is ' + (userIsWhite(props) ? 'white' : 'black')}
            <br/>
            {'Creator name: ' + room.creatorName}
            <br/>
            {room.started ?
                ("Opponent name: " + room.opponentName) :
                ""
            }
            <br />
            {room.isFinished ? "" : room.started ?
                (isUserTurn(props) ? "Now it's your turn" : "waiting for opponents turn") :
                "Waiting for someone to connect"
            }
            <br />
            {room.isWin ? <span style={{color:'green'}}>You are winner!</span> : ''}
            {room.isDefeat ? <span style={{color:'red'}}>Sorry, you lost!</span> : ''}
            {room.isImpossible ? <span style={{color:'red'}}>Sorry, no one won!</span> : ''}
        </div>
    )

}

const mapStateToProps = (store) => ({
    room: store.room,
    user: store.user
});

const mapDispatchToProps = (dispatch) => ({
    onExitRoom() {
        dispatch(sendExitRoom());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomInfo);