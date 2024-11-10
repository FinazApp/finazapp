import React from "react";
import * as Yup from "yup";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import { ModalClose } from "@mui/joy";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import { IBill, IBillCreate } from "@interfaces";
import { CategoriesSelect, InputField } from "@components";
import { useCreateBill, useFetchOneBill, useUpdateBill } from "@hooks";

export interface IBillFormModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  monto: number;
  nombre: string;
  gastoId?: number;
  categoriaId?: number;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Nombre requerido"),
  categoriaId: Yup.number().required("Gasto requerida"),
  monto: Yup.number().required("Requerido").positive("Monto requerido"),
});

const model = {
  from: (data: IBill): FormValues => {
    return {
      monto: data.monto,
      nombre: data.nombre,
      gastoId: data.gastoId,
      categoriaId: data.categoriaId,
    };
  },
  to: (data: FormValues): IBillCreate => {
    return {
      monto: data.monto ?? 0,
      nombre: data.nombre ?? "",
      gastoId: data.gastoId ?? 0,
      categoriaId: data.categoriaId ?? 0,
    };
  },
};

const BillFormModal = ({ id, open, onClose }: IBillFormModalProps) => {
  const bill = useFetchOneBill(id);
  const createBill = useCreateBill();
  const updateBill = useUpdateBill();

  const initialValues = React.useMemo(() => {
    if (bill.data && id) {
      return model.from(bill.data);
    }
    return { monto: 0, categoryId: 0, nombre: "" };
  }, [id, bill.data]);

  const isPending = React.useMemo(() => {
    if (id) return updateBill.isPending;
    return createBill.isPending;
  }, [createBill.isPending, id, updateBill.isPending]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Agregar nuevo gasto</DialogTitle>
        <DialogContent>Este gasto sera privado, solo para ti.</DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (id) {
              return toast.promise(
                updateBill.mutateAsync(model.to(values), {
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
                  loading: "Actualizando el gasto...",
                  success: "Gasto actualizado correctamente.",
                }
              );
            }

            return toast.promise(
              createBill.mutateAsync(model.to(values), {
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
                loading: "Agregando gasto...",
                success: "Gasto agregado correctamente.",
              }
            );
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <InputField
                type="text"
                name="nombre"
                label="Nombre del gasto"
                placeholder="Ej: Compra de alimentos"
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
              <Button type="submit" loading={isPending} fullWidth>
                {id ? "Guardar cambios" : "Agregar gasto"}
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default BillFormModal;
