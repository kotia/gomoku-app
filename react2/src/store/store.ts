import {create} from 'zustand'
import {roomsSocketMiddleware, userSocketMiddleware} from "./socketMiddleware.ts";
import {IRooms, IUserState} from "../types/types.ts";

export const useRoomsStore = create<IRooms>()(roomsSocketMiddleware((setState) => ({
    rooms: [],
    activeRoom: '',
    newRoom: (roomProps) => setState((state) => {
        const newRoom = {...roomProps, isWin: false,
            isDefeat: false,
            isImpossible: false,
            isFinished: false };
        const currentRoom = state.rooms.find((room) => room.id === roomProps.id);
        return {
            ...state,
            lastAction: 'new_room',
            rooms: currentRoom ? state.rooms.map((room) => room.id === roomProps.id ? {...currentRoom, ...newRoom} : room) : [...state.rooms, newRoom],
        };
    }),
    enterRoom: (id) => setState((state) => ({
        ...state,
        activeRoom: id,
        lastAction: 'enter_room',
        rooms: state.rooms.map((room) => room.id === id ? {
            ...room,
            isWin: false,
            isDefeat: false,
            isImpossible: false,
            isFinished: false,
        } : room),
    })),
    updateRoom: (roomProps) => setState((state) => ({
        ...state,
        rooms: state.rooms.map((room) => room.id === state.activeRoom ? {...room, ...roomProps} : room),
    })),
    winGame: () => setState((state) => ({
        ...state,
        lastAction: 'win_game',
        rooms: state.rooms.map((room) => room.id === state.activeRoom ? {
            ...room,
            isWin: true,
            isDefeat: false,
            isFinished: true
        } : room),
    })),
    defeatGame: () => setState((state) => ({
        ...state,
        lastAction: 'defeat_game',
        rooms: state.rooms.map((room) => room.id === state.activeRoom ? {
            ...room,
            isDefeat: true,
            isWin: false,
            isFinished: true
        } : room),
    })),
    makeImpossible: () => setState((state) => ({
        ...state,
        lastAction: 'make_impossible',
        rooms: state.rooms.map((room) => room.id === state.activeRoom ? {
            ...room,
            isImpossible: true,
            isFinished: true
        } : room),
    })),
    exitRoom: () => setState((state) => ({
        ...state,
        lastAction: 'exit_room',
        activeRoom: '',
    })),
})));

export const useUserStore = create<IUserState>()(userSocketMiddleware((setState) => ({
    userId: undefined,
    name: '',
    nameSaved: false,
    lastAction: '',
    setUsername: (name) => setState((state) => ({
        ...state,
        name,
        nameSaved: true,
        lastAction: 'set_username',
    })),
    setUserId: (id) => setState((state) => ({
        ...state,
        lastAction: 'set_userid',
        userId: id,
    })),
})));

