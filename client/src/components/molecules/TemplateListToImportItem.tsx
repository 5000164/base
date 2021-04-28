import React from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { Template } from "../../types/template";
import { importTemplate } from "../../repositories/templates";
import { AppContext } from "../../App";
import { TasksPageContext } from "../pages/TasksPage";

export const TemplateListToImportItem = ({
  template,
}: {
  template: Template;
}) => {
  const { client } = React.useContext(AppContext);
  const { reload } = React.useContext(TasksPageContext);

  return (
    <StyledTemplateListItem>
      <div>{template.name ?? ""}</div>
      <Button
        label="Import"
        onClick={() => importTemplate(client, template.id).then(() => reload())}
      />
    </StyledTemplateListItem>
  );
};

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 70px;
  grid-gap: 5px;
  margin: 5px 0;
`;
