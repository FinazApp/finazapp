import React from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import { Flex } from "styled-system/jsx";

import { IIncomes, IIncomesCreate } from "@interfaces";
import {
  useCreateIncomes,
  useUpdateIncomes,
  useFetchCategories,
  useFetchOneIncomes,
} from "@hooks";

import { Drawer } from "../drawer";
import { TextField } from "../text-field";
import { NumberField } from "../number-field";
import { SelectField } from "../select-field";

export interface IIncomeFormDrawerProps {
  id: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

type FormValues = { nombre: string; monto: number; categoriaId?: number };

const IngresoSchema = Yup.object().shape({
  nombre: Yup.string().required("Nombre requerido"),
  categoriaId: Yup.number().required("Categoría requerida"),
  monto: Yup.number().required("Requerido").positive("Debe ser positivo"),
});

const model = {
  from: (data: IIncomes): FormValues => {
    return {
      monto: data.monto,
      nombre: data.nombre,
      categoriaId: data.categoria.categoriaId,
    };
  },
  to: (data: FormValues): IIncomesCreate => {
    return {
      usuarioId: 24, // TODO: CAMBIAR CUANDO SMILL HAGA LA LÓGICA.
      monto: data.monto,
      nombre: data.nombre,
      categoriaId: data.categoriaId ?? 0,
    };
  },
};

const IncomeFormDrawer = ({
  id,
  open,
  onOpenChange,
}: IIncomeFormDrawerProps) => {
  const income = useFetchOneIncomes(id);
  const categories = useFetchCategories();
  const createIncomes = useCreateIncomes();
  const updateIncomes = useUpdateIncomes();

  const categoriesOptions = React.useMemo(() => {
    if (!categories.data?.length) return [];
    return categories.data.map((category) => {
      return {
        label: category.nombre,
        value: category.categoriaId,
      };
    });
  }, [categories.data]);

  const initialValues = React.useMemo(() => {
    if (income.data && id) {
      return model.from(income.data);
    }
    return { monto: 0, nombre: "" };
  }, [id, income.data]);

  return (
    <Formik<FormValues>
      enableReinitialize
      initialValues={initialValues}
      validationSchema={IngresoSchema}
      onSubmit={(values, actions) => {
        if (id) {
          return toast.promise(
            updateIncomes.mutateAsync(
              { ...model.to(values), ingresosId: id },
              {
                onSettled: () => {
                  actions.setSubmitting(false);
                },
                onSuccess: () => {
                  onOpenChange(false);
                  actions.resetForm();
                },
              }
            ),
            {
              error: (e) => e,
              loading: "Actualizando el ingreso...",
              success: "Ingreso actualizado correctamente.",
            }
          );
        }

        return toast.promise(
          createIncomes.mutateAsync(model.to(values), {
            onSettled: () => {
              actions.setSubmitting(false);
            },
            onSuccess: () => {
              onOpenChange(false);
              actions.resetForm();
            },
          }),
          {
            error: (e) => e,
            loading: "Creando un nuevo ingreso...",
            success: "Nuevo ingreso creado correctamente.",
          }
        );
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <Drawer
            open={open}
            submitText={id ? "Guardar ingreso" : "Crear ingreso"}
            title={id ? "Editar ingreso" : "Crear un nuevo ingreso"} 
            subtitle="Rellena el formulario"
            onOpenChange={(details) => onOpenChange(details.open)}
          >
            <Flex flexDir="column" flex={1} gap={3}>
              <TextField
                label="Nombre"
                name="nombre"
                placeholder="Ej: Alexander"
              />
              <SelectField
                name="categoriaId"
                label="Categorías"
                items={categoriesOptions}
                placeholder="Selecciona una categoría"
              />
              <NumberField label="Monto" name="monto" min={0} />
            </Flex>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default IncomeFormDrawer;
