
import { Endpoints } from "@core";
import { IRegisterUser } from "@interfaces";

import API from "./api";

const RegisterApi = {
    register: async (data: IRegisterUser) => {
        const result = await API().post(Endpoints.REGISTER_USER, data);
        return result.data;
    },
}

export default RegisterApi;