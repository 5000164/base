import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { Resolvers } from "./generated/schema/graphql";
import {
  add as tasksAdd,
  addWithScheduledDate as tasksAddWithScheduledDate,
  all as tasksAll,
  archive as tasksArchive,
  changeScheduledDate as tasksChangeScheduledDate,
  complete as tasksComplete,
  deleteTask as tasksDelete,
  importTemplate as tasksImport,
  importWithScheduledDate as tasksImportWithScheduledDate,
  recorded as tasksRecorded,
  scheduled as tasksScheduled,
  update as tasksUpdate,
  updateTasksOrder as tasksUpdateTasksOrder,
} from "./tasks";
import {
  add as templatesAdd,
  addTask as templatesAddTask,
  all as templatesAll,
  deleteTask as templatesDeleteTask,
  deleteTemplate as templatesDelete,
  tasks as templatesTasks,
  update as templatesUpdate,
  updateTask as templatesUpdateTask,
  updateTemplateTasksOrder as templatesUpdateTemplateTasksOrder,
} from "./templates";
import {
  deleteTaskTrack as taskTracksDelete,
  recorded as taskTracksRecorded,
  start as taskTracksStart,
  stop as taskTracksStop,
  stopByTaskId as taskTracksStopByTaskId,
  update as taskTracksUpdate,
  working as taskTracksWorking,
} from "./taskTracks";

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
      recorded: undefined,
    }),
    templates: () => ({ all: undefined, tasks: undefined }),
    taskTracks: () => ({
      recorded: undefined,
      working: undefined,
    }),
  },
  Mutation: {
    tasks: () => ({
      add: undefined,
      addWithScheduledDate: undefined,
      update: undefined,
      changeScheduledDate: undefined,
      complete: undefined,
      archive: undefined,
      delete: undefined,
      import: undefined,
      importWithScheduledDate: undefined,
      updateTasksOrder: undefined,
    }),
    templates: () => ({
      add: undefined,
      update: undefined,
      delete: undefined,
      addTask: undefined,
      updateTask: undefined,
      deleteTask: undefined,
      updateTemplateTasksOrder: undefined,
    }),
    taskTracks: () => ({
      start: undefined,
      stop: undefined,
      stopByTaskId: undefined,
      update: undefined,
      delete: undefined,
    }),
  },
  QueryTasks: {
    all: (parent, args, context) => tasksAll(context),
    scheduled: (parent, args, context) =>
      tasksScheduled(context, args.scheduledDate),
    recorded: (parent, args, context) =>
      tasksRecorded(context, args.recordedDate),
  },
  MutationTasks: {
    add: (parent, args, context) => tasksAdd(context),
    addWithScheduledDate: (parent, args, context) =>
      tasksAddWithScheduledDate(context, args.scheduledDate),
    update: (parent, args, context) =>
      tasksUpdate(context, args.taskId, args.name, args.estimate),
    changeScheduledDate: (parent, args, context) =>
      tasksChangeScheduledDate(context, args.taskId, args.scheduledDate),
    complete: (parent, args, context) => tasksComplete(context, args.taskId),
    archive: (parent, args, context) => tasksArchive(context, args.taskId),
    delete: (parent, args, context) => tasksDelete(context, args.taskId),
    import: (parent, args, context) => tasksImport(context, args.templateId),
    importWithScheduledDate: (parent, args, context) =>
      tasksImportWithScheduledDate(
        context,
        args.templateId,
        args.scheduledDate
      ),
    updateTasksOrder: (parent, args, context) =>
      tasksUpdateTasksOrder(context, args.updatedTasks),
  },
  QueryTemplates: {
    all: (parent, args, context) => templatesAll(context),
    tasks: (parent, args, context) => templatesTasks(context, args.templateId),
  },
  MutationTemplates: {
    add: (parent, args, context) => templatesAdd(context),
    update: (parent, args, context) =>
      templatesUpdate(context, args.templateId, args.name),
    delete: async (parent, args, context) =>
      templatesDelete(context, args.templateId),
    addTask: (parent, args, context) =>
      templatesAddTask(context, args.templateId),
    updateTask: (parent, args, context) =>
      templatesUpdateTask(
        context,
        args.templateTaskId,
        args.name,
        args.estimate
      ),
    deleteTask: (parent, args, context) =>
      templatesDeleteTask(context, args.templateTaskId),
    updateTemplateTasksOrder: (parent, args, context) =>
      templatesUpdateTemplateTasksOrder(context, args.updatedTemplateTasks),
  },
  QueryTaskTracks: {
    recorded: (parent, args, context) =>
      taskTracksRecorded(context, args.recordedDate),
    working: (parent, args, context) => taskTracksWorking(context),
  },
  MutationTaskTracks: {
    start: (parent, args, context) => taskTracksStart(context, args.taskId),
    stop: (parent, args, context) => taskTracksStop(context, args.taskTrackId),
    stopByTaskId: async (parent, args, context) =>
      taskTracksStopByTaskId(context, args.taskId),
    update: (parent, args, context) =>
      taskTracksUpdate(context, args.taskTrackId, args.startAt, args.stopAt),
    delete: (parent, args, context) =>
      taskTracksDelete(context, args.taskTrackId),
  },
};

export const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});
