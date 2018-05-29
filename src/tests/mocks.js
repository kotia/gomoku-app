/**
 * Created by eugene on 28.05.2018.
 */
export const user = {
    name: "",
    nameSaved: false,
    userId: 0
};
export const tableCell = {
    isEmpty: true, isWhite: true, id: 0
};

const tableGenerator = () => {
    let table = [];
    for (let i = 0; i < 255; i++) {
        table.push(Object.assign({}, tableCell, {id: i}));
    }
    return table;
};

export const room = {
    creatorId: 0,
    creatorIsWhite: false,
    creatorName: "jj",
    isDefeat: false,
    isFinished: false,
    isImpossible: false,
    isWhiteTurn: false,
    isWin: false,
    opponentId: undefined,
    opponentName: "",
    roomId: undefined,
    started: false,
    table: tableGenerator()
};
