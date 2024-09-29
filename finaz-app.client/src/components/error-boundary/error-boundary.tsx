import React from "react";
import { Flex } from "styled-system/jsx";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";

import { Button, Heading, Text } from "../park-ui";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const subtitle = React.useMemo(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        return "Esta pagina a la que intenta acceder no existe o ya no esta disponible.";
      }

      return "Hubo un error en la aplicación, reinicie o navegue hasta la pantalla principal.";
    }

    return "Ha ocurrido un error desconocido.";
  }, [error]);

  return (
    <Flex
      gap="2"
      flex={1}
      height="screen"
      width="screen"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading
        as="h1"
        color="red.10"
        textAlign="center"
        fontWeight="bold"
        fontSize="9xl"
      >
        {(isRouteErrorResponse(error) && error?.status) || 400}
      </Heading>
      <Text fontSize="3xl" fontWeight="bold" color="neutral.900">
        Hubo un error en la aplicación
      </Text>
      <Text as="p" fontSize="lg">
        {subtitle}
      </Text>
      <Flex justifyContent="center" gap={2} textAlign="center" mt="2">
        <Button onClick={() => navigate(-1)}>
          <IconArrowLeft name="arrow-left" />
          Volver
        </Button>
        <Button onClick={() => navigate("/")}>
          Ir a la pagina principal
          <IconHome name="home" />
        </Button>
      </Flex>
    </Flex>
  );
};

export default ErrorBoundary;
