import DefaultClient, { gql } from "apollo-boost";
import { Mutation, Query } from "schema/src/generated/client/graphql";
import { Sortable } from "shared/src/types/sortable";
import { Template } from "../types/template";
import { TemplateTask } from "../types/templateTask";

export const fetchTemplates = (
  client: DefaultClient<any>
): Promise<Template[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query {
          templates {
            templates {
              id
              name
            }
          }
        }
      `,
    })
    .then((result) => result.data.templates.templates);

export const addTemplate = (client: DefaultClient<any>): Promise<boolean> =>
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
    .then(() => true);

export const updateTemplate = (
  client: DefaultClient<any>,
  template: Template
): Promise<boolean> =>
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
    .then(() => true);

export const deleteTemplate = (
  client: DefaultClient<any>,
  id: number
): Promise<boolean> =>
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
    .then(() => true);

export const importTemplate = (
  client: DefaultClient<any>,
  templateId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($templateId: Int!) {
          tasks {
            importTemplate(id: $templateId)
          }
        }
      `,
      variables: { templateId },
    })
    .then(() => true);

export const fetchTasks = (
  client: DefaultClient<any>,
  templateId: number
): Promise<TemplateTask[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
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
      variables: { id: templateId },
    })
    .then((result) => result.data.templates.tasks);

export const updateTemplateTasksOrder = (
  client: DefaultClient<any>,
  updatedTemplateTasks: Sortable[]
): Promise<boolean> =>
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
    .then(() => true);

export const addTask = (
  client: DefaultClient<any>,
  templateId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($templateId: Int!) {
          templates {
            addTask(templateId: $templateId)
          }
        }
      `,
      variables: { templateId: templateId },
    })
    .then(() => true);

export const updateTask = (
  client: DefaultClient<any>,
  task: TemplateTask
): Promise<boolean> =>
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
    .then(() => true);

export const deleteTask = (
  client: DefaultClient<any>,
  taskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation($id: Int!) {
          templates {
            deleteTask(id: $id)
          }
        }
      `,
      variables: { id: taskId },
    })
    .then(() => true);
