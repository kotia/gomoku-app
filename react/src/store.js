import {atom, selector, useSetRecoilState} from "recoil";
import {getSocket} from "./recoilMiddleware";

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
        const socket = getSocket();

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
        const socket = getSocket();

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
        const socket = getSocket();
        if (action.type === 'set_user_name')
        {
            console.log('name is set', action.payload.name);
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

    const enterRoom = ({id, table, creatorIsWhite, isWhiteTurn, creatorId, opponentId, creatorName, opponentName, started}) => {
        setRoom({
            roomId: id,
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

export const userStateSetter = () => {
    const setUser = useSetRecoilState(userState);

    const setUserName = (name) => {
        setUser((user) => {
            return {
                ...user,
                name,
                nameSaved: true
            };
        });
    };

    const setUserId = (userId) => {
        setUser((user) => {
            return {
                ...user,
                userId
            };
        });
    };

    return [setUserName, setUserId];
};

