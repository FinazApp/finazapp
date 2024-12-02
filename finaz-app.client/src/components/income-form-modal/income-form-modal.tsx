import React from "react";
import * as Yup from "yup";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import { IIncome, IIncomesCreate } from "@interfaces";
import { CategoriesSelect, InputField } from "@components";
import { useCreateIncome, useFetchOneIncome, useUpdateIncome } from "@hooks";

import { SelectField } from "../select-field";

export interface IIncomeFormModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  monto: number;
  nombre: string;
  ingresoId?: number;
  categoriaId?: number;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Nombre requerido"),
  categoriaId: Yup.number().required("Categoría requerida"),
  monto: Yup.number().required("Requerido").positive("Monto requerido"),
});

const model = {
  from: (data: IIncome): FormValues => {
    return {
      monto: data.monto,
      nombre: data.nombre,
      ingresoId: data.ingresoId,
      categoriaId: data.categoriaId,
    };
  },
  to: (data: FormValues): IIncomesCreate => {
    return {
      monto: data.monto ?? 0,
      nombre: data.nombre ?? "",
      ingresoId: data.ingresoId ?? 0,
      categoriaId: data.categoriaId ?? 0,
    };
  },
};

const IncomeFormModal = ({ id, open, onClose }: IIncomeFormModalProps) => {
  console.log(id);
  const income = useFetchOneIncome(id);
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const initialValues = React.useMemo(() => {
    if (income.data && id) {
      return model.from(income.data);
    }
    return { monto: 0, categoryId: 0, nombre: "" };
  }, [id, income.data]);

  const isPending = React.useMemo(() => {
    if (id) return updateIncome.isPending;
    return createIncome.isPending;
  }, [createIncome.isPending, id, updateIncome.isPending]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Agregar nuevo ingreso</DialogTitle>
        <DialogContent>Este ingreso sera privado, solo para ti.</DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (id) {
              return toast.promise(
                updateIncome.mutateAsync(model.to(values), {
                  onSettled: () => {
                    actions.setSubmitting(false);
                  },
                  onSuccess: () => {
                    onClose();
                    actions.resetForm();
                  },
                }),
                {
                  error: (e) => e,
                  loading: "Actualizando el ingreso...",
                  success: "Ingreso actualizado correctamente.",
                }
              );
            }

            return toast.promise(
              createIncome.mutateAsync(model.to(values), {
                onSettled: () => {
                  actions.setSubmitting(false);
                },
                onSuccess: () => {
                  onClose();
                  actions.resetForm();
                },
              }),
              {
                error: (e) => e,
                loading: "Agregando ingreso...",
                success: "Ingreso agregado correctamente.",
              }
            );
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              {income.isPending && id ? (
                <>
                  <InputField.Skeleton />
                  <InputField.Skeleton />
                  <SelectField.Skeleton />
                </>
              ) : (
                <>
                  <InputField
                    type="text"
                    name="nombre"
                    label="Nombre del ingreso"
                    placeholder="Ej: Tienda"
                  />
                  <Stack sx={{ mt: 2, mb: 2 }}>
                    <InputField
                      type="number"
                      name="monto"
                      label="Monto"
                      placeholder="Ingresa el monto"
                    />
                  </Stack>
                  <Stack sx={{ mt: 2, mb: 2 }}>
                    <CategoriesSelect name="categoriaId" />
                  </Stack>
                </>
              )}
              <Button type="submit" loading={isPending} fullWidth>
                {id ? "Guardar cambios" : "Agregar ingreso"}
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default IncomeFormModal;
