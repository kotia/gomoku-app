"use strict";
import * as React from "react";
import { connect } from 'react-redux';


import {
    sendExitRoom
} from "../actions";
import { userIsWhite, isUserTurn } from '../getUserInfo';

export class RoomInfo extends React.Component {

    render() {

        return (
            <div className="gomoku-container__info">
                <button onClick={this.props.onExitRoom}>Exit this room!</button>
                <br/>
                {'Your color is ' + (userIsWhite(this.props) ? 'white' : 'black')}
                <br/>
                {'Creator name: ' + this.props.room.creatorName}
                <br/>
                {this.props.room.started ?
                    ("Opponent name: " + this.props.room.opponentName) :
                    ""
                }
                <br />
                {this.props.room.isFinished ? "" : this.props.room.started ?
                    (isUserTurn(this.props) ? "Now it's your turn" : "waiting for opponents turn") :
                    "Waiting for someone to connect"
                }
                <br />
                {this.props.room.isWin ? <span style={{color:'green'}}>You are winner!</span> : ''}
                {this.props.room.isDefeat ? <span style={{color:'red'}}>Sorry, you lost!</span> : ''}
                {this.props.room.isImpossible ? <span style={{color:'red'}}>Sorry, no one won!</span> : ''}
            </div>
        )
    }
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