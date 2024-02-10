import { StateCreator, StoreMutatorIdentifier } from 'zustand'
import {IRooms, IUserState} from "../types/types.ts";

type Socket<
    T extends unknown,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = (
    f: StateCreator<T, Mps, Mcs>,
) => StateCreator<T, Mps, Mcs>

type SocketImpl<T extends unknown> = (
    f: StateCreator<T, [], []>,
) => StateCreator<T, [], []>
const roomsSocketImpl: SocketImpl<IRooms> = (config) => (set, get, api) =>
{
    return config(
        (...args) => {
            set(...args);
            console.log(get()?.lastAction);
        },
        get,
        api,
    );
}

const userSocketImpl: SocketImpl<IUserState> = (config) => (set, get, api) =>
{
    return config(
        (...args) => {
            set(...args);
            console.log(get()?.lastAction);
        },
        get,
        api,
    );
}


export const roomsSocketMiddleware = roomsSocketImpl as unknown as Socket<IRooms>;

export const userSocketMiddleware = userSocketImpl as unknown as Socket<IUserState>;
