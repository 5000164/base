import React, { useEffect, useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Query } from "../../generated/graphql";
import { Template } from "../../App";
import { TemplateListItemToImport } from "../TemplateListItemToImport";

export const TemplateListToImport = ({
  client,
  reloadTasks,
}: {
  client: DefaultClient<any>;
  reloadTasks: Function;
}) => {
  const [templates, setTemplates] = useState([] as Template[]);
  const [error, setError] = useState(false);

  const fetchTemplates = () => {
    setError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          {
            templates {
              templates {
                id
                name
              }
            }
          }
        `,
      })
      .then((result) => setTemplates(result.data?.templates?.templates ?? []))
      .catch(() => setError(true));
  };
  useEffect(fetchTemplates, [client]);

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTemplates}>Retry</button>
        </>
      ) : (
        <>
          <StyledTemplateList>
            {templates.map((template, index) => (
              <TemplateListItemToImport
                key={index}
                client={client}
                reloadTasks={reloadTasks}
                template={template}
              />
            ))}
          </StyledTemplateList>
        </>
      )}
    </>
  );
};

const StyledTemplateList = styled.ul`
  width: 1024px;
  margin: 80px auto 4px;
  padding: 0;
`;
