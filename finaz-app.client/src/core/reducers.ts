type ReducerState = { id: number; open: boolean };

export type DrawerAction =
  | { type: "CLOSE_DRAWER" }
  | { type: "OPEN_DRAWER"; payload: number }
  | { type: "UPDATE_PAYLOAD"; payload: number };

export const DrawersReducer = (
  state: ReducerState,
  action: DrawerAction,
): ReducerState => {
  if (action.type === "OPEN_DRAWER")
    return { ...state, open: true, id: action.payload };
  if (action.type === "CLOSE_DRAWER") return { id: 0, open: false };

  return state;
};

type ModalAction =
  | { type: "CLOSE_MODAL" }
  | { type: "OPEN_MODAL"; payload: number };

export const ModalsReducer = (
  state: ReducerState,
  action: ModalAction,
): ReducerState => {
  if (action.type === "OPEN_MODAL")
    return { ...state, open: true, id: action.payload };
  if (action.type === "CLOSE_MODAL") return { id: 0, open: false };

  return state;
};
