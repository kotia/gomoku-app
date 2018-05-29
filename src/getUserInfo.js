export const userIsCreator = (store) => store.user.userId === store.room.creatorId;

export const userIsWhite = (store) => userIsCreator(store) === store.room.creatorIsWhite;

export const isUserTurn = (store) => userIsWhite(store) === store.room.isWhiteTurn;
