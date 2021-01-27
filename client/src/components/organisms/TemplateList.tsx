import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import { setName, Template } from "../../types/template";
import { addTemplate, fetchTemplates } from "../../repositories/templates";
import { AppContext } from "../../App";
import { TemplatesPageContext } from "../pages/TemplatesPage";
import { TemplateListItem } from "../molecules/TemplateListItem";

export const TemplateList = () => {
  const { client } = React.useContext(AppContext);
  const {
    reloadCount,
    reload,
    showEditDialog,
    setSelectedTemplate,
  } = React.useContext(TemplatesPageContext);

  const [templates, setTemplates] = useState([] as Template[]);
  useEffect(() => {
    fetchTemplates(client).then((templates) => setTemplates(templates));
  }, [client, reloadCount]);

  return (
    <>
      <StyledTemplateList>
        {templates.map((template, index) => (
          <TemplateListItem
            key={index}
            template={template}
            setName={(v: string) => setName(templates, setTemplates, index, v)}
            editTasks={() => {
              setSelectedTemplate(template.id, template.name);
              showEditDialog();
            }}
          />
        ))}
      </StyledTemplateList>
      <AddButtonWrapper>
        <Button
          label="Add"
          onClick={() => addTemplate(client).then(() => reload())}
        />
      </AddButtonWrapper>
    </>
  );
};

const StyledTemplateList = styled.ul`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;

const AddButtonWrapper = styled.div`
  width: min(1024px, 100%);
  margin: 4px auto;
`;
