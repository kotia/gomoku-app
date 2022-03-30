import { createStore, combineReducers, applyMiddleware } from 'redux'
import * as actionTypes from './actions'
import {goMiddleware} from './middleware'
import {atom, useSetRecoilState} from "recoil";

export const roomsListState = atom({
    key: 'roomsList',
    default: [],
});

export const roomState = atom({
    key: 'room',
    default: {},
});

export const userState = atom({
    key: 'user',
    default: {},
});

export const roomsListStateSetter = () => {
    const setRoomsList = useSetRecoilState(roomsListState);

    const addNewRoom = ({id, creatorIsWhite, creatorId, creatorName}) => {
        setRoomsList((roomsList) => [...roomsList, {
            id,
            isYouWhite: !creatorIsWhite,
            creatorId,
            creatorName
        }]);
    };

    return [addNewRoom];
};

export const roomStateSetter = () => {
    const setRoom = useSetRecoilState(roomState);

    const enterRoom = ({roomId, room: {table, creatorIsWhite, isWhiteTurn, creatorId, opponentId, creatorName, opponentName, started}}) => {
        setRoom({
            roomId: roomId,
            isWin: false,
            isDefeat: false,
            isImpossible: false,
            isFinished: false,
            table: table,
            creatorIsWhite: creatorIsWhite,
            isWhiteTurn: isWhiteTurn,
            creatorId: creatorId,
            opponentId: opponentId,
            creatorName: creatorName,
            opponentName: opponentName,
            started: started
        });
    };

    const updateRoom = ({table, isWhiteTurn, opponentId, opponentName, creatorName, started}) => {
        setRoom((room) => {
            return {
                ...room,
                table,
                isWhiteTurn,
                opponentId,
                opponentName,
                creatorName,
                started
            };
        });
    };

    const winGame = () => {
        setRoom((room) => {
            return {
                ...room,
                isWin: true,
                isFinished: true
            };
        });
    };

    const defeatGame = () => {
        setRoom((room) => {
            return {
                ...room,
                isDefeat: true,
                isFinished: true
            };
        });
    };

    const gameImpossible = () => {
        setRoom((room) => {
            return {
                ...room,
                isImpossible: true,
                isFinished: true
            };
        });
    };

    const exitRoom = () => {
        setRoom({});
    };

    return [setRoomState];
};

const roomsReducer = function(state = [], action) {
    if (action.type === actionTypes.FETCH_ROOMS) {
        return action.rooms.map((room) => {
            return {
                id: room.id,
                isYouWhite: !room.creatorIsWhite,
                creatorId: room.creatorId,
                creatorName: room.creatorName
            }
        });
    } else {
        return state;
    }
};

const roomReducer = function (state = {}, action) {
    if (action.type === actionTypes.ENTER_ROOM) {
        return {
            roomId: action.roomId,
            isWin: false,
            isDefeat: false,
            isImpossible: false,
            isFinished: false,
            table: action.room.table,
            creatorIsWhite: action.room.creatorIsWhite,
            isWhiteTurn: action.room.isWhiteTurn,
            creatorId: action.room.creatorId,
            opponentId: action.room.opponentId,
            creatorName: action.room.creatorName,
            opponentName: action.room.opponentName,
            started: action.room.started
        }
    } else if (action.type === actionTypes.UPDATE_ROOM) {
        return Object.assign({}, state, {
            table: action.room.table,
            isWhiteTurn: action.room.isWhiteTurn,
            opponentId: action.room.opponentId,
            opponentName: action.room.opponentName,
            creatorName: action.room.creatorName,
            started: action.room.started
        });
    } else if (action.type === actionTypes.GAME_WIN) {
        return Object.assign({}, state, {
            isFinished: true,
            isWin: true
        });
    } else if (action.type === actionTypes.GAME_DEFEAT) {
        return Object.assign({}, state, {
            isFinished: true,
            isDefeat: true
        });
    } else if (action.type === actionTypes.GAME_IMPOSSIBLE) {
        return Object.assign({}, state, {
            isFinished: true,
            isImpossible: true
        });
    }else if (action.type === actionTypes.EXIT_ROOM) {
        return {};
    } else {
        return state;
    }
};

const userReducer = function(state = {userId: 0, name: "", nameSaved: false}, action){
    if (action.type === actionTypes.GIVE_ID) {
        return Object.assign({}, state, {
            userId: action.userId
        });
    } else if (action.type === actionTypes.GIVE_NAME){
        return Object.assign({}, state, {
            name: action.name
        });
    } else if (action.type === actionTypes.SAVE_NAME) {
        return Object.assign({}, state, {
            nameSaved: true
        });
    } else {
        return state;
    }
};

const reducers = combineReducers({
    rooms: roomsReducer,
    room: roomReducer,
    user: userReducer
});

export const store = applyMiddleware(goMiddleware)(createStore)(reducers);