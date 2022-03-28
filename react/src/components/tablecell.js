"use strict";
import * as React from "react";
import { connect } from 'react-redux';

import { makeTurn } from "../actions";
import { isUserTurn } from "../getUserInfo";

const TableCellContainer = ({ cell, room, onMakeTurn }) => {


    const makeTurn = () => {
        if (cell.isEmpty && isUserTurn({room})) {
            onMakeTurn(cell.id);
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

const mapStateToPropsOne = (store) => ({
    user: store.user,
    room: store.room
});

const mapDispatchToPropsOne = (dispatch) => ({
    onMakeTurn(id) {
        dispatch(makeTurn(id));
    }
});

export default connect(mapStateToPropsOne, mapDispatchToPropsOne)(TableCellContainer);