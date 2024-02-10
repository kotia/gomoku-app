import io, {Socket} from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
    if (!socket) {
        const host = window.location.origin
            .replace(/^http/, 'ws')
            .replace(/:\d+/, ':5001');

        socket = io(host, {
            transports: ["polling"]
        });

        socket.on('connect', () => {});
    }

    return socket;
};