import React from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Flex } from "styled-system/jsx";
import { Drawer } from "../drawer";
import { TextField } from "../text-field";
import { NumberField } from "../number-field";

export interface IBillFormDrawerProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

type FormValues = {
  nombre: string;
  monto: number;
  categoria: string;
};

const GastosSchema = Yup.object().shape({
  categoria: Yup.string().required("Categoría requerida"),
  nombre: Yup.string().required("Nombre requerido"),
  monto: Yup.number().required("Requerido").positive("Monto requerido"),
});

const BillFormDrawer = ({ open, onOpenChange }: IBillFormDrawerProps) => {
  return (
    <Formik<FormValues>
      validationSchema={GastosSchema}
      initialValues={{ monto: 0, nombre: "", categoria: "" }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          <Drawer
            open={open}
            submitText="Crear"
            title="Crear un nuevo gasto"
            subtitle="Rellena los datos"
            onOpenChange={(details) => onOpenChange(details.open)}
          >
            <Flex flexDir="column" flex={1} gap={3}>
              <TextField
                label="Nombre"
                name="nombre"
                placeholder="Ej: Alexander"
              />
              <TextField
                label="Categoría"
                name="categoria"
                placeholder="Ej: Hogar"
              />
              <NumberField name="monto" min={0} />
            </Flex>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};

export default BillFormDrawer;
