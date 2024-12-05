import React from "react";
import Stack from "@mui/joy/Stack";
import Modal from "@mui/joy/Modal";
import toast from "react-hot-toast";
import { useAuth } from "@contexts";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import { InputField, ModalConfirm } from "@components";
import ModalClose from "@mui/joy/ModalClose";
import IconButton from "@mui/joy/IconButton";
import ModalDialog from "@mui/joy/ModalDialog";
import AspectRatio from "@mui/joy/AspectRatio";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { useDeleteUser, useUpdateUser } from "@hooks";

export interface IProfileFormModalProps {
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  nombre: string;
  fotoPerfil: string;
  correoElectronico: string;
};

const ProfileFormModal = ({ open, onClose }: IProfileFormModalProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [deleteConfirmation, setDeleteConfirmation] = React.useState(false)

  const initialValues = React.useMemo(() => {
    if (user) return user;
    return { nombre: "", correoElectronico: "", fotoPerfil: "", rol: "" };
  }, [user]);

  const handleDeleteUser = React.useCallback(() => {
    return toast.promise(
      deleteUser.mutateAsync(undefined, {
        onSuccess: () => {
          onClose();
          logout();
        },
      }),
      {
        error: (e) => e,
        loading: "Eliminando cuenta de usuario...",
        success:
          "Perfil de usuario actualizado correctamente. Tu sesión sera cerrada.",
      }
    );
  }, [deleteUser, logout, onClose]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog sx={{ width: "50%" }}>
          <ModalClose />
          <DialogTitle>Editar información de perfil</DialogTitle>
          <DialogContent>Esta información es solo para ti.</DialogContent>
          <Formik<FormValues>
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              return toast.promise(
                updateUser.mutateAsync(values, {
                  onSettled: () => {
                    actions.setSubmitting(false);
                  },
                  onSuccess: () => {
                    onClose();
                    logout();
                    actions.resetForm();
                  },
                }),
                {
                  error: (e) => e,
                  loading: "Actualizando el perfil de usuario...",
                  success:
                    "Perfil de usuario actualizado correctamente. Tu sesión sera cerrada.",
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
                      src={formik.values.fotoPerfil ?? "/profile.png"}
                      srcSet={formik.values.fotoPerfil ?? "/profile.png"}
                      loading="lazy"
                      alt="FotoPerfilUsuario"
                    />
                    <IconButton
                      aria-label="upload new picture"
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
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
                      <i className="ti ti-edit" style={{ fontSize: 20 }}></i>
                    </IconButton>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(event) => {
                        const file = event.target?.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            formik.setFieldValue("fotoPerfil", reader.result);
                          };
                          reader.onerror = (error) => {
                            console.error("Error al leer el archivo:", error);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: "none" }}
                    />
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
                    placeholder="siriwatk@test.com"
                    startDecorator={<i className="ti ti-mail"></i>}
                  />
                </Stack>
                <Stack sx={{ mt: 2 }} gap={2} direction="row">
                  <Button type="submit" loading={false} fullWidth>
                    Guardar cambios
                  </Button>
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => setDeleteConfirmation(true)}
                    loading={deleteUser.isPending}
                    fullWidth
                  >
                    Eliminar cuenta
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </ModalDialog>
      </Modal>
      <ModalConfirm
        type="delete"
        open={deleteConfirmation}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteConfirmation(false)}
        description="La cuenta sera borrada y no podrá ser restaurada."
         title="ADVERTENCIA: Eliminando cuenta permanentemente."
      />
    </>
  );
};

export default ProfileFormModal;
