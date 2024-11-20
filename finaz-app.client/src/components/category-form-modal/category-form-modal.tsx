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

import { InputField } from "@components";
import { ICategory, ICategoryCreate } from "@interfaces";
import {
  useCreateCategory,
  useFetchOneCategory,
  useUpdateCategory,
} from "@hooks";
import { TextareaField } from "../textarea-field";

export interface ICategoryFormModalProps {
  id: number;
  open: boolean;
  onClose: () => void;
}

type FormValues = { nombre: string; categoriaId?: number; descripcion: string };

const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
});

const model = {
  from: (data: ICategory): FormValues => {
    return {
      nombre: data.nombre,
      categoriaId: data.categoriaId,
      descripcion: data.descripcion,
    };
  },
  to: (data: FormValues): ICategoryCreate => {
    return {
      nombre: data.nombre ?? "",
      categoriaId: data.categoriaId ?? 0,
      descripcion: data.descripcion ?? "",
    };
  },
};

const CategoryFormModal = ({ id, open, onClose }: ICategoryFormModalProps) => {
  const category = useFetchOneCategory(id);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const initialValues = React.useMemo(() => {
    if (category.data && id) {
      return model.from(category.data);
    }
    return { descripcion: "", nombre: "" };
  }, [id, category.data]);

  const isPending = React.useMemo(() => {
    if (id) return updateCategory.isPending;
    return createCategory.isPending;
  }, [createCategory.isPending, id, updateCategory.isPending]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Crear nueva categoría</DialogTitle>
        <DialogContent>Esta categoría sera privada solo para ti.</DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            if (id) {
              return toast.promise(
                updateCategory.mutateAsync(model.to(values), {
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
                  loading: "Actualizando la categoría...",
                  success: "Categoría actualizada correctamente.",
                }
              );
            }

            return toast.promise(
              createCategory.mutateAsync(model.to(values), {
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
                loading: "Creando un nueva categoría...",
                success: "Nueva categoría creada correctamente.",
              }
            );
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              {category.isPending && id ? (
                <>
                  <InputField.Skeleton />
                  <TextareaField.Skeleton />
                </>
              ) : (
                <>
                  <InputField
                    type="text"
                    name="nombre"
                    placeholder="Ej: Hogar"
                    label="Nombre de la categoría"
                  />
                  <Stack sx={{ mt: 2, mb: 2 }}>
                    <TextareaField
                      minRows={3}
                      name="descripcion"
                      label="Descripción"
                      placeholder="Escribe la descripcion"
                    />
                  </Stack>
                </>
              )}
              <Button type="submit" loading={isPending} fullWidth>
                {id ? "Guardar cambios" : "Crear categoría"}
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default CategoryFormModal;
