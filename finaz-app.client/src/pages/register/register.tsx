import React from "react";
import * as Yup from "yup";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import { useRegister } from "@hooks";
import Stack from "@mui/joy/Stack";
import toast from "react-hot-toast";
import Button from "@mui/joy/Button";
import { Form, Formik } from "formik";
import { IRegisterUser } from "@interfaces";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import { ColorSchemeToggle, InputField } from "@components";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useNavigate } from "react-router";

const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es obligatorio"),
  correoElectronico: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  passwordHash: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegister();

  return (
    <>
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">FinazApp</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  Registro
                </Typography>
                <Typography level="body-sm">
                  ¿Tienes cuenta?{" "}
                  <Link href="/login" level="title-sm">
                    Inicia sesión!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={{ gap: 4, mt: 2 }}>
              <Formik<IRegisterUser>
                initialValues={{
                  correoElectronico: "",
                  passwordHash: "",
                  rol: "usuario",
                  nombre: "",
                }}
                onSubmit={async (values) => {
                  console.log(values);
                  toast.promise(
                    mutateAsync(values, {
                      onSuccess: () => {
                        navigate("/login")
                      },
                    }),
                    {
                      error: (result) => `${result}`,
                      loading: "Registrando nuevo usuario...",
                      success: (result) => `${result.message ?? ""}`,
                    }
                  );
                }}
                validationSchema={validationSchema}
              >
                {(formik) => (
                  <Form
                    onSubmit={formik.handleSubmit}
                    onReset={formik.handleReset}
                  >
                    <InputField
                      type="text"
                      name="nombre"
                      label="Nombre"
                      placeholder="Ej: Alexander"
                    />
                    <InputField
                      type="email"
                      name="correoElectronico"
                      label="Correo electrónico"
                      placeholder="smill@finazapp.com"
                    />
                    <InputField
                      type="password"
                      name="passwordHash"
                      label="Contraseña"
                      placeholder="**************"
                    />
                    <Stack sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                      </Box>
                      <Button type="submit" loading={isPending} fullWidth>
                        Registrarme
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © FinazApp {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={() => ({
          display: ["none", "none", "block"],
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/bg-login.jpeg)",
        })}
      />
    </>
  );
};

export default RegisterPage;
