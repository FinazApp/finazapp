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
    rol: string;
    nombre: string;
    usuarioId: number;
    correoElectronico: string;
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
    ingresoId: number;
    isDeleted: boolean;
    categoriaId: number;
    categoria: ICategory;
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
    categoria: ICategory;
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

export type PercentageKpi = { tipo: "Negativo" | "Neutro" | "Positivo"; porcentaje: number; }

export interface IDashboardBalance {
    totales: Record<"balance" | "ingresos" | "gastos", number>;
    porcentajes: Record<"balance" | "ingresos" | "gastos", PercentageKpi>;
    ultimosMovimientos: {
        monto: number;
        nombre: string;
        fechaCreacion: string,
        tipo: string
    }[];
    categoriasUsadas: { categoria: number, total: number }[]
}

export interface ISavingGoal {
    metaId: number;
    nombre: string;
    fechaMeta: string;
    isDeleted: boolean;
    montoObjetivo: number;
    montoAhorrado: number;
}