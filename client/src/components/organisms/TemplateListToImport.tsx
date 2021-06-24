import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Template } from "../../types/template";
import { fetchTemplates } from "../../repositories/templates";
import { AppContext } from "../../App";
import { TemplateListToImportItem } from "../molecules/TemplateListToImportItem";

export const TemplateListToImport = ({
  importFunction,
}: {
  importFunction: (templateId: number) => void;
}) => {
  const { client } = React.useContext(AppContext);

  const [templates, setTemplates] = useState([] as Template[]);
  useEffect(() => {
    fetchTemplates(client).then((templates) => setTemplates(templates));
  }, [client]);

  return (
    <>
      <StyledTemplateList>
        {templates.map((template, index) => (
          <TemplateListToImportItem
            key={index}
            template={template}
            importFunction={importFunction}
          />
        ))}
      </StyledTemplateList>
    </>
  );
};

const StyledTemplateList = styled.ul`
  width: min(1024px, 100%);
  margin: 80px auto 4px;
  padding: 0;
`;
