import * as React from "react";

import {useUserStore} from "../store/store.ts";
import {useShallow} from "zustand/react/shallow";
import {ChangeEvent, memo, useCallback} from "react";
import {getSocket} from "../socket.ts";

const UserField = () => {
    const socket = getSocket();

    const {userId, savedName, nameSaved} = useUserStore(useShallow(({name, userId, nameSaved}) => ({userId, savedName: name, nameSaved})));

    const [name, setName] = React.useState("");

    const onEditName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const onSetName = useCallback(() => {
        name.length && socket.emit('name:set', name);
    }, [name]);

    return (
        <div className="userinfo-container">
            You user ID is {userId}.
            {savedName && nameSaved ?
                (
                    <div>Your name is {savedName}</div>
                ):(
                    <div>
                        What is your name?
                        <input type="text" onChange={onEditName} />
                        <button onClick={onSetName}>Save name!</button>
                    </div>
                )}
        </div>
    )
}

export default memo(UserField);
