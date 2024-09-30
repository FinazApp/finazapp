import React from "react";
import { Box } from "styled-system/jsx";
import { Button } from "src/components/park-ui/styled/button";
import { Input } from "src/components/park-ui/styled/field";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre de usuario es obligatorio"),
    contrasena: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      contrasena: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Datos enviados:", values);
      // Aquí puedes manejar el envío del formulario
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      minHeight="100vh"
      bgColor="#f5f5f5"
      padding="0 40px"
    >
      <Box
        width="470px"
        padding="40px"
        bgColor="#f1f1f1"
        borderRadius="8px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "12px",
            color: "black",
            fontSize: "xx-large",
            fontWeight: "bold",
          }}
        >
          INICIAR SESIÓN
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "24px",
            color: "grey",
          }}
        >
          Bienvenido/a, rellena para ingresar
        </p>

        <form onSubmit={formik.handleSubmit}>
          <label
            htmlFor="nombre"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Nombre:
          </label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Nombre de usuario"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "97%",
              marginBottom: "16px",
              backgroundColor: "white",
            }}
          />
          {formik.touched.nombre && formik.errors.nombre ? (
            <p
              style={{
                color: "red",
                marginBottom: "16px",
              }}
            >
              {formik.errors.nombre}
            </p>
          ) : null}

          <label
            htmlFor="contrasena"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Contraseña:
          </label>
          <Input
            id="contrasena"
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            value={formik.values.contrasena}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "97%",
              marginBottom: "24px",
              backgroundColor: "white",
            }}
          />
          {formik.touched.contrasena && formik.errors.contrasena ? (
            <p style={{ color: "red", marginBottom: "24px" }}>
              {formik.errors.contrasena}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="solid"
            color="primary"
            background="black"
            style={{ width: "97%" }}
          >
            INICIAR SESIÓN
          </Button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            color: "#566573 ",
            fontSize: "13px",
          }}
        >
          ¿No te has registrado aun?{" "}
          <a
            href="#"
            style={{ fontSize: "14px", color: "black", fontWeight: "600" }}
          >
            Regístrate!
          </a>
        </p>
      </Box>

      <Box
        width="66%"
        display="flex"
        justifyContent="right"
        alignItems="center"
        padding="5px"
        margin="-60px"
        height="105vh" // Asegura que el contenedor tenga la altura completa de la ventana
      >
        <img
          src="src/assets/imag.jpeg"
          alt="Imagen a la derecha"
          style={{
            maxWidth: "100%",
            height: "100%",
            //objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
