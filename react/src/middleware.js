import {
    CREATE_ROOM, CHOOSE_ROOM, MAKE_TURN, SET_NAME, SEND_EXIT_ROOM,
    giveName, giveId, saveName, fetchRooms,
    enterRoom, updateRoom, impossibleGame, winGame, defeatGame, exitRoom
} from "./actions";
import io from "socket.io-client";

export function goMiddleware(store) {

    const userId = window.localStorage.userId;
    const kek = "ws://node:3001";
    const host = window.location.origin
        .replace(/^http/, 'ws')
        .replace(/:\d+/, ':3001');

    const socket = io.connect(host, {
        transports: ["polling", "websocket"]
    });

    socket.on('give:id', (id) => {
        store.dispatch(giveId(id));
        window.localStorage.userId = id;
    });

    socket.on('give:name', (name) => {
        store.dispatch(giveName(name));
        store.dispatch(saveName());
    });

    socket.on('rooms:list', (rooms) => {
        store.dispatch(fetchRooms(rooms));
    });

    socket.on('room:enter', (room) => {
        store.dispatch(enterRoom(room));
    });

    socket.on('room:update', (room) => {
        store.dispatch(updateRoom(room));
    });

    socket.on('room:impossible', () => {
        store.dispatch(impossibleGame());
    });

    socket.on('room:victory', () => {
        store.dispatch(winGame());
    });

    socket.on('room:defeat', () => {
        store.dispatch(defeatGame());
    });

    socket.on('room:exit', () => {
        store.dispatch(exitRoom());
    });

    socket.emit('page:loaded', userId || 'no');

    return next => action => {
        const storeData = store.getState();
        const result = next(action);

        switch(action.type) {
            case CREATE_ROOM:
                socket.emit('room:create', action.isWhite);
                break;
            case CHOOSE_ROOM:
                socket.emit('room:choose', action.id);
                break;
            case MAKE_TURN:
                socket.emit('room:makeTurn', action.id);
                break;
            case SET_NAME:
                socket.emit('name:set', storeData.user.name);
                break;
            case SEND_EXIT_ROOM:
                socket.emit('room:exit');
                break;
        }

        return result;
    }
}