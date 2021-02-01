import React from "react";
import styled from "styled-components";
import { Button, TextInput } from "grommet";
import { Template } from "../../types/template";
import { deleteTemplate, updateTemplate } from "../../repositories/templates";
import { AppContext } from "../../App";
import { TemplatesPageContext } from "../pages/TemplatesPage";

export const TemplateListItem = ({
  template,
  setName,
  editTasks,
}: {
  template: Template;
  setName: (name: string) => void;
  editTasks: () => void;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(TemplatesPageContext);

  return (
    <StyledTemplateListItem>
      <TextInput
        type="text"
        value={template.name ?? ""}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => updateTemplate(client, template).then()}
      />
      <Button label="Edit" onClick={() => editTasks()} />
      <Button
        label="Delete"
        onClick={() => deleteTemplate(client, template.id).then(() => reload())}
      />
    </StyledTemplateListItem>
  );
};

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr repeat(2, 70px);
  grid-gap: 5px;
  margin: 5px 0;
`;
