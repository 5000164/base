import React, { useState } from "react";
import DefaultClient, { gql } from "apollo-boost";
import styled from "styled-components";
import { Button } from "grommet";
import { Template } from "../../App";
import { Mutation } from "../../generated/graphql";

export const TemplateListItemToImport = ({
  client,
  reloadTasks,
  template,
}: {
  client: DefaultClient<any>;
  reloadTasks: Function;
  template: Template;
}) => {
  const [error, setError] = useState(false);

  const importTemplate = (templateId: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($templateId: Int!) {
            plan {
              importTemplate(id: $templateId)
            }
          }
        `,
        variables: { templateId },
      })
      .then(() => {
        reloadTasks();
      })
      .catch(() => setError(true));
  };

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={() => importTemplate(template.id)}>Retry</button>
        </>
      ) : (
        <>
          <StyledTemplateListItem>
            <div>{template.name ?? ""}</div>
            <Button
              label="Import"
              onClick={() => importTemplate(template.id)}
            />
          </StyledTemplateListItem>
        </>
      )}
    </>
  );
};

const StyledTemplateListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr 70px;
  grid-gap: 5px;
  margin: 5px 0;
`;
