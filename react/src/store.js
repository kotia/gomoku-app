import { createStore, combineReducers, applyMiddleware } from 'redux'
import * as actionTypes from './actions'
import {goMiddleware} from './middleware'
import {atom, selector, useSetRecoilState} from "recoil";

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
    default: {
        userId: 0,
        name: "",
        nameSaved: false
    },
});

export const roomsListSelector = selector({
    key: 'roomsListSelector',
    get: ({get}) => get(roomsListState),
    set: (_, action) => {
        if (action.type === 'create_room')
        {
            socket.emit('room:create', action.payload.isWhite);
        }

        if (action.type === 'exit_room')
        {
            socket.emit('room:exit');
        }
    }
});

export const roomSelector = selector({
    key: 'roomSelector',
    get: ({get}) => get(roomState),
    set: (_, action) => {
        if (action.type === 'choose_room') {
            socket.emit('room:choose', action.payload.id);
        }

        if (action.type === 'make_turn') {
            socket.emit('room:makeTurn', action.payload.id);
        }
    }
});

export const userSelector = selector({
    key: 'userSelector',
    get: ({get}) => get(userState),
    set: (_, action) => {
        if (action.type === 'set_user_name')
        {
            socket.emit('name:set', action.payload.name);
        }
    }
});

export const roomsListStateSetter = () => {
    const setRoomsList = useSetRecoilState(roomsListState);

    const saveRooms = (rooms) => {
        setRoomsList(rooms.map(({id, creatorIsWhite, creatorId, creatorName}) => {
            return {
                id,
                isYouWhite: !creatorIsWhite,
                creatorId,
                creatorName
            }
        }));
    };

    return [saveRooms];
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

    return [enterRoom, updateRoom, winGame, defeatGame, gameImpossible, exitRoom];
};

export const userStateSetter = (socket) => {
    const setUser = useSetRecoilState(userState);

    const saveUserName = (username) => {
        socket.emit('name:set', username);
    };

    const setUserName = ({name}) => {
        setUser((user) => {
            return {
                ...user,
                name,
                nameSaved: true
            };
        });
    };

    const setUserId = ({userId}) => {
        setUser((user) => {
            return {
                ...user,
                userId
            };
        });
    };

    const setNameSaved = () => {
        setUser((user) => {
            return {
                ...user,
                nameSaved: true
            };
        });
    };

    return [setUserName, setUserId, setNameSaved, saveUserName];
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