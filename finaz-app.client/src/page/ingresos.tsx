import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";

// Definición de tipos
interface Usuario {
  usuarioId: number;
  nombre: string;
  correo: string;
}

interface Categoria {
  categoriaId: number;
  nombre: string;
  tipo: string;
  descripcion: string;
}

interface Ingreso {
  ingresosId: number;
  nombre: string;
  monto: number;
  usuario: Usuario;
  categoria: Categoria;
}

// Nuevo tipo para los valores del formulario
interface IngresoFormValues {
  nombre: string;
  monto: number;
  usuarioId: number;
  categoriaId: number;
}

// Componente principal
export default function IngresosCRUD() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Simular carga de datos
  useEffect(() => {
    // Aquí normalmente harías una llamada a una API
    setIngresos([
      {
        ingresosId: 1,
        nombre: "Salario",
        monto: 1500,
        usuario: {
          usuarioId: 1,
          nombre: "Juan Pérez",
          correo: "juan.perez@example.com",
        },
        categoria: {
          categoriaId: 7,
          nombre: "Ahorro",
          tipo: "Ingreso",
          descripcion: "Dinero ahorrado",
        },
      },
      // ... más ingresos
    ]);
  }, []);

  // Esquema de validación
  const IngresoSchema = Yup.object().shape({
    nombre: Yup.string().required("Requerido"),
    monto: Yup.number().required("Requerido").positive("Debe ser positivo"),
    usuarioId: Yup.number().required("Requerido"),
    categoriaId: Yup.number().required("Requerido"),
  });

  // Funciones CRUD
  const addIngreso = (
    values: IngresoFormValues,
    { resetForm }: FormikHelpers<IngresoFormValues>
  ) => {
    const newIngreso: Ingreso = {
      ingresosId: Math.max(...ingresos.map((i) => i.ingresosId), 0) + 1,
      nombre: values.nombre,
      monto: values.monto,
      usuario: { usuarioId: values.usuarioId, nombre: "", correo: "" },
      categoria: {
        categoriaId: values.categoriaId,
        nombre: "",
        tipo: "",
        descripcion: "",
      },
    };
    setIngresos([...ingresos, newIngreso]);
    resetForm();
  };

  const updateIngreso = (
    values: IngresoFormValues,
    { resetForm }: FormikHelpers<IngresoFormValues>
  ) => {
    setIngresos(
      ingresos.map((ingreso) =>
        ingreso.ingresosId === editingId
          ? {
              ...ingreso,
              nombre: values.nombre,
              monto: values.monto,
              usuario: { ...ingreso.usuario, usuarioId: values.usuarioId },
              categoria: {
                ...ingreso.categoria,
                categoriaId: values.categoriaId,
              },
            }
          : ingreso
      )
    );
    setEditingId(null);
    resetForm();
  };

  const deleteIngreso = (id: number) => {
    setIngresos(ingresos.filter((ingreso) => ingreso.ingresosId !== id));
  };

  const startEditing = (id: number) => {
    const ingresoToEdit = ingresos.find((ingreso) => ingreso.ingresosId === id);
    if (ingresoToEdit) {
      setEditingId(id);
      // Aquí podrías establecer los valores iniciales del formulario para edición
    }
  };

  const initialValues: IngresoFormValues = {
    nombre: "",
    monto: 0,
    usuarioId: 0,
    categoriaId: 0,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ingresos</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={IngresoSchema}
        onSubmit={editingId !== null ? updateIngreso : addIngreso}
      >
        {({ isSubmitting }) => (
          <Form className="mb-8">
            <div className="mb-4">
              <Field
                name="nombre"
                type="text"
                placeholder="Nombre"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-4">
              <Field
                name="monto"
                type="number"
                placeholder="Monto"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="monto"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-4">
              <Field
                name="usuarioId"
                as="select"
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione un usuario</option>
                <option value="1">Juan Pérez</option>
                {/* Más opciones de usuario */}
              </Field>
              <ErrorMessage
                name="usuarioId"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-4">
              <Field
                name="categoriaId"
                as="select"
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccione una categoría</option>
                <option value="7">Ahorro</option>
                <option value="8">Salario</option>
                {/* Más opciones de categoría */}
              </Field>
              <ErrorMessage
                name="categoriaId"
                component="div"
                className="text-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {editingId !== null ? "Actualizar" : "Agregar"} Ingreso
            </button>
          </Form>
        )}
      </Formik>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.ingresosId}>
                <td className="border px-4 py-2">{ingreso.ingresosId}</td>
                <td className="border px-4 py-2">{ingreso.nombre}</td>
                <td className="border px-4 py-2">{ingreso.monto}</td>
                <td className="border px-4 py-2">{ingreso.usuario.nombre}</td>
                <td className="border px-4 py-2">{ingreso.categoria.nombre}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => startEditing(ingreso.ingresosId)}
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteIngreso(ingreso.ingresosId)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
