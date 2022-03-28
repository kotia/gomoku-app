import * as React from "react";
import { connect } from 'react-redux';

import {
    setName, giveName
} from "../actions";

const UserFieldContainer = ({user, onGiveName, onSetName}) => {
        const nameElement = user.name && user.nameSaved ?
            (
                <div>Your name is {user.name}</div>
            ):(
                <div>
                    What is you name?
                    <input type="text" value={user.name} onChange={onGiveName} />
                    <button onClick={onSetName}>Save name!</button>
                </div>
            );

        return (
            <div className="userinfo-container">
                You user ID is {user.userId}.
                {nameElement}
            </div>
        )
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
