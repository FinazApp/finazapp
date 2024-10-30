import React from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import { Box, Flex } from "styled-system/jsx";

import { useRegister } from "@hooks";
import { IRegisterUser } from "@interfaces";
import { Button, Heading, Link, Text, TextField } from "@components";

const validationSchema = Yup.object({
  Nombre: Yup.string().required("El nombre es obligatorio"),
  CorreoElectronico: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  PasswordHash: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegister();

  return (
    <Box
      bg="neutral.2"
      display="flex"
      width="screen"
      height="screen"
      alignItems="center"
      justifyContent="center"
    >
      <Box px="10" py="8" boxShadow="lg" bg="Background" borderRadius="lg">
        <Box mb="5">
          <Heading as="h1" textAlign="center" fontSize="3xl">
            Crear nueva cuenta
          </Heading>
          <Text color="neutral.11" textAlign="center">
            Rellena para crear una nueva cuenta
          </Text>
        </Box>
        <Formik<IRegisterUser>
          initialValues={{
            Nombre: "",
            isDeleted: false,
            PasswordHash: "",
            CorreoElectronico: "",
          }}
          onSubmit={async (values) => {
            toast.promise(
              mutateAsync(values, {
                onSuccess: () => {
                  navigate("/login");
                },
              }),
              {
                error: (result) => `${result}`,
                loading: "Registrando usuario...",
                success: (result) =>
                  `${result.message ?? ""}. Redireccionando al inicio de sesión.`,
              }
            );
          }}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <Flex gap={5} flexDir="column">
                <TextField
                  name="Nombre"
                  label="Nombre completo"
                  placeholder="Ej. Jesimiel Martes"
                />
                <TextField
                  type="email"
                  name="CorreoElectronico"
                  label="Correo Electrónico"
                  placeholder="jesimiel@finazapp.com"
                />
                <TextField
                  type="password"
                  label="Contraseña"
                  name="PasswordHash"
                  placeholder="**********"
                />
                <Button type="submit" variant="solid" loading={isPending}>
                  Registrarte
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        <Text as="p" textAlign="center" fontSize="sm" color="neutral.11" mt={4}>
          ¿Ya tienes cuenta?
          <Link href="/login" fontSize="sm" ml={1}>
            Inicia sesión
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default RegisterPage;
