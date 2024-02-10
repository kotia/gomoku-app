import {useMemo, memo} from "react";
import TableCell from "./TableCell.tsx";
import {IRoomState, ITableCell} from "../types/types.ts";

const tableWidth = 15;

const Room = ({room, isTurn}: {room: IRoomState, isTurn: boolean}) => {

    // rows = [[cell1, cell2...cell15], [cell16...cell30]...]
    const rows = useMemo(() => room.table ? room.table.reduce((acc, val, index) => {
        if (index%tableWidth === 0) {
            acc.push([]);
        }
        acc[acc.length-1].push(val);
        return acc;
    }, [] as ITableCell[][]) : [], [room]);

    return (
        <div className="gomoku-container">
            <div className="gomoku-container__table">
                {rows.map((cells, rowIndex) =>
                    <div key={rowIndex} className="gomoku-container__row">
                        {
                            cells.map((cell, cellIndex) =>
                                <TableCell cell={cell} key={rowIndex * tableWidth + cellIndex} isUsersTurn={isTurn} />
                            )
                        }
                    </div>
                )}
            </div>
        </div>
    )

}

export default memo(Room);