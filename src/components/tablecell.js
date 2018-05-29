"use strict";
import * as React from "react";
import { connect } from 'react-redux';

import { makeTurn } from "../actions";
import { isUserTurn } from "../getUserInfo";

class TableCellContainer extends React.Component {
    constructor(props) {
        super(props);

        this.makeTurn = this.makeTurn.bind(this);
    }

    makeTurn() {
        if (this.props.cell.isEmpty && isUserTurn(this.props)) {
            this.props.onMakeTurn(this.props.cell.id);
        }
    }

    render() {
        return (
            <div
                onClick={this.makeTurn}
                className="gomoku-container__row__cell">
                <div className={
                    'gomoku-container__row__cell__circle ' +
                    (this.props.cell.isEmpty ? '' : (this.props.cell.isWhite ? 'white' : 'black'))
                } />
            </div>
        )
    }
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