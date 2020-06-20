import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "../../generated/graphql";
import { Template, TemplateTask } from "../../App";
import { TemplateTaskListItem } from "../TemplateTaskListItem";

export const TemplateTaskList = ({
  client,
  template,
}: {
  client: DefaultClient<any>;
  template: Template;
}) => {
  const [tasks, setTasks] = useState([] as TemplateTask[]);
  const [error, setError] = useState(false);

  const fetchTasks = () => {
    setError(false);
    client
      .query<Query>({
        fetchPolicy: "network-only",
        query: gql`
          query($id: Int!) {
            templates {
              tasks(templateId: $id) {
                id
                name
                estimate
              }
            }
          }
        `,
        variables: { id: template.id },
      })
      .then((result) => {
        if (result.data) {
          setTasks(result.data.templates.tasks);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, []);

  const setName = (index: number, name: string) => {
    const newTasks = [...tasks];
    newTasks[index].name = name;
    setTasks(newTasks);
  };

  const setEstimate = (index: number, estimate: number) => {
    const newTasks = [...tasks];
    newTasks[index].estimate = estimate;
    setTasks(newTasks);
  };

  const addTask = () => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($templateId: Int!) {
            templates {
              addTask(templateId: $templateId, name: "") {
                id
                name
                estimate
              }
            }
          }
        `,
        variables: { templateId: template.id },
      })
      .then((result) => {
        if (result.data) {
          setTasks([
            ...tasks,
            {
              id: result.data.templates.addTask.id,
              name: result.data.templates.addTask.name,
              estimate: result.data?.templates?.addTask.estimate,
            },
          ]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  const updateTask = (task: TemplateTask) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!, $name: String, $estimate: Int) {
            templates {
              updateTask(id: $id, name: $name, estimate: $estimate) {
                id
              }
            }
          }
        `,
        variables: task,
      })
      .catch(() => setError(true));
  };

  return (
    <>
      {error ? (
        <>
          <div>Error</div>
          <button onClick={fetchTasks}>Retry</button>
        </>
      ) : (
        <>
          <TemplateName>{template.name}</TemplateName>
          {tasks.map((task, index) => (
            <TemplateTaskListItem
              key={index}
              task={task}
              setName={(v: string) => setName(index, v)}
              setEstimate={(v: number) => setEstimate(index, v)}
              updateTask={updateTask}
              deleteTask={() => []}
            />
          ))}
          <AddButtonWrapper>
            <button onClick={addTask}>Add</button>
          </AddButtonWrapper>
        </>
      )}
    </>
  );
};

const TemplateName = styled.div`
  margin: 20px auto;
`;

const AddButtonWrapper = styled.div`
  width: 1024px;
  margin: 4px auto;
`;
