import {memo, useCallback} from "react";
import {ITableCell} from "../types/types.ts";
import {getSocket} from "../socket.ts";

const TableCell = ({ cell, isUsersTurn }: {cell: ITableCell, isUsersTurn: boolean}) => {
    const socket = getSocket();
    const makeTurn = useCallback(() => {
        if (cell.isEmpty && isUsersTurn) {
            socket.emit('room:makeTurn', cell.id);
        }
    }, [cell, isUsersTurn]);

    return (
        <div
            onClick={makeTurn}
            className="gomoku-container__row__cell">
            <div className={
                'gomoku-container__row__cell__circle ' +
                (cell.isEmpty ? '' : (cell.isWhite ? 'white' : 'black'))
            } />
        </div>
    )
}

export default memo(TableCell);