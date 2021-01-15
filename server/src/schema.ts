import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";
import { Status } from "./server";
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

const typeDefs = importSchema(
  path.join(__dirname, "./generated/schema.graphql")
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
    }),
  },
  Plan_Query: {
    tasks: (parent, args, ctx) =>
      ctx.prisma.tasks.findMany({ where: { status: Status.Normal } }),
    recordedTasks: (parent, args, ctx) => {
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
      return ctx.prisma.tasks.findMany({
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
    addTask: (parent, args, ctx) => addTask(ctx),
    updateTask: (parent, args, ctx) =>
      updateTask(ctx, args.id, args.name, args.estimate, args.actual),
    completeTask: (parent, args, ctx) =>
      changeTaskStatus(ctx, args.id, Status.Completed),
    archiveTask: (parent, args, ctx) =>
      changeTaskStatus(ctx, args.id, Status.Archived),
    deleteTask: (parent, args, ctx) => deleteTask(ctx, args.id),
    importTemplate: async (parent, args, ctx) => importTemplate(ctx, args.id),
    updatePlanTasksOrder: (parent, args, ctx) =>
      updatePlanTasksOrder(ctx, args.updatedPlanTasks),
  },
  Templates_Query: {
    templates: (parent, args, ctx) =>
      ctx.prisma.templates.findMany({ where: { status: Status.Normal } }),
    tasks: (parent, args, ctx) =>
      ctx.prisma.template_tasks.findMany({
        where: { templateId: args.templateId },
      }),
  },
  Templates_Mutation: {
    addTemplate: (parent, args, ctx) =>
      ctx.prisma.templates.create({
        data: {
          name: args.name,
          status: Status.Normal,
        },
      }),
    updateTemplate: (parent, args, ctx) => {
      const data = {
        ...(args.name ? { name: args.name } : {}),
      };
      return ctx.prisma.templates.update({
        where: { id: args.id },
        data,
      });
    },
    archiveTemplate: (parent, args, ctx) =>
      ctx.prisma.templates.update({
        where: { id: args.id },
        data: {
          status: Status.Archived,
          status_changed_at: Math.floor(Date.now() / 1000),
        },
      }),
    deleteTemplate: async (parent, args, ctx) => {
      await ctx.prisma.template_tasks.deleteMany({
        where: { templateId: args.id },
      });
      return ctx.prisma.templates.delete({
        where: { id: args.id },
      });
    },
    addTask: (parent, args, ctx) => addTemplateTask(ctx, args.templateId),
    updateTask: (parent, args, ctx) =>
      updateTemplateTask(ctx, args.id, args.name, args.estimate),
    deleteTask: (parent, args, ctx) => deleteTemplateTask(ctx, args.id),
    updateTemplateTasksOrder: (parent, args, ctx) =>
      updateTemplateTasksOrder(ctx, args.updatedTemplateTasks),
  },
  Task_Tracks_Query: {
    task_tracks: (parent, args, ctx) =>
      ctx.prisma.task_tracks.findMany({
        include: {
          task: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
  },
  Task_Tracks_Mutation: {
    start_task_track: (parent, args, ctx) =>
      ctx.prisma.task_tracks.create({
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
    stop_task_track: (parent, args, ctx) =>
      ctx.prisma.task_tracks.update({
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
  },
};

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});
