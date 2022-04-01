"use strict";
import * as React from "react";

import TableCell from './tablecell';
import RoomInfo from './roominfo';
import {useRecoilState} from "recoil";
import {roomSelector} from "../store";

const Room = () => {

    const [room] = useRecoilState(roomSelector);


    // rows = [[cell1, cell2...cell15], [cell16...cell30]...]
    const tableWidth = 15;
    const rows = room.table ? room.table.reduce((acc, val, index) => {
        if (index%tableWidth === 0) {
            acc.push([]);
        }
        acc[acc.length-1].push(val);
        return acc;
    }, []) : [];

    return (
        <div className="gomoku-container">
            <div className="gomoku-container__table">
                {rows.map((cells, rowIndex) =>
                    <div key={rowIndex} className="gomoku-container__row">
                        {
                            cells.map((cell, cellIndex) =>
                                <TableCell cell={cell} key={rowIndex * tableWidth + cellIndex} />
                            )
                        }
                    </div>
                )}
            </div>
            <RoomInfo/>
        </div>
    )

}

export default Room;