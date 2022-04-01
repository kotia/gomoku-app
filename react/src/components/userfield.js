import * as React from "react";

import {useRecoilState} from "recoil";
import {userSelector} from "../store";

const UserFieldContainer = () => {

    const [user, userAction] = useRecoilState(userSelector)

    const [name, setName] = React.useState("");

    const onEditName = (e) => {
        setName(e.target.value);
    }

    const onSetName = () => {
        name.length && userAction({
            type: 'set_user_name',
            payload: {
                name
            }
        });
    }

        const nameElement = user.name && user.nameSaved ?
            (
                <div>Your name is {user.name}</div>
            ):(
                <div>
                    What is you name?
                    <input type="text" onChange={onEditName} />
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

export default UserFieldContainer;
