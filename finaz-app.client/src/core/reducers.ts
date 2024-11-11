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