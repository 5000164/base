import React from "react";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
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
      <Box fill="vertical" overflow="scroll">
        <TemplateTaskList />
        <Button label="close" onClick={() => closeEditDialog()} />
      </Box>
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
