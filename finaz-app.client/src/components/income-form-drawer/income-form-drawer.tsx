import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Flex } from "styled-system/jsx";

import { Drawer } from "../drawer";
import { TextField } from "../text-field";
import { NumberField } from "../number-field";

export interface IIncomeFormDrawerProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

type FormValues = {
  nombre: string;
  monto: number;
  categoria: string;
};

const IngresoSchema = Yup.object().shape({
  categoria: Yup.string().required("Categoría requerida"),
  nombre: Yup.string().required("Nombre requerido"),
  monto: Yup.number().required("Requerido").positive("Debe ser positivo"),
});

const IncomeFormDrawer = ({ open, onOpenChange }: IIncomeFormDrawerProps) => {
  return (
    <Formik<FormValues>
      validationSchema={IngresoSchema}
      initialValues={{ monto: 0, nombre: "", categoria: "" }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <Drawer
            open={open}
            submitText="Crear ingreso"
            title="Crear un nuevo ingreso"
            subtitle="Rellena el formulario"
            onOpenChange={(details) => onOpenChange(details.open)}
          >
            <Flex flexDir="column" flex={1} gap={3}>
              <TextField label="Nombre" name="nombre" placeholder="Ej: Alexander" />
              <TextField label="Categoría" name="categoria" placeholder="Hogar" />
              <NumberField label="Monto" name="monto" min={0} />
            </Flex>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default IncomeFormDrawer;
