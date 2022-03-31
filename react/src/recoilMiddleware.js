
import io from "socket.io-client";
import {roomsListStateSetter, roomStateSetter, userStateSetter} from "./store";

export function useRecoilMiddleware() {
    const [saveRooms] = roomsListStateSetter();
    const [enterRoom, updateRoom, winGame, defeatGame, gameImpossible, exitRoom] = roomStateSetter();
    const [setUserName, setUserId] = userStateSetter();

    const userId = window.localStorage.userId;
    const host = window.location.origin
        .replace(/^http/, 'ws')
        .replace(/:\d+/, ':5001');

    const socket = io.connect(host, {
        transports: ["websocket", "polling"]
    });

    socket.on('give:id', (id) => {
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
        socket.emit('page:loaded', userId || 'no');
    }

    return [init];
}