import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { importSchema } from "graphql-import";
import { Resolvers } from "./generated/graphql";
import { Status, TemplateTask } from "./server";

const typeDefs = importSchema(
  path.join(__dirname, "./generated/schema.graphql")
);

const resolvers: Resolvers = {
  Query: {
    plan: () => ({ tasks: undefined, recordedTasks: undefined }),
    templates: () => ({ templates: undefined, tasks: undefined }),
  },
  Mutation: {
    plan: () => ({
      addTask: undefined,
      updateTask: undefined,
      completeTask: undefined,
      archiveTask: undefined,
      deleteTask: undefined,
      importTemplate: undefined,
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
    addTask: (parent, args, ctx) =>
      ctx.prisma.tasks.create({
        data: {
          name: args.name,
          status: Status.Normal,
        },
      }),
    updateTask: (parent, args, ctx) => {
      const data = {
        ...(args.name ? { name: args.name } : {}),
        ...(args.estimate ? { estimate: args.estimate } : {}),
        ...(args.actual ? { actual: args.actual } : {}),
      };
      return ctx.prisma.tasks.update({
        where: { id: args.id },
        data,
      });
    },
    completeTask: (parent, args, ctx) =>
      ctx.prisma.tasks.update({
        where: { id: args.id },
        data: {
          status: Status.Completed,
          status_changed_at: Math.floor(Date.now() / 1000),
        },
      }),
    archiveTask: (parent, args, ctx) =>
      ctx.prisma.tasks.update({
        where: { id: args.id },
        data: {
          status: Status.Archived,
          status_changed_at: Math.floor(Date.now() / 1000),
        },
      }),
    deleteTask: (parent, args, ctx) =>
      ctx.prisma.tasks.delete({
        where: { id: args.id },
      }),
    importTemplate: async (parent, args, ctx) => {
      await Promise.all(
        (
          await ctx.prisma.template_tasks.findMany({
            where: { templateId: args.id },
          })
        ).map((task: TemplateTask) =>
          ctx.prisma.tasks.create({
            data: {
              name: task.name,
              status: Status.Normal,
              estimate: task.estimate,
            },
          })
        )
      );
      return true;
    },
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
    addTask: (parent, args, ctx) =>
      ctx.prisma.template_tasks.create({
        data: {
          templates: { connect: { id: args.templateId } },
          name: args.name,
        },
      }),
    updateTask: (parent, args, ctx) => {
      const data = {
        ...(args.name ? { name: args.name } : {}),
        ...(args.estimate ? { estimate: args.estimate } : {}),
      };
      return ctx.prisma.template_tasks.update({
        where: { id: args.id },
        data,
      });
    },
    deleteTask: (parent, args, ctx) =>
      ctx.prisma.template_tasks.delete({
        where: { id: args.id },
      }),
  },
};

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});
