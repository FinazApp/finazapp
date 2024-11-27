import React from "react";
import { IUser } from "@interfaces";
import { useFetchUserMe } from "@hooks";

// import { Routes, Constants } from "#core";
// import { useTranslation } from "react-i18next";
// import { IUser } from "@nubeteck/queries";

interface IAuthContextProps {
  isLogged: boolean;
  user: null | IUser;
  logout: () => void;
}

type AuthReducerAction =
  | { type: "CLEAR_AUTH" }
  | { type: "ADD_USER_DATA"; data: IUser };

type AuthReducerState = {
  user: null | IUser;
};

const reducer = (
  state: AuthReducerState,
  action: AuthReducerAction
): AuthReducerState => {
  if (action.type === "CLEAR_AUTH") return { user: null };
  if (action.type === "ADD_USER_DATA") return { ...state, user: action.data };
  return state;
};

const AuthContext = React.createContext<IAuthContextProps>({
  user: null,
  isLogged: false,
  logout: () => null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext);

interface IProviderProps {
  children?: React.ReactNode;
  renderLoading: (message: string) => React.JSX.Element;
}

const Provider = ({ children, renderLoading }: IProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, {
    user: null,
  });

  const userMe = useFetchUserMe();
  console.log("🚀 ~ Provider ~ userMe:", userMe)

  React.useEffect(() => {
    if (userMe.data) {
      dispatch({ data: userMe.data, type: "ADD_USER_DATA" });
    }
  }, [userMe.data, userMe.isSuccess]);

  const logout = React.useCallback(async () => {
    dispatch({ type: "CLEAR_AUTH" });
    // localStorage.removeItem(Constants.TOKEN_KEY_NAME);
    // localStorage.removeItem(Constants.REFRESH_TOKEN_KEY_NAME);
    // window.location.href = Routes.BASE_ROUTE;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        user: state.user,
        isLogged: !!Object.keys(state?.user ?? {}).length,
      }}
    >
      {userMe.isPending && !userMe.data
        ? renderLoading("Cargando datos del usuario...")
        : children}
    </AuthContext.Provider>
  );
};

export default Provider;
