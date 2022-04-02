
import {roomsListStateSetter, roomStateSetter, userStateSetter} from "./store";
import io from "socket.io-client";
import {useState} from "react";

let socket;

export const getSocket = () => {
    if (!socket) {
        const host = window.location.origin
            .replace(/^http/, 'ws')
            .replace(/:\d+/, ':5001');

        console.log('io connect');
        socket = io.connect(host, {
            transports: ["polling"]
        });
    }

    return socket;
};

export function useRecoilMiddleware() {
    const [saveRooms] = roomsListStateSetter();
    const [enterRoom, updateRoom, winGame, defeatGame, gameImpossible, exitRoom] = roomStateSetter();
    const [setUserName, setUserId] = userStateSetter();
    const [didInit, setDidInit] = useState(false);

    const userId = window.localStorage.userId;

    const socket = getSocket();

    socket.on('give:id', (id) => {
        console.log(window.localStorage.userId, id);
        setUserId(id);
        window.localStorage.userId = id;
    });

    socket.on('give:name', (name) => {
        setUserName(name);
    });

    socket.on('rooms:list', (rooms) => {
        saveRooms(rooms);
    });

    socket.on('room:enter', (room) => {
        enterRoom(room);
    });

    socket.on('room:update', (room) => {
        updateRoom(room);
    });

    socket.on('room:impossible', () => {
        gameImpossible();
    });

    socket.on('room:victory', () => {
        winGame();
    });

    socket.on('room:defeat', () => {
        defeatGame();
    });

    socket.on('room:exit', () => {
        exitRoom();
    });

    const init = () => {
        if (!didInit) {
            setDidInit(true);
            socket.emit('page:loaded', userId || 'no');
        }

    }

    return [init];
}