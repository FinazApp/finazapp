import React from "react";
import * as Yup from "yup";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import { InputField } from "@components";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { useAddFondoSaving, useFetchOneSaving } from "@hooks";
import { ISavingGoal, ISavingGoalUpdateMonto } from "@interfaces";

export interface IAddFondoFormModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  metaId: number;
  nuevoFondo: number;
  montoAhorrado: number;
};

const validationSchema = Yup.object({
  nuevoFondo: Yup.number().required("Requerido").positive("Monto requerido"),
  montoAhorrado: Yup.number().required("Requerido").positive("Monto requerido"),
});

const model = {
  from: (data: ISavingGoal): FormValues => {
    return {
      nuevoFondo: 0,
      metaId: data.metaId,
      montoAhorrado: data.montoAhorrado,
    };
  },
  to: (data: FormValues): ISavingGoalUpdateMonto => {
    return {
      metaId: data.metaId ?? 0,
      nuevoFondo: data.nuevoFondo,
    };
  },
};

const AddFondoFormModal = ({ id, open, onClose }: IAddFondoFormModalProps) => {
  const saving = useFetchOneSaving(id);
  const addFondo = useAddFondoSaving();

  const initialValues = React.useMemo(() => {
    if (saving.data && id) {
      return model.from(saving.data);
    }
    return { montoAhorrado: 0, nuevoFondo: 0, metaId: 0 };
  }, [id, saving.data]);

  const isPending = React.useMemo(() => {
    return addFondo.isPending;
  }, [addFondo.isPending]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>
          Agregar fondo a la meta de ahorro '{`${saving.data?.nombre ?? ""}`}'
        </DialogTitle>
        <DialogContent>Este fondo es privada, solo para ti.</DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            return toast.promise(
              addFondo.mutateAsync(model.to(values), {
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
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <InputField
                disabled
                type="number"
                name="montoAhorrado"
                label="Fondo ahorrado"
              />
              <Stack sx={{ mt: 2, mb: 2 }}>
                <InputField
                  type="number"
                  name="nuevoFondo"
                  label="Nuevo fondo"
                  placeholder="Ingresa el monto a llegar en esta meta."
                />
              </Stack>
              <Button type="submit" loading={isPending} fullWidth>
                Agregar fondos
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default AddFondoFormModal;
