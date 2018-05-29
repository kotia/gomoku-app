"use strict";
import * as React from "react";
import { connect } from 'react-redux';

import TableCell from './tablecell';
import RoomInfo from './roominfo';

export class Room extends React.Component {
    render() {
        // rows = [[cell1, cell2...cell15], [cell16...cell30]...]
        const tableWidth = 15;
        const rows = this.props.room.table.reduce((acc, val, index) => {
            if (index%tableWidth === 0) {
                acc.push([]);
            }
            acc[acc.length-1].push(val);
            return acc;
        }, []);

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
}

const mapStateToProps = (store) => ({
    room: store.room
});

export default connect(mapStateToProps)(Room);