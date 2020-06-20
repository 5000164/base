import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "grommet";
import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "../../generated/graphql";
import { Template } from "../../App";
import { TemplateListItem } from "../TemplateListItem";
import { TemplateTaskListLayer } from "../TemplateTaskListLayer";

export const TemplateList = ({ client }: { client: DefaultClient<any> }) => {
  const [templates, setTemplates] = useState([] as Template[]);
  const [error, setError] = useState(false);
  const [templateIndex, setTemplateIndex] = React.useState(0);
  const [show, setShow] = React.useState(false);

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
  useEffect(fetchTemplates, []);

  const setName = (index: number, name: string) => {
    const newTemplates = [...templates];
    newTemplates[index].name = name;
    setTemplates(newTemplates);
  };

  const editTasks = (index: number) => {
    setTemplateIndex(index);
    setShow(true);
  };

  const addTemplate = () => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation {
            templates {
              addTemplate(name: "") {
                id
                name
              }
            }
          }
        `,
      })
      .then((result) => {
        if (result.data) {
          setTemplates([
            ...templates,
            {
              id: result.data.templates.addTemplate.id,
              name: result.data.templates.addTemplate.name,
            },
          ]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  const updateTemplate = (template: Template) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!, $name: String) {
            templates {
              updateTemplate(id: $id, name: $name) {
                id
              }
            }
          }
        `,
        variables: template,
      })
      .catch(() => setError(true));
  };

  const archiveTemplate = (id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!) {
            templates {
              archiveTemplate(id: $id) {
                id
              }
            }
          }
        `,
        variables: { id },
      })
      .then(() => setTemplates(templates.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

  const deleteTemplate = (id: number) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!) {
            templates {
              deleteTemplate(id: $id) {
                id
              }
            }
          }
        `,
        variables: { id },
      })
      .then(() => setTemplates(templates.filter((t) => t.id !== id)))
      .catch(() => setError(true));
  };

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
              <TemplateListItem
                key={index}
                template={template}
                setName={(v: string) => setName(index, v)}
                editTasks={() => editTasks(index)}
                updateTemplate={updateTemplate}
                archiveTemplate={archiveTemplate}
                deleteTemplate={deleteTemplate}
              />
            ))}
          </StyledTemplateList>
          <AddButtonWrapper>
            <Button label="Add" onClick={addTemplate} />
          </AddButtonWrapper>
          {show && (
            <TemplateTaskListLayer
              client={client}
              template={templates[templateIndex]}
              setShow={setShow}
            />
          )}
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

const AddButtonWrapper = styled.div`
  width: 1024px;
  margin: 4px auto;
`;
