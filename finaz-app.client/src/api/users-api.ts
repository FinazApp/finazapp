import { Endpoints } from "@core";
import {  IUser, IUserChangeRole } from "@interfaces";

import API from "./api";

const UsersApi = {
    me: async () => {
        const result = await API().get<IUser>(Endpoints.USER_ME);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<IUser[]>(Endpoints.USERS);
        return result.data;
    },
    update: async (user: Partial<IUser>) => {
        const result = await API().patch<IUser>(Endpoints.USERS, user);
        return result.data;
    },
    delete: async () => {
        const result = await API().delete(Endpoints.USERS);
        return result.data;
    },
    changeRole: async (data: IUserChangeRole) => {
        const result = await API().post(Endpoints.USER_CHANGE_ROLE, data);
        return result.data;
    },
}

export default UsersApi;