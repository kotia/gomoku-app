import {memo, useCallback} from "react";
import {IRoomState} from "../types/types.ts";
import {getSocket} from "../socket.ts";

const RoomInfo = ({room, isTurn, isWhite}: {room: IRoomState, isTurn: boolean, isWhite: boolean}) => {
    const socket = getSocket();

    const onExitRoom = useCallback(() => {
        socket.emit('room:exit');
    }, []);

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

export default memo(RoomInfo);