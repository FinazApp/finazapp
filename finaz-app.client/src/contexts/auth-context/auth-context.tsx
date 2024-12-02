import React from "react";
import { IUser } from "@interfaces";
import toast from "react-hot-toast";
import { useFetchUserMe, useLogout } from "@hooks";
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary, MainLayout } from "@components";
import { RouteObject, RouterProvider } from "react-router";
import {
  DashboardPage,
  IncomesPage,
  BillsPage,
  RegisterPage,
  LoginPage,
  CategoriesPage,
  SavingsPage,
} from "@pages";

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

const Provider = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    user: null,
  });

  const logoutUser = useLogout();
  const userMe = useFetchUserMe();

  React.useEffect(() => {
    if (userMe.data) {
      dispatch({ data: userMe.data, type: "ADD_USER_DATA" });
    }
  }, [userMe.data, userMe.isSuccess]);

  const logout = React.useCallback(async () => {
    dispatch({ type: "CLEAR_AUTH" });
    return toast.promise(logoutUser.mutateAsync(), {
      error: (e) => e,
      loading: "Cerrando sesión....",
      success: "Sesión cerrada.",
    });
  }, [logoutUser]);

  const routes: RouteObject[] = React.useMemo(
    () => [
      {
        path: "/",
        element: <MainLayout withOutlet />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            index: true,
            id: "dashboard-page",
            element: <DashboardPage />,
          },
          {
            path: "incomes",
            id: "incomes-page",
            element: <IncomesPage />,
          },
          {
            path: "categories",
            id: "categories-page",
            element: <CategoriesPage />,
          },
          {
            path: "bills",
            id: "bills-page",
            element: <BillsPage />,
          },
          {
            path: "savings",
            id: "savings-page",
            element: <SavingsPage />,
          },
        ],
      },
      {
        id: "register-page",
        path: "register",
        element: <RegisterPage />,
      },
      {
        id: "login-page",
        path: "login",
        element: <LoginPage />,
      },
    ],
    []
  );

  return (
    <AuthContext.Provider
      value={{
        logout,
        user: state.user,
        isLogged: !!Object.keys(state?.user ?? {}).length,
      }}
    >
      {userMe.isPending && !userMe.data ? (
        "Cargando datos del usuario..."
      ) : (
        <RouterProvider router={createBrowserRouter(routes)} />
      )}
    </AuthContext.Provider>
  );
};

export default Provider;
