import {useRoomsStore, useUserStore} from "../store/store.ts";
import {useShallow} from "zustand/react/shallow";
import {memo, useMemo} from "react";
import UserField from "./UserField.tsx";
import RoomTable from "./Room.tsx";
import RoomInfo from "./RoomInfo.tsx";
import RoomsList from "./RoomsList.tsx";

const Game = () => {

    const {rooms, activeRoom} = useRoomsStore(
        useShallow(
            ({
                rooms,
                activeRoom,
             }) => ({
                rooms,
                activeRoom,
            })));

    const userId = useUserStore((state) => state.userId);

    const activeRoomObj = useMemo(() => activeRoom ? rooms.find((room) => room.id === activeRoom) : undefined, [activeRoom, rooms]);

    const userIsCreator = userId === activeRoomObj?.creatorId;
    const userIsWhite = userIsCreator === activeRoomObj?.creatorIsWhite;
    const isUsersTurn = activeRoomObj?.isWhiteTurn === userIsWhite;

    return (
        <div>
            <UserField />
            <div className="gomoku-container">
                {activeRoomObj && <>
                    <RoomTable room={activeRoomObj} isTurn={isUsersTurn} />
                    <RoomInfo room={activeRoomObj} isTurn={isUsersTurn} isWhite={userIsWhite} />
                </>}
                {!activeRoomObj && <RoomsList />}
            </div>
        </div>
    )
}



export default memo(Game);
