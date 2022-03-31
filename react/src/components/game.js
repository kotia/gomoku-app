import * as React from "react";
import { connect } from 'react-redux';

import RoomsList from "./roomsList";
import Room from "./room";
import UserField from "./userfield";
import {useRecoilMiddleware} from "../recoilMiddleware";
import {useEffect} from "react";
import {roomSelector, roomsListSelector, userSelector} from "../store";
import {useRecoilState} from "recoil";

const GameContainer = (props) => {
    const [init] = useRecoilMiddleware();

    const [roomsList, roomsListAction] = useRecoilState(roomsListSelector);
    const [room, roomAction] = useRecoilState(roomSelector);
    const [user, userAction] = useRecoilState(userSelector);

    console.log(roomsList);
    console.log(room);
    console.log(user);
    console.log('-------');

    useEffect(() => {
        init();
    }, [init]);

    return (
        <div>
            <UserField />
            {props.room.table ? <Room /> : <RoomsList />}
        </div>
    )
}

const mapStateToProps = (store) => ({
    room: store.room
});

export default connect(mapStateToProps)(GameContainer);
