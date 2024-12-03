import React from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import { ISavingGoal } from "@interfaces";
import { InputField } from "@components";
import { useCreateSaving, useFetchOneSaving, useUpdateSaving } from "@hooks";

export interface ISavingsFormModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

type FormValues = ISavingGoal;

const validationSchema = Yup.object({
  nombre: Yup.string().required("Nombre requerido"),
  fechaMeta: Yup.string().required("Fecha de la meta requerida"),
  montoObjetivo: Yup.number().required("Requerido").positive("Monto requerido"),
});

const model = {
  from: (data: ISavingGoal): FormValues => {
    return {
      metaId: data.metaId,
      nombre: data.nombre,
      isDeleted: data.isDeleted,
      montoAhorrado: data.montoAhorrado,
      montoObjetivo: data.montoObjetivo,
      fechaMeta: dayjs(data.fechaMeta).format("YYYY-MM-DD"),
    };
  },
  to: (data: FormValues): ISavingGoal => {
    return {
      metaId: data.metaId ?? 0,
      nombre: data.nombre,
      isDeleted: data.isDeleted ?? false,
      montoAhorrado: data.montoAhorrado ?? 0,
      montoObjetivo: data.montoObjetivo,
      fechaMeta: dayjs(data.fechaMeta, "YYYY-MM-DD").toISOString(),
    };
  },
};

const SavingsFormModal = ({ id, open, onClose }: ISavingsFormModalProps) => {
  const saving = useFetchOneSaving(id);
  const createSaving = useCreateSaving();
  const updateSaving = useUpdateSaving();

  const initialValues = React.useMemo(() => {
    if (saving.data && id) {
      return model.from(saving.data);
    }
    return {
      nombre: "",
      metaId: 0,
      montoAhorrado: 0,
      montoObjetivo: 0,
      isDeleted: false,
      fechaMeta: dayjs().add(1, "day").format("YYYY-MM-DD"),
    };
  }, [id, saving.data]);

  const isPending = React.useMemo(() => {
    if (id) return updateSaving.isPending;
    return createSaving.isPending;
  }, [createSaving.isPending, id, updateSaving.isPending]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Agregar nueva meta de ahorro</DialogTitle>
        <DialogContent>
          Esta meta de ahorro sera privada, solo para ti.
        </DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (id) {
              return toast.promise(
                updateSaving.mutateAsync(model.to(values), {
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
                  loading: "Actualizando meta de ahorro...",
                  success: "Meta de ahorro actualizada correctamente.",
                }
              );
            }

            return toast.promise(
              createSaving.mutateAsync(model.to(values), {
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
                loading: "Agregando meta de ahorro...",
                success: "Meta de ahorro agregada correctamente.",
              }
            );
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <InputField
                type="text"
                name="nombre"
                label="Nombre de la meta"
                placeholder="Ej: Mi apartamento"
              />
              <Stack sx={{ mt: 2 }}>
                <InputField
                  type="number"
                  label="Objetivo"
                  name="montoObjetivo"
                  placeholder="Ingresa el monto a llegar en esta meta."
                />
              </Stack>
              <Stack sx={{ mt: 2, mb: 2 }}>
                <InputField
                  type="date"
                  name="fechaMeta"
                  label="Fecha limite de la meta"
                />
              </Stack>
              <Button type="submit" loading={isPending} fullWidth>
                {id ? "Guardar cambios" : "Agregar meta de ahorro"}
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default SavingsFormModal;
