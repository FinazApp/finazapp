import React from "react";
import * as Yup from "yup";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import ModalClose from "@mui/joy/ModalClose";
import IconButton from "@mui/joy/IconButton";
import ModalDialog from "@mui/joy/ModalDialog";
import AspectRatio from "@mui/joy/AspectRatio";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { IconEdit, IconMail } from "@tabler/icons-react";

import { useAuth } from "@contexts";
import { useUpdateUser } from "@hooks";
import { InputField } from "@components";

export interface IProfileFormModalProps {
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  nombre: string;
  correoElectronico: string;
};

const validationSchema = Yup.object({
  nombre: Yup.string().required("Nombre requerido"),
  correoElectronico: Yup.string().required("Correo electrónico requerida"),
});

const ProfileFormModal = ({ open, onClose }: IProfileFormModalProps) => {
  const { user } = useAuth();

  const updateUser = useUpdateUser();

  const initialValues = React.useMemo(() => {
    if (user) return user;
    return { nombre: "", correoElectronico: "", rol: "" };
  }, [user]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: "50%" }}>
        <ModalClose />
        <DialogTitle>Editar información de perfil</DialogTitle>
        <DialogContent>Esta información es solo para ti.</DialogContent>
        <Formik<FormValues>
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            return toast.promise(
              updateUser.mutateAsync(values, {
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
                loading: "Actualizando el perfil de usuario...",
                success: "Perfil de usuario actualizado correctamente.",
              }
            );
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <Stack
                direction="column"
                alignItems="center"
                spacing={1}
                mb={2}
                position="relative"
              >
                <AspectRatio
                  ratio="1"
                  maxHeight={150}
                  sx={{ width: 150, borderRadius: "100%" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                    loading="lazy"
                    alt=""
                  />
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: "background.body",
                      position: "absolute",
                      zIndex: 4,
                      borderRadius: "50%",
                      right: 20,
                      bottom: 20,
                      boxShadow: "sm",
                    }}
                  >
                    <IconEdit />
                  </IconButton>
                </AspectRatio>
              </Stack>
              <Stack gap={2} direction="row" flexWrap="wrap">
                <InputField
                  type="text"
                  name="nombre"
                  label="Nombre"
                  placeholder="Escribe tu nombre..."
                />
              </Stack>
              <Stack sx={{ mt: 2, mb: 2 }}>
                <InputField
                  type="text"
                  label="Correo electrónico"
                  name="correoElectronico"
                  startDecorator={<IconMail />}
                  placeholder="siriwatk@test.com"
                />
              </Stack>
              <Button type="submit" loading={false} fullWidth>
                Guardar cambios
              </Button>
            </Form>
          )}
        </Formik>
      </ModalDialog>
    </Modal>
  );
};

export default ProfileFormModal;
