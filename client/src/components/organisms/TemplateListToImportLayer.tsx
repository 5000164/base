import React from "react";
import styled from "styled-components";
import { Button, Layer } from "grommet";
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
      <TemplateListToImport />
      <Button label="close" onClick={() => closeImportDialog()} />
    </StyledLayer>
  );
};

const StyledLayer = styled(Layer)`
  width: min(1024px, 100%);
`;
