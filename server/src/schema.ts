import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { Resolvers } from "./generated/schema/graphql";
import { Status } from "./generated/shared/types/status";
import {
  addTask,
  addTaskWithScheduledDate,
  changeScheduledDate,
  changeTaskStatus,
  deleteTask,
  importTemplate,
  importTemplateWithScheduledDate,
  scheduled,
  updateTask,
  updateTasksOrder,
} from "./tasks";
import {
  addTemplateTask,
  deleteTemplateTask,
  updateTemplateTask,
  updateTemplateTasksOrder,
} from "./templates";
import { deleteTaskTrack, taskTracks, workingTaskTracks } from "./taskTracks";

const schema = loadSchemaSync(
  join(__dirname, "./generated/schema/schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const resolvers: Resolvers = {
  Query: {
    tasks: () => ({
      all: undefined,
      scheduled: undefined,
      recordedTasks: undefined,
    }),
    templates: () => ({ templates: undefined, tasks: undefined }),
    task_tracks: () => ({
      taskTracks: undefined,
      workingTaskTracks: undefined,
    }),
  },
  Mutation: {
    tasks: () => ({
      addTask: undefined,
      updateTask: undefined,
      change_scheduled_date: undefined,
      completeTask: undefined,
      archiveTask: undefined,
      deleteTask: undefined,
      importTemplate: undefined,
      updateTasksOrder: undefined,
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
  Tasks_Query: {
    all: (parent, args, context) =>
      context.prisma.tasks.findMany({ where: { status: Status.Normal } }),
    scheduled: (parent, args, context) => scheduled(context, args.date),
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
      const conditions = {
        OR: [
          {
            AND: [
              {
                start_at: {
                  gte: Math.floor(date.getTime() / 1000),
                },
              },
              {
                start_at: {
                  lt: Math.floor(nextDate.getTime() / 1000),
                },
              },
            ],
          },
          {
            AND: [
              {
                stop_at: {
                  gte: Math.floor(date.getTime() / 1000),
                },
              },
              {
                stop_at: {
                  lt: Math.floor(nextDate.getTime() / 1000),
                },
              },
            ],
          },
        ],
      };
      return context.prisma.tasks.findMany({
        where: {
          AND: {
            status: { in: [Status.Completed, Status.Archived] },
            OR: [
              {
                AND: [
                  {
                    status_changed_at: {
                      gte: Math.floor(date.getTime() / 1000),
                    },
                  },
                  {
                    status_changed_at: {
                      lt: Math.floor(nextDate.getTime() / 1000),
                    },
                  },
                ],
              },
              {
                task_tracks: {
                  some: conditions,
                },
              },
            ],
          },
        },
        include: {
          task_tracks: {
            where: conditions,
          },
        },
        orderBy: {
          status_changed_at: "desc",
        },
      });
    },
  },
  Tasks_Mutation: {
    addTask: (parent, args, context) => addTask(context),
    add_task_with_scheduled_date: (parent, args, context) =>
      addTaskWithScheduledDate(context, args.scheduled_date),
    updateTask: (parent, args, context) =>
      updateTask(context, args.id, args.name, args.estimate),
    change_scheduled_date: (parent, args, context) =>
      changeScheduledDate(context, args.id, args.scheduled_date),
    completeTask: (parent, args, context) =>
      changeTaskStatus(context, args.id, Status.Completed),
    archiveTask: (parent, args, context) =>
      changeTaskStatus(context, args.id, Status.Archived),
    deleteTask: (parent, args, context) => deleteTask(context, args.id),
    importTemplate: (parent, args, context) => importTemplate(context, args.id),
    import_template_with_scheduled_date: (parent, args, context) =>
      importTemplateWithScheduledDate(context, args.id, args.scheduled_date),
    updateTasksOrder: (parent, args, context) =>
      updateTasksOrder(context, args.updatedTasks),
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
    taskTracks: (parent, args, context) => taskTracks(context, args.date),
    workingTaskTracks: (parent, args, context) => workingTaskTracks(context),
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
    delete_task_track: (parent, args, context) =>
      deleteTaskTrack(context, args.task_track_id),
  },
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});
