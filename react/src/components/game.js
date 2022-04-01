import * as React from "react";

import RoomsList from "./roomsList";
import Room from "./room";
import UserField from "./userfield";
import {useRecoilMiddleware} from "../recoilMiddleware";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {roomSelector} from "../store";

const GameContainer = () => {
    const [init] = useRecoilMiddleware();

    const [room] = useRecoilState(roomSelector);


    useEffect(() => {
        init();
    }, [init]);

    return (
        <div>
            <UserField />
            {room.table ? <Room /> : <RoomsList />}
        </div>
    )
}



export default GameContainer;
