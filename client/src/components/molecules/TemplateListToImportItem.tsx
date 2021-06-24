import React from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { Template } from "../../types/template";

export const TemplateListToImportItem = ({
  template,
  importFunction,
}: {
  template: Template;
  importFunction: (templateId: number) => void;
}) => {
  return (
    <StyledTemplateListItem>
      <div>{template.name ?? ""}</div>
      <Button label="Import" onClick={() => importFunction(template.id)} />
    </StyledTemplateListItem>
  );
};

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 70px;
  grid-gap: 5px;
  margin: 5px 0;
`;
