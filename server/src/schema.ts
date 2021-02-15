import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { Resolvers, Task_Tracks_Fetch_Type } from "./generated/schema/graphql";
import { Status } from "./generated/shared/types/status";
import {
  addTask,
  changeTaskStatus,
  deleteTask,
  importTemplate,
  updatePlanTasksOrder,
  updateTask,
} from "./plan";
import {
  addTemplateTask,
  deleteTemplateTask,
  updateTemplateTask,
  updateTemplateTasksOrder,
} from "./templates";

const schema = loadSchemaSync(
  join(__dirname, "./generated/schema/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const resolvers: Resolvers = {
  Query: {
    plan: () => ({ tasks: undefined, recordedTasks: undefined }),
    templates: () => ({ templates: undefined, tasks: undefined }),
    task_tracks: () => ({ task_tracks: undefined }),
  },
  Mutation: {
    plan: () => ({
      addTask: undefined,
      updateTask: undefined,
      completeTask: undefined,
      archiveTask: undefined,
      deleteTask: undefined,
      importTemplate: undefined,
      updatePlanTasksOrder: undefined,
    }),
    templates: () => ({
      addTemplate: undefined,
      updateTemplate: undefined,
      archiveTemplate: undefined,
      deleteTemplate: undefined,
      addTask: undefined,
      updateTask: undefined,
      deleteTask: undefined,
    }),
    task_tracks: () => ({
      start_task_track: undefined,
      stop_task_track: undefined,
      update_task_track: undefined,
    }),
  },
  Plan_Query: {
    tasks: (parent, args, context) =>
      context.prisma.tasks.findMany({ where: { status: Status.Normal } }),
    recordedTasks: (parent, args, context) => {
      const date = new Date(
        new Date(Date.parse(args.date)).setHours(0, 0, 0, 0)
      );
      const nextDate = new Date(
        new Date(new Date(date).setDate(date.getDate() + 1)).setHours(
          0,
          0,
          0,
          0
        )
      );
      return context.prisma.tasks.findMany({
        where: {
          status: { in: [Status.Completed, Status.Archived] },
          AND: [
            {
              status_changed_at: { gte: Math.floor(date.getTime() / 1000) },
            },
            {
              status_changed_at: {
                lt: Math.floor(nextDate.getTime() / 1000),
              },
            },
          ],
        },
        orderBy: {
          status_changed_at: "desc",
        },
      });
    },
  },
  Plan_Mutation: {
    addTask: (parent, args, context) => addTask(context),
    updateTask: (parent, args, context) =>
      updateTask(context, args.id, args.name, args.estimate, args.actual),
    completeTask: (parent, args, context) =>
      changeTaskStatus(context, args.id, Status.Completed),
    archiveTask: (parent, args, context) =>
      changeTaskStatus(context, args.id, Status.Archived),
    deleteTask: (parent, args, context) => deleteTask(context, args.id),
    importTemplate: async (parent, args, context) =>
      importTemplate(context, args.id),
    updatePlanTasksOrder: (parent, args, context) =>
      updatePlanTasksOrder(context, args.updatedPlanTasks),
  },
  Templates_Query: {
    templates: (parent, args, context) =>
      context.prisma.templates.findMany({ where: { status: Status.Normal } }),
    tasks: (parent, args, context) =>
      context.prisma.template_tasks.findMany({
        where: { templateId: args.templateId },
      }),
  },
  Templates_Mutation: {
    addTemplate: (parent, args, context) =>
      context.prisma.templates.create({
        data: {
          name: args.name,
          status: Status.Normal,
        },
      }),
    updateTemplate: (parent, args, context) => {
      const data = {
        ...(args.name ? { name: args.name } : {}),
      };
      return context.prisma.templates.update({
        where: { id: args.id },
        data,
      });
    },
    archiveTemplate: (parent, args, context) =>
      context.prisma.templates.update({
        where: { id: args.id },
        data: {
          status: Status.Archived,
          status_changed_at: Math.floor(Date.now() / 1000),
        },
      }),
    deleteTemplate: async (parent, args, context) => {
      await context.prisma.template_tasks.deleteMany({
        where: { templateId: args.id },
      });
      return context.prisma.templates.delete({
        where: { id: args.id },
      });
    },
    addTask: (parent, args, context) =>
      addTemplateTask(context, args.templateId),
    updateTask: (parent, args, context) =>
      updateTemplateTask(context, args.id, args.name, args.estimate),
    deleteTask: (parent, args, context) => deleteTemplateTask(context, args.id),
    updateTemplateTasksOrder: (parent, args, context) =>
      updateTemplateTasksOrder(context, args.updatedTemplateTasks),
  },
  Task_Tracks_Query: {
    task_tracks: (parent, args, context) =>
      args.fetch_type === Task_Tracks_Fetch_Type.All
        ? context.prisma.task_tracks.findMany({
            include: {
              task: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              start_at: "desc",
            },
          })
        : context.prisma.task_tracks.findMany({
            where: { stop_at: null },
            include: {
              task: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              start_at: "asc",
            },
          }),
  },
  Task_Tracks_Mutation: {
    start_task_track: (parent, args, context) =>
      context.prisma.task_tracks.create({
        data: {
          start_at: Math.floor(Date.now() / 1000),
          task: {
            connect: {
              id: args.task_id,
            },
          },
        },
        include: {
          task: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    stop_task_track: (parent, args, context) =>
      context.prisma.task_tracks.update({
        where: {
          task_track_id: args.task_track_id,
        },
        data: {
          stop_at: Math.floor(Date.now() / 1000),
        },
        include: {
          task: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    stop_task_track_by_task_id: async (parent, args, context) => {
      await context.prisma.task_tracks.updateMany({
        where: {
          task_id: args.task_id,
          stop_at: null,
        },
        data: {
          stop_at: Math.floor(Date.now() / 1000),
        },
      });
      return true;
    },
    update_task_track: (parent, args, context) => {
      const data = {
        ...(args.start_at ? { start_at: args.start_at } : {}),
        ...(args.stop_at ? { stop_at: args.stop_at } : {}),
      };
      return context.prisma.task_tracks.update({
        where: { task_track_id: args.task_track_id },
        data,
        include: {
          task: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
  },
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});
