import { Endpoints } from "@core";
import { ILoginUser, IRegisterUser } from "@interfaces";

import API from "./api";

const AuthApi = {
    register: async (data: IRegisterUser) => {
        const result = await API().post(Endpoints.REGISTER_USER, data);
        return result.data;
    },
    login: async (data: ILoginUser) => {
        const result = await API().post(Endpoints.LOGIN_USER, data);
        return result.data;
    },
}

export default AuthApi;