import DefaultClient, { gql } from "apollo-boost";
import {
  Mutation,
  Query,
  TemplatesUpdatedTemplateTask,
} from "schema/src/generated/client/graphql";
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
            all {
              templateId
              name
            }
          }
        }
      `,
    })
    .then((result) => result.data.templates.all);

export const fetchTasks = (
  client: DefaultClient<any>,
  templateId: number
): Promise<TemplateTask[]> =>
  client
    .query<Query>({
      fetchPolicy: "no-cache",
      query: gql`
        query ($templateId: Int!) {
          templates {
            tasks(templateId: $templateId) {
              templateTaskId
              name
              estimate
              previousId
              nextId
            }
          }
        }
      `,
      variables: { templateId },
    })
    .then((result) => result.data.templates.tasks as TemplateTask[]);

export const addTemplate = (client: DefaultClient<any>): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation {
          templates {
            add
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
        mutation ($templateId: Int!, $name: String) {
          templates {
            update(templateId: $templateId, name: $name)
          }
        }
      `,
      variables: template,
    })
    .then(() => true);

export const deleteTemplate = (
  client: DefaultClient<any>,
  templateId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateId: Int!) {
          templates {
            delete(templateId: $templateId)
          }
        }
      `,
      variables: { templateId },
    })
    .then(() => true);

export const addTask = (
  client: DefaultClient<any>,
  templateId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateId: Int!) {
          templates {
            addTask(templateId: $templateId)
          }
        }
      `,
      variables: { templateId },
    })
    .then(() => true);

export const updateTask = (
  client: DefaultClient<any>,
  task: TemplateTask
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateTaskId: Int!, $name: String, $estimate: Int) {
          templates {
            updateTask(
              templateTaskId: $templateTaskId
              name: $name
              estimate: $estimate
            )
          }
        }
      `,
      variables: task,
    })
    .then(() => true);

export const deleteTask = (
  client: DefaultClient<any>,
  templateTaskId: number
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($templateTaskId: Int!) {
          templates {
            deleteTask(templateTaskId: $templateTaskId)
          }
        }
      `,
      variables: { templateTaskId },
    })
    .then(() => true);

export const updateTemplateTasksOrder = (
  client: DefaultClient<any>,
  updatedTemplateTasks: TemplatesUpdatedTemplateTask[]
): Promise<boolean> =>
  client
    .mutate<Mutation>({
      mutation: gql`
        mutation ($updatedTemplateTasks: [TemplatesUpdatedTemplateTask!]!) {
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
