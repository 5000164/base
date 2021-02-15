import { Templates_Updated_Template_Task } from "./generated/schema/graphql";

export const addTemplateTask = async (
  context: any,
  templateId: number
): Promise<boolean> => {
  const lastTask = await context.prisma.template_tasks.findFirst({
    where: { templateId, next_id: null },
  });
  const createdTask = await context.prisma.template_tasks.create({
    data: {
      templates: {
        connect: {
          id: templateId,
        },
      },
      name: "",
      ...(lastTask
        ? {
            template_tasks_template_tasksTotemplate_tasks_previous_id: {
              connect: { id: lastTask.id },
            },
          }
        : {}),
    },
  });
  if (lastTask) {
    await context.prisma.template_tasks.update({
      where: {
        id: lastTask.id,
      },
      data: {
        template_tasks_template_tasksTotemplate_tasks_next_id: {
          connect: { id: createdTask.id },
        },
      },
    });
  }
  return true;
};

export const updateTemplateTask = async (
  context: any,
  id: number,
  name?: string,
  estimate?: number
): Promise<boolean> => {
  await context.prisma.template_tasks.update({
    where: { id: id },
    data: {
      ...(name ? { name } : {}),
      ...(estimate ? { estimate } : {}),
    },
  });
  return true;
};

export const deleteTemplateTask = async (
  context: any,
  id: number
): Promise<boolean> => {
  const task = await context.prisma.template_tasks.findUnique({
    where: { id },
  });
  await context.prisma.$transaction([
    ...(task.previous_id
      ? [
          context.prisma.template_tasks.update({
            where: { id: task.previous_id },
            data: {
              template_tasks_template_tasksTotemplate_tasks_next_id: {
                ...(task.next_id
                  ? { connect: { id: task.next_id } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(task.next_id
      ? [
          context.prisma.template_tasks.update({
            where: { id: task.next_id },
            data: {
              template_tasks_template_tasksTotemplate_tasks_previous_id: {
                ...(task.previous_id
                  ? { connect: { id: task.previous_id } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    context.prisma.template_tasks.delete({
      where: { id: task.id },
    }),
  ]);
  return true;
};

export const updateTemplateTasksOrder = async (
  context: any,
  updatedTemplateTasks: Templates_Updated_Template_Task[]
): Promise<boolean> => {
  await context.prisma.$transaction(
    updatedTemplateTasks.map(({ id, previous_id, next_id }) =>
      context.prisma.template_tasks.update({
        where: { id: id },
        data: {
          ...(previous_id
            ? {
                template_tasks_template_tasksTotemplate_tasks_previous_id: {
                  connect: { id: previous_id },
                },
              }
            : previous_id === null
            ? {
                template_tasks_template_tasksTotemplate_tasks_previous_id: {
                  disconnect: true,
                },
              }
            : {}),
          ...(next_id
            ? {
                template_tasks_template_tasksTotemplate_tasks_next_id: {
                  connect: { id: next_id },
                },
              }
            : next_id === null
            ? {
                template_tasks_template_tasksTotemplate_tasks_next_id: {
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
