import React from "react";
import styled from "styled-components";
import { Template } from "../../App";

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
    <StyledInput
      type="text"
      value={template.name ?? ""}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => updateTemplate(template)}
    />
    <button onClick={() => editTasks()}>Edit</button>
    <button onClick={() => archiveTemplate(template.id)}>Archive</button>
    <button onClick={() => deleteTemplate(template.id)}>Delete</button>
  </StyledTemplateListItem>
);

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr repeat(3, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;

const StyledInput = styled.input`
  font-size: 1.5rem;
`;
