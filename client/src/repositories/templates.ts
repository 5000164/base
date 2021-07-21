import { ApolloClient, gql } from "@apollo/client";
import {
  Mutation,
  Query,
  TemplatesUpdatedTemplateTask,
} from "schema/src/generated/client/graphql";
import { Template } from "../types/template";
import { TemplateTask } from "../types/templateTask";

export const fetchTemplates = (
  client: ApolloClient<any>
): Promise<Template[]> =>
  client
    .query<Query>({
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
  client: ApolloClient<any>,
  templateId: number
): Promise<TemplateTask[]> =>
  client
    .query<Query>({
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

export const addTemplate = (client: ApolloClient<any>): Promise<boolean> =>
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
  client: ApolloClient<any>,
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
