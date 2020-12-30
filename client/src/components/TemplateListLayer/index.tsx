import React from "react";
import styled from "styled-components";
import { Button, Layer } from "grommet";
import DefaultClient from "apollo-boost";
import { TemplateListToImport } from "../TemplateListToImport";

export const TemplateListLayer = ({
  client,
  reloadTasks,
  setShow,
}: {
  client: DefaultClient<any>;
  reloadTasks: Function;
  setShow: Function;
}) => {
  return (
    <StyledLayer
      full={"vertical"}
      margin={"large"}
      onEsc={() => setShow(false)}
      onClickOutside={() => setShow(false)}
    >
      <TemplateListToImport client={client} reloadTasks={reloadTasks} />
      <Button label="close" onClick={() => setShow(false)} />
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
