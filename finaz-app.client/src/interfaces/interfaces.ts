export interface IRegisterUser {
    nombre: string;
    correo: string;
    passwordHash: string;
}

export interface ILoginUser {
    email: string;
    hashContraseña: string;
}

export interface IUser {
    nombre: string;
    correo: string;
    usuarioId: number;
}

export interface ICategory {
    nombre: string;
    usuario: IUser;
    descripcion: string;
    categoriaId: number;
}

export interface IIncomes {
    monto: number;
    usuario: IUser;
    nombre: string;
    ingresosId: number;
    categoria: ICategory;
}

export interface IIncomesUpdate {
    monto: number;
    nombre: string;
    usuarioId: number;
    ingresosId: number;
    categoriaId: number;
}

export interface IIncomesCreate {
    monto: number;
    nombre: string;
    usuarioId: number;
    categoriaId: number;
}

export interface IBills {
    monto: number;
    usuario: IUser;
    nombre: string;
    gastosId: number;
    categoria: ICategory;
}

export interface IBillsUpdate {
    monto: number;
    nombre: string;
    gastosId: number;
    usuarioId: number;
    categoriaId: number;
}

export interface IBillsCreate {
    monto: number;
    nombre: string;
    usuarioId: number;
    categoriaId: number;
}