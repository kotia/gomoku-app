import {selector} from "recoil";
import {roomState, userState} from "./store";

export const userIsCreator = selector({
  key: "userIsCreator",
  get: ({get}) => {
    const user = get(userState);
    const room = get(roomState);
    return user.userId === room.creatorId;
  }
});

export const userIsWhite = selector({
    key: "userIsWhite",
    get: ({get}) => {
        const isCreator = get(userIsCreator);
        const room = get(roomState);
        return isCreator === room.creatorIsWhite;
    }
});

export const isUserTurn = selector({
    key: "isUserTurn",
    get: ({get}) => {
        const isWhite = get(userIsWhite);
        const room = get(roomState);
        return isWhite === room.isWhiteTurn;
    }
});
