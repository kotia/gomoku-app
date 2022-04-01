"use strict";
import * as React from "react";

import { userIsWhite, isUserTurn } from '../getUserInfo';
import {useRecoilState} from "recoil";
import {roomSelector} from "../store";

const RoomInfo = () => {

    const [room, roomAction] = useRecoilState(roomSelector);
    const [isWhite] = useRecoilState(userIsWhite);
    const [isTurn] = useRecoilState(isUserTurn);


    const onExitRoom = () => {
        roomAction({ type: 'exit_room' });
    };


    return (
        <div className="gomoku-container__info">
            <button onClick={onExitRoom}>Exit this room!</button>
            <br/>
            {'Your color is ' + (isWhite ? 'white' : 'black')}
            <br/>
            {'Creator name: ' + room.creatorName}
            <br/>
            {room.started ?
                ("Opponent name: " + room.opponentName) :
                ""
            }
            <br />
            {room.isFinished ? "" : room.started ?
                (isTurn ? "Now it's your turn" : "waiting for opponents turn") :
                "Waiting for someone to connect"
            }
            <br />
            {room.isWin ? <span style={{color:'green'}}>You are winner!</span> : ''}
            {room.isDefeat ? <span style={{color:'red'}}>Sorry, you lost!</span> : ''}
            {room.isImpossible ? <span style={{color:'red'}}>Sorry, no one won!</span> : ''}
        </div>
    );
}

export default RoomInfo;