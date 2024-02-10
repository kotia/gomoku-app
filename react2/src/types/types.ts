export interface ITableCell {
    isEmpty: boolean;
    isWhite: boolean;
    id: number;
}

export interface IBackendRoomState {
    id: string,
    table: ITableCell[],
    creatorIsWhite: boolean,
    isWhiteTurn: boolean,
    creatorId: string,
    opponentId: string,
    creatorName: string,
    opponentName: string,
    started: boolean,
}
export interface IRoomState extends IBackendRoomState {
    isWin: boolean,
    isDefeat: boolean,
    isImpossible: boolean,
    isFinished: boolean,
}

export interface IUserState {
    userId?: string;
    lastAction?: string;
    name: string;
    nameSaved: boolean;
    setUsername: (name: string) => void;
    setUserId: (id: string) => void;
}

export interface IRooms {
    rooms: IRoomState[];
    activeRoom: string;
    lastAction?: string;

    newRoom: (roomProps: IBackendRoomState) => void;
    enterRoom: (id: string) => void;
    updateRoom: (roomProps: Partial<IRoomState>) => void;
    winGame: () => void;
    defeatGame: () => void;
    makeImpossible: () => void;
    exitRoom: () => void;
}