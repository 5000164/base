import React from "react";
import styled from "styled-components";
import { Button, Layer } from "grommet";
import { TemplatesPageContext } from "../pages/TemplatesPage";
import { TemplateTaskList } from "./TemplateTaskList";

export const TemplateTaskListLayer = () => {
  const { closeEditDialog } = React.useContext(TemplatesPageContext);

  return (
    <StyledLayer
      full={"vertical"}
      margin={"large"}
      onEsc={() => closeEditDialog()}
      onClickOutside={() => closeEditDialog()}
    >
      <TemplateTaskList />
      <Button label="close" onClick={() => closeEditDialog()} />
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
