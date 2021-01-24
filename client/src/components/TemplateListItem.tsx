import React from "react";
import styled from "styled-components";
import { Button, TextInput } from "grommet";
import { Template } from "../App";

export const TemplateListItem = ({
  template,
  setName,
  editTasks,
  updateTemplate,
  archiveTemplate,
  deleteTemplate,
}: {
  template: Template;
  setName: Function;
  editTasks: Function;
  updateTemplate: Function;
  archiveTemplate: Function;
  deleteTemplate: Function;
}) => (
  <StyledTemplateListItem>
    <TextInput
      type="text"
      value={template.name ?? ""}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => updateTemplate(template)}
    />
    <Button label="Edit" onClick={() => editTasks()} />
    <Button label="Archive" onClick={() => archiveTemplate(template.id)} />
    <Button label="Delete" onClick={() => deleteTemplate(template.id)} />
  </StyledTemplateListItem>
);

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr repeat(3, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
