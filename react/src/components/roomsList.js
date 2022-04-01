"use strict";
import * as React from "react";
import {useRecoilState} from "recoil";
import {roomSelector, roomsListSelector} from "../store";

const CreateRoomButtons = ({createRoom}) => {
    return (
        <div className="create-room-buttons">
            <button data-color="white" onClick={createRoom(true)}>Create room with you as White!</button>
            <button data-color="black" onClick={createRoom(false)}>Create room with you as Black!</button>
        </div>
    );
}

const RoomsList = ({rooms, chooseRoom}) => {

    return (
        <div className="rooms-list">
            {rooms.map((room, index) => {
                return(
                    <div className="rooms-list__room"
                         onClick={chooseRoom(room.id)}
                         key={index}
                    >
                        {room.creatorName || room.id}: {'You play ' + (room.isYouWhite ? 'white' : 'black')}
                    </div>
                );
            })}
        </div>
    );
}

const RoomsListContainer = () => {

    const [rooms, roomsListAction] = useRecoilState(roomsListSelector);
    const [, roomAction] = useRecoilState(roomSelector);

    const createRoom = (isWhite) => () => {
        roomsListAction({
            type: 'create_room',
            payload: {
                isWhite
            }
        })
    }

    const chooseRoom = (id) => () => {
        roomAction({
            type: 'choose_room',
            payload: {
                id
            }
        });
    };

        return (
            <div>
                <CreateRoomButtons createRoom={createRoom}/>
                <RoomsList chooseRoom={chooseRoom} rooms={rooms}/>
            </div>

        );

}

export default RoomsListContainer;