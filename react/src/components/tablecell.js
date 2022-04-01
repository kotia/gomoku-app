"use strict";
import * as React from "react";

import { isUserTurn } from "../getUserInfo";
import {useRecoilState} from "recoil";
import {roomSelector} from "../store";

const TableCellContainer = ({ cell }) => {

    const [, roomAction] = useRecoilState(roomSelector);
    const [userTurn] = useRecoilState(isUserTurn);

    const makeTurn = () => {
        if (cell.isEmpty && userTurn) {
            roomAction({
                type: 'make_turn',
                payload: {
                    id: cell.id
                }
            });
        }
    }

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

export default TableCellContainer;