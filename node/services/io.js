'use strict';

let io;
const gomoku = require('./gomokuLogic');
const {rooms, users} = require('./store');

const generateUserId = () => {
    if (!users.length) {
        return 0;
    } else {
        return Math.max.apply(null, users.map((user) => user.id)) + 1;
    }
};

const createRoom = (isWhite, userId) => {
    let room = {
        id: rooms.length,
        creatorId: userId,
        creatorName: users.find(function(user){return userId === user.id}).name,
        opponentId: undefined,
        opponentName: '',
        creatorIsWhite: isWhite,
        creatorCanProceed: true,
        opponentCanProceed: true,
        finished: false,
        started: false,
        isWhiteTurn: false,
        table: gomoku.tableConstructor()
    };

    return room;
};

const createUser = () => ({
    id: generateUserId(),
    name: "",
    isWhite: false,
    isPlaying: false,
    possibleToProceed: true,
    isActive: true
});

const filterRooms = function(userId){
    return rooms.filter((room) => !room.started && !room.finished && (room.creatorId !== userId))
        .map((room) => ({
            id: room.id,
            creatorId: room.creatorId,
            creatorName: room.creatorName,
            creatorIsWhite: room.creatorIsWhite
        }));
};

module.exports.init = function(server) {
    io = server;

    io.on('connection', (socket) => {
        let room;
        let user;

        socket.on('page:loaded', (receivedId) => {
            user = users.find((user) => receivedId === user.id);

            if (!user || (user && !user.isActive)) {
                user = createUser();
                users.push(user);
                socket.emit('give:id', user.id);
            } else {
                room = rooms.find((room) => room.creatorId === user.id || room.opponentId === user.id);
                socket.emit('give:id', user.id);

                if (user.name) {
                    socket.emit('give:name', user.name);
                }

                if (room && !room.finished) {
                    socket.emit('room:enter', room);
                }
            }

            socket.emit('rooms:list', filterRooms(user.id));
        });

        let roomsUpdateCallback = function(){
            if (user) {
                socket.emit('rooms:list', filterRooms(user.id));
            }
        };

        let roomUpdateCallback = function(roomId){
            if(room && roomId === room.id) {
                socket.emit('room:update', room);
            }
        };

        let roomVictoryCallback = function(winnerId, roomId) {
            if (room && roomId === room.id) {
                room.finished = true;
                roomsUpdateCallback();
                socket.emit('room:update', room);

                if (winnerId === user.id) {
                    socket.emit('room:victory');
                } else {
                    socket.emit('room:defeat');
                }
            }
        };

        let roomPosibilityCallback = function(roomId){
            if (room && roomId === room.id) {
                if (user.id === room.creatorIsWhite) {
                    room.creatorCanProceed = false;
                } else {
                    room.opponentCanProceed = false;
                }
                if (!room.creatorCanProceed && !room.opponentCanProceed) {
                    room.finished = true;
                    roomsUpdateCallback();
                    socket.emit('room:update', room.id);
                    socket.emit('room:impossible');
                }
            }
        };

        let roomExitCallback = function(roomId){
            if (room && room.id === roomId) {
                socket.emit('room:exit');
            }
        };

        socket.on('name:set', function(name){
            user.name = name;
            socket.emit('give:name', name);
            let createdRoom = rooms.find((room) => room.creatorId === user.id);
            let assignedRoom = rooms.find((room) => room.opponentId === user.id);
            if (createdRoom) {
                createdRoom.creatorName = name;
                roomsUpdateCallback();
                roomUpdateCallback(createdRoom.id);
            } else if (assignedRoom) {
                assignedRoom.opponentName = name;
                roomUpdateCallback(assignedRoom.id);
            }
        });

        socket.on('room:create', (isWhite) => {
            room = createRoom(isWhite, user.id);
            rooms.push(room);
            user.isPlaying = true;
            user.isWhite = isWhite;
            roomsUpdateCallback();
            socket.emit('room:enter', room);
        });

        socket.on('room:choose', (id) => {
            room = rooms.find((room) => room.id === +id);
            user.isWhite = !room.creatorIsWhite;
            room.opponentId = user.id;
            room.opponentName = user.name;
            room.started = true;
            user.isPlaying = true;
            socket.emit('room:enter', room);
            roomsUpdateCallback();
            roomUpdateCallback(room.id);
        });

        socket.on('room:makeTurn', (id) => {
            if(user.isWhite === room.isWhiteTurn && !room.finished && room.table[id].isEmpty) {
                room.table[id].isEmpty = false;
                room.table[id].isWhite = room.isWhiteTurn;
                room.isWhiteTurn = !room.isWhiteTurn;
                roomUpdateCallback(room.id);

                if (gomoku.checkVictory(room.table, id)) {
                    roomVictoryCallback(user.id, room.id);
                } else {
                    if (user.possibleToProceed) {
                        user.possibleToProceed = gomoku.checkPossibility(room.table, user.isWhite);
                    }
                    if (!user.possibleToProceed) {
                        roomPosibilityCallback(room.id);
                    }
                }
            }
        });

        socket.on('room:exit', () => {
            // if user exits from room that he hasn't created and he wasn't played in it - room will appear in list
            // else - room will hide forever
            if (!room.table.find((cell) => !cell.isEmpty) && (room.creatorId !== user.id)) {
                room.started = false;
                socket.emit('room:exit');
            } else {
                room.finished = true;
                roomExitCallback(room.id);
            }
            roomsUpdateCallback();
        });

        socket.on('disconnect', () => {
            if (user) {
                //user.isActive = false;
                console.log('User ' + user.id + ' disconnected');
            }
        });
    });
};