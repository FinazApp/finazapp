export interface IRegisterUser {
    rol: "usuario";
    nombre: string;
    passwordHash: string;
    correoElectronico: string;
}

export interface ILoginUser {
    correoElectronico: string;
    passwordHash: string;
}

export interface IUser {
    nombre: string;
    correo: string;
    usuarioId: number;
}

export interface ICategory {
    nombre: string;
    usuario: IUser;
    isSystem: boolean;
    isDeleted: boolean;
    descripcion: string;
    categoriaId: number;
}

export type ICategoryCreate = {
    nombre: string;
    categoriaId?: number;
    descripcion: string;
}

export interface IIncome {
    monto: number;
    usuario: IUser;
    nombre: string;
    isDeleted: boolean;
    ingresoId: number;
    categoriaId: number;
}

export interface IIncomesUpdate {
    monto: number;
    nombre: string;
    ingresoId: number;
    categoriaId: number;
}

export interface IIncomesCreate {
    monto: number;
    nombre: string;
    ingresoId: number;
    categoriaId: number;
}

export interface IBill {
    monto: number;
    nombre: string;
    gastoId: number;
    isDeleted: boolean;
    categoriaId: number;
}

export interface IBillUpdate {
    monto: number;
    nombre: string;
    gastoId: number;
    categoriaId: number;
}

export interface IBillCreate {
    monto: number;
    nombre: string;
    gastoId: number;
    categoriaId: number;
}