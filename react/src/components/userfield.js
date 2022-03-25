import * as React from "react";
import { connect } from 'react-redux';

import {
    setName, giveName
} from "../actions";

export class UserFieldContainer extends React.Component {
    render() {
        const nameElement = this.props.user.name && this.props.user.nameSaved ?
            (
                <div>Your name is {this.props.user.name}</div>
            ):(
                <div>
                    What is you name?
                    <input type="text" value={this.props.user.name} onChange={this.props.onGiveName} />
                    <button onClick={this.props.onSetName}>Save name!</button>
                </div>
            );

        return (
            <div className="userinfo-container">
                You user ID is {this.props.user.userId}.
                {nameElement}
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.user
});

const mapDispatchToProps = (dispatch) => ({
    onGiveName(e) {
        dispatch(giveName(e.target.value));
    },
    onSetName() {
        dispatch(setName());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFieldContainer);
