"use strict";
import * as React from "react";
import { connect } from 'react-redux';
import {createRoom, chooseRoom} from "../actions";

const CreateRoomButtons = ({createRoom}) => {
    return (
        <div className="create-room-buttons">
            <button data-color="white" onClick={createRoom}>Create room with you as White!</button>
            <button data-color="black" onClick={createRoom}>Create room with you as Black!</button>
        </div>
    );
}

const RoomsList = ({rooms, chooseRoom}) => {
    return (
        <div className="rooms-list">
            {rooms.map((room, index) => {
                return(
                    <div className="rooms-list__room"
                         onClick={chooseRoom}
                         data-id={room.id}
                         key={index}
                    >
                        {room.creatorName || room.id}: {'You play ' + (room.isYouWhite ? 'white' : 'black')}
                    </div>
                );
            })}
        </div>
    );
}

const RoomsListContainer = ({rooms}) => {

    const createRoom = (e) => {
        const isWhite = e.currentTarget.dataset.color === 'white';
        this.props.onCreateRoom(isWhite);
    }

    const chooseRoom = (e) => {
        this.props.onChooseRoom(e.currentTarget.dataset.id);
    }

        return (
            <div>
                <CreateRoomButtons createRoom={createRoom}/>
                <RoomsList chooseRoom={chooseRoom} rooms={rooms}/>
            </div>

        );

}

const mapStateToProps = (store) => ({
    rooms: store.rooms
});

const mapDispatchToProps = (dispatch) => ({
    onCreateRoom(isWhite) {
        dispatch(createRoom(isWhite));
    },
    onChooseRoom(id) {
        dispatch(chooseRoom(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsListContainer);