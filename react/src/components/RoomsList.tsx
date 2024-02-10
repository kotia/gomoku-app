import {memo} from "react";
import {getSocket} from "../socket.ts";
import {useRoomsStore} from "../store/store.ts";

const RoomsListContainer = () => {
    const socket = getSocket();

    const rooms = useRoomsStore((state) => state.rooms);

    const createRoom = (isWhite: boolean) => () => {
        socket.emit('room:create', isWhite);
    }

    const chooseRoom = (id: string) => () => {
        socket.emit('room:choose', id);
    };

    return (
        <div>
            <div className="create-room-buttons">
                <button data-color="white" onClick={createRoom(true)}>Create room with you as White!</button>
                <button data-color="black" onClick={createRoom(false)}>Create room with you as Black!</button>
            </div>
            <div className="rooms-list">
                {rooms.filter((room) => !room.isFinished).map((room, index) => {
                    return (
                        <div className="rooms-list__room"
                             onClick={chooseRoom(room.id)}
                             key={index}
                        >
                            {room.creatorName || room.id}: {'You play ' + (room.creatorIsWhite ? 'black' : 'white')}
                        </div>
                    );
                })}
            </div>
        </div>
    );

}

export default memo(RoomsListContainer);