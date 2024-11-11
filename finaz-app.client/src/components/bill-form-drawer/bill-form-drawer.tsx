import React from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import { Flex } from "styled-system/jsx";

import { IBills, IBillsCreate } from "@interfaces";
import {
  useCreateBills,
  useUpdateBills,
  useFetchOneBills,
  useFetchCategories,
} from "@hooks";

import { Drawer } from "../drawer";
import { TextField } from "../text-field";
import { NumberField } from "../number-field";
import { SelectField } from "../select-field";

export interface IBillFormDrawerProps {
  id: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

type FormValues = { nombre: string; monto: number; categoriaId?: number };

const GastosSchema = Yup.object().shape({
  nombre: Yup.string().required("Nombre requerido"),
  categoriaId: Yup.string().required("Categoría requerida"),
  monto: Yup.number().required("Requerido").positive("Monto requerido"),
});

const model = {
  from: (data: IBills): FormValues => {
    return {
      monto: data.monto,
      nombre: data.nombre,
      categoriaId: data.categoria.categoriaId,
    };
  },
  to: (data: FormValues): IBillsCreate => {
    return {
      usuarioId: 24, // TODO: CAMBIAR CUANDO SMILL HAGA LA LÓGICA.
      monto: data.monto,
      nombre: data.nombre,
      categoriaId: data.categoriaId ?? 0,
    };
  },
};

const BillFormDrawer = ({ id, open, onOpenChange }: IBillFormDrawerProps) => {
  const bills = useFetchOneBills(id);
  const createBills = useCreateBills();
  const updateBills = useUpdateBills();
  const categories = useFetchCategories();

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
    if (bills.data && id) {
      return model.from(bills.data);
    }
    return { monto: 0, nombre: "" };
  }, [id, bills.data]);

  return (
    <Formik<FormValues>
      enableReinitialize
      initialValues={initialValues}
      validationSchema={GastosSchema}
      onSubmit={(values, actions) => {
        if (id) {
          return toast.promise(
            updateBills.mutateAsync(
              { ...model.to(values), gastosId: id },
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
          createBills.mutateAsync(model.to(values), {
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
        <Form onSubmit={formik.handleSubmit}>
          <Drawer
            open={open}
            subtitle="Rellena el formulario"
            submitText={id ? "Guardar gasto" : "Crear gasto"}
            title={id ? "Editar gasto" : "Crear un nuevo gasto"}
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

export default BillFormDrawer;
