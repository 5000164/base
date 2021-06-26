import { TemplatesUpdatedTemplateTask } from "./generated/schema/graphql";

export const all = (context: any) => context.prisma.template.findMany();

export const tasks = (context: any, templateId: number) =>
  context.prisma.templateTask.findMany({
    where: { templateId },
  });

export const add = async (context: any): Promise<boolean> => {
  await context.prisma.template.create({
    data: {
      name: "",
    },
  });
  return true;
};

export const update = async (
  context: any,
  templateId: number,
  name?: string
): Promise<boolean> => {
  await context.prisma.template.update({
    where: { templateId },
    data: {
      ...(name ? { name } : {}),
    },
  });
  return true;
};

export const deleteTemplate = async (
  context: any,
  templateId: number
): Promise<boolean> => {
  await context.prisma.templateTask.deleteMany({
    where: { templateId },
  });
  await context.prisma.template.delete({
    where: { templateId },
  });
  return true;
};

export const addTask = async (
  context: any,
  templateId: number
): Promise<boolean> => {
  const lastTask = await context.prisma.templateTask.findFirst({
    where: { templateId, nextId: null },
  });
  const createdTask = await context.prisma.templateTask.create({
    data: {
      template: {
        connect: {
          templateId,
        },
      },
      name: "",
      ...(lastTask
        ? {
            previousTemplateTask: {
              connect: { templateTaskId: lastTask.templateTaskId },
            },
          }
        : {}),
    },
  });
  if (lastTask) {
    await context.prisma.templateTask.update({
      where: {
        templateTaskId: lastTask.templateTaskId,
      },
      data: {
        nextTemplateTask: {
          connect: { templateTaskId: createdTask.templateTaskId },
        },
      },
    });
  }
  return true;
};

export const updateTask = async (
  context: any,
  templateTaskId: number,
  name?: string,
  estimate?: number
): Promise<boolean> => {
  await context.prisma.templateTask.update({
    where: { templateTaskId },
    data: {
      ...(name ? { name } : {}),
      ...(estimate ? { estimate } : {}),
    },
  });
  return true;
};

export const deleteTask = async (
  context: any,
  templateTaskId: number
): Promise<boolean> => {
  const task = await context.prisma.templateTask.findUnique({
    where: { templateTaskId },
  });
  await context.prisma.$transaction([
    ...(task.previousId
      ? [
          context.prisma.templateTask.update({
            where: { templateTaskId: task.previousId },
            data: {
              nextTemplateTask: {
                ...(task.nextId
                  ? { connect: { templateTaskId: task.nextId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(task.nextId
      ? [
          context.prisma.templateTask.update({
            where: { templateTaskId: task.nextId },
            data: {
              previousTemplateTask: {
                ...(task.previousId
                  ? { connect: { templateTaskId: task.previousId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    context.prisma.templateTask.delete({
      where: { templateTaskId: task.templateTaskId },
    }),
  ]);
  return true;
};

export const updateTemplateTasksOrder = async (
  context: any,
  updatedTemplateTasks: TemplatesUpdatedTemplateTask[]
): Promise<boolean> => {
  await context.prisma.$transaction(
    updatedTemplateTasks.map(({ templateTaskId, previousId, nextId }) =>
      context.prisma.templateTask.update({
        where: { templateTaskId },
        data: {
          ...(previousId
            ? {
                previousTemplateTask: {
                  connect: { templateTaskId: previousId },
                },
              }
            : previousId === null
            ? {
                previousTemplateTask: {
                  disconnect: true,
                },
              }
            : {}),
          ...(nextId
            ? {
                nextTemplateTask: {
                  connect: { templateTaskId: nextId },
                },
              }
            : nextId === null
            ? {
                nextTemplateTask: {
                  disconnect: true,
                },
              }
            : {}),
        },
      })
    )
  );
  return true;
};
