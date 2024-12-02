import { Endpoints } from "@core";
import {  IUser } from "@interfaces";

import API from "./api";

const UsersApi = {
    me: async () => {
        const result = await API().get<IUser>(Endpoints.USER_ME);
        return result.data;
    },
    update: async (user: Partial<IUser>) => {
        const result = await API().patch<IUser>(Endpoints.USERS, user);
        return result.data;
    },
}

export default UsersApi;