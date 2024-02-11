import {getSocket} from "../socket.ts";
import {useShallow} from 'zustand/react/shallow'
import {useRoomsStore, useUserStore} from "../store/store.ts";
import {useEffect, useRef} from "react";
import {IBackendRoomState} from "../types/types.ts";

export const useSocketEvents = () => {
    const userId = window.localStorage.userId;
    const socket = getSocket();
    const isUserLoaded = useRef(false);

    const {
        newRoom,
        enterRoom,
        defeatGame,
        winGame,
        exitRoom,
        makeImpossible,
        updateRoom
    } = useRoomsStore(
        useShallow(
            ({
                 newRoom,
                 enterRoom,
                 defeatGame,
                 winGame,
                 exitRoom,
                 makeImpossible,
                 updateRoom
             }) => ({
                newRoom,
                enterRoom,
                defeatGame,
                winGame,
                exitRoom,
                makeImpossible,
                updateRoom
            })));

    const {setUsername, setUserId} = useUserStore(useShallow(({setUsername, setUserId}) => ({setUsername, setUserId})));

    useEffect(() => {

        if (!isUserLoaded.current) {
            socket.emit('page:loaded', userId || 'no');

            isUserLoaded.current = true;

            socket.on('rooms:list', (rooms: IBackendRoomState[]) => {
                rooms.forEach((room) => newRoom(room));
            });

            socket.on('room:enter', (room) => {
                newRoom(room);
                enterRoom(room.id);
            });

            socket.on('room:update', (room) => {
                updateRoom(room);
            });

            socket.on('room:impossible', () => {
                makeImpossible();
            });

            socket.on('room:victory', () => {
                winGame();
            });

            socket.on('room:defeat', () => {
                defeatGame();
            });

            socket.on('room:exit', (id?: string) => {
                exitRoom(id);
            });

            socket.on('give:id', (id) => {
                setUserId(id);
                window.localStorage.userId = id;
            });

            socket.on('give:name', (name) => {
                setUsername(name);
            });
        }
    }, []);
};