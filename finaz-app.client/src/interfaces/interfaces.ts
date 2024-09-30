export interface IRegisterUser {
    nombre: string;
    correo: string;
    passwordHash: string;
}

export interface ILoginUser {
    email: string;
    hashContraseña: string;
}