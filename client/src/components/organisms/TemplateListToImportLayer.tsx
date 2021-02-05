import React from "react";
import styled from "styled-components";
import { Box, Button, Layer } from "grommet";
import { PlanPageContext } from "../pages/PlanPage";
import { TemplateListToImport } from "./TemplateListToImport";

export const TemplateListToImportLayer = () => {
  const { closeImportDialog } = React.useContext(PlanPageContext);

  return (
    <StyledLayer
      full={"vertical"}
      margin={"large"}
      onEsc={() => closeImportDialog()}
      onClickOutside={() => closeImportDialog()}
    >
      <Box fill="vertical" overflow="scroll">
        <TemplateListToImport />
        <Button label="close" onClick={() => closeImportDialog()} />
      </Box>
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
