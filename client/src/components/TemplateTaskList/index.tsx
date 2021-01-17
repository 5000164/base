import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "../../generated/graphql";
import { Task, Template, TemplateTask } from "../../App";
import { TemplateTaskListItem } from "../TemplateTaskListItem";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

export const TemplateTaskList = ({
  client,
  template,
  reloadCount,
  reload,
}: {
  client: DefaultClient<any>;
  template: Template;
  reloadCount: number;
  reload: Function;
}) => {
  const [tasks, setTasks] = useState([] as TemplateTask[]);
  const [error, setError] = useState(false);

  const sort = (tasks: TemplateTask[]): TemplateTask[] => {
    const [firstTask] = tasks.splice(
      tasks.findIndex((t) => !t.previous_id),
      1
    );

    if (firstTask) {
      const sortedTasks = [];
      sortedTasks.push(firstTask);

      const sort = (
        nextId: number,
        remainTasks: Task[],
        sortedTasks: Task[]
      ): Task[] => {
        if (remainTasks.length === 0) {
          return sortedTasks;
        }

        const [nextTask] = remainTasks.splice(
          remainTasks.findIndex((t) => t.id === nextId),
          1
        );
        sortedTasks.push(nextTask);

        if (nextTask.next_id) {
          return sort(nextTask.next_id, remainTasks, sortedTasks);
        } else {
          return [...sortedTasks, ...remainTasks];
        }
      };

      if (firstTask.next_id) {
        return sort(firstTask.next_id, tasks, sortedTasks);
      } else {
        return [...sortedTasks, ...tasks];
      }
    } else {
      return tasks;
    }
  };

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
                previous_id
                next_id
              }
            }
          }
        `,
        variables: { id: template.id },
      })
      .then((result) => setTasks(sort(result.data?.templates?.tasks ?? [])))
      .catch(() => setError(true));
  };
  useEffect(fetchTasks, [client, template, reloadCount]);

  const updateTemplateTasksOrder = (
    updatedTemplateTasks: {
      id: number;
      previous_id?: number | null;
      next_id?: number | null;
    }[]
  ) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($updatedTemplateTasks: [Templates_Updated_Template_Task!]!) {
            templates {
              updateTemplateTasksOrder(
                updatedTemplateTasks: $updatedTemplateTasks
              )
            }
          }
        `,
        variables: {
          updatedTemplateTasks,
        },
      })
      .catch(() => setError(true));
  };

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
              addTask(templateId: $templateId)
            }
          }
        `,
        variables: { templateId: template.id },
      })
      .then(() => reload())
      .catch(() => setError(true));
  };

  const updateTask = (task: TemplateTask) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!, $name: String, $estimate: Int) {
            templates {
              updateTask(id: $id, name: $name, estimate: $estimate)
            }
          }
        `,
        variables: task,
      })
      .catch(() => setError(true));
  };

  const deleteTask = (task: TemplateTask) => {
    setError(false);
    client
      .mutate<Mutation>({
        mutation: gql`
          mutation($id: Int!) {
            templates {
              deleteTask(id: $id)
            }
          }
        `,
        variables: task,
      })
      .then(() => reload())
      .catch(() => setError(true));
  };

  const reorderTemplateTasks = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const {
      destination: { index: di },
      source: { index: si },
    } = result;

    if (di === si) {
      return;
    }

    const newTemplateTasks = [...tasks];
    const updatedTemplateTasks = [] as {
      id: number;
      previous_id?: number | null;
      next_id?: number | null;
    }[];
    const [reorderedTemplateTask] = newTemplateTasks.splice(si, 1);

    if (reorderedTemplateTask.previous_id && reorderedTemplateTask.next_id) {
      newTemplateTasks[si - 1].next_id = reorderedTemplateTask.next_id;
      updatedTemplateTasks.push({
        id: newTemplateTasks[si - 1].id,
        next_id: newTemplateTasks[si - 1].next_id,
      });

      newTemplateTasks[si].previous_id = reorderedTemplateTask.previous_id;
      updatedTemplateTasks.push({
        id: newTemplateTasks[si].id,
        previous_id: newTemplateTasks[si].previous_id,
      });
    } else if (
      !reorderedTemplateTask.previous_id &&
      reorderedTemplateTask.next_id
    ) {
      newTemplateTasks[si].previous_id = undefined;
      updatedTemplateTasks.push({
        id: newTemplateTasks[si].id,
        previous_id: null,
      });
    } else if (
      reorderedTemplateTask.previous_id &&
      !reorderedTemplateTask.next_id
    ) {
      newTemplateTasks[si - 1].next_id = undefined;
      updatedTemplateTasks.push({
        id: newTemplateTasks[si - 1].id,
        next_id: null,
      });
    }

    newTemplateTasks.splice(di, 0, reorderedTemplateTask);
    setTasks(newTemplateTasks);

    if (di === 0) {
      reorderedTemplateTask.previous_id = undefined;
    } else {
      reorderedTemplateTask.previous_id = newTemplateTasks[di - 1].id;
      newTemplateTasks[di - 1].next_id = reorderedTemplateTask.id;
      updatedTemplateTasks.push({
        id: newTemplateTasks[di - 1].id,
        next_id: newTemplateTasks[di - 1].next_id,
      });
    }

    if (di === newTemplateTasks.length - 1) {
      reorderedTemplateTask.next_id = undefined;
    } else {
      reorderedTemplateTask.next_id = newTemplateTasks[di + 1].id;
      newTemplateTasks[di + 1].previous_id = reorderedTemplateTask.id;
      updatedTemplateTasks.push({
        id: newTemplateTasks[di + 1].id,
        previous_id: newTemplateTasks[di + 1].previous_id,
      });
    }

    updatedTemplateTasks.push({
      id: reorderedTemplateTask.id,
      next_id: reorderedTemplateTask.next_id ?? null,
      previous_id: reorderedTemplateTask.previous_id ?? null,
    });

    updateTemplateTasksOrder(
      updatedTemplateTasks.reduce((tasks, task) => {
        const index = tasks.findIndex((t) => t.id === task.id);
        if (index === -1) {
          tasks.push(task);
        } else {
          tasks[index] = { ...tasks[index], ...task };
        }
        return tasks;
      }, [] as { id: number; previous_id?: number | null; next_id?: number | null }[])
    );
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
          <DragDropContext onDragEnd={reorderTemplateTasks}>
            <Droppable droppableId="template-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, index) => (
                    <TemplateTaskListItem
                      key={index}
                      task={task}
                      index={index}
                      setName={(v: string) => setName(index, v)}
                      setEstimate={(v: number) => setEstimate(index, v)}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
  width: min(1024px, 100%);
  margin: 4px auto;
`;
