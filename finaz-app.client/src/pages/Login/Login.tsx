import React from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Form, Formik } from "formik";
import { Box, Flex } from "styled-system/jsx";

import { useLogin } from "@hooks";
import { ILoginUser } from "@interfaces";
import { Button, Heading, Link, Text, TextField } from "@components";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  hashContraseña: Yup.string().required("La contraseña es obligatoria"),
});

const LoginPage = () => {
  const { mutateAsync, isPending } = useLogin();

  return (
    <Flex
      h="screen"
      w="screen"
      bg="neutral.2"
      flexDirection={{ mdDown: "column", lg: "row" }}
    >
      <Flex flex={1} px={[2, 2, 6, 8]} justifyContent="center" alignItems="center">
        <Box
          py={8}
          boxShadow="lg"
          bg="Background"
          borderRadius="lg"
          px={{ mdDown: 6, md: 6, lg: 8 }}
        >
          <Box mb="5">
            <Heading as="h1" textAlign="center" fontSize="3xl">
              Iniciar Sesión
            </Heading>
            <Text color="neutral.11" textAlign="center">
              Rellena para iniciar sesión
            </Text>
          </Box>
          <Formik<ILoginUser>
            initialValues={{ email: "", hashContraseña: "" }}
            onSubmit={async (values) => {
              toast.promise(
                mutateAsync(values, {
                  onSuccess: (data) => {
                    console.log("Datos recibidos:", data);
                  },
                }),
                {
                  error: (result) => `${result}`,
                  loading: "Iniciando sesión...",
                  success: (result) => `${result.message ?? ""}`,
                }
              );
            }}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <Flex gap={5} flexDir="column">
                  <TextField
                    type="email"
                    name="email"
                    label="Correo Electrónico"
                    placeholder="emelyn@finazapp.com"
                  />
                  <TextField
                    type="password"
                    label="Contraseña"
                    name="hashContraseña"
                    placeholder="**********"
                  />
                  <Button type="submit" variant="solid" loading={isPending}>
                    Iniciar sesión
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
          <Text
            as="p"
            textAlign="center"
            fontSize="sm"
            color="neutral.11"
            mt={4}
          >
            ¿No tienes cuenta?
            <Link href="/register" fontSize="sm" ml={1}>
              Regístrate
            </Link>
          </Text>
        </Box>
      </Flex>
      <Flex
        flex={1}
        bg="blue"
        backgroundSize="cover"
        backgroundPosition="center"
        display={{ mdDown: "none" }}
        backgroundImage="url('/bg-login.jpeg')"
      >
        s
      </Flex>
    </Flex>
  );
};

export default LoginPage;
