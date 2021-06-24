import { Tasks_Updated_Task } from "./generated/schema/graphql";
import { Status } from "./generated/shared/types/status";
import { sort } from "./generated/shared/utils/sort";
import { TemplateTask } from "./types/templateTask";

export const scheduled = (context: any, dateString: string) => {
  const date = new Date(new Date(Date.parse(dateString)).setHours(0, 0, 0, 0));
  return context.prisma.tasks.findMany({
    where: {
      status: Status.Normal,
      scheduled_date: Math.floor(date.getTime() / 1000),
    },
  });
};

export const addTask = async (context: any): Promise<boolean> => {
  await context.prisma.tasks.create({
    data: {
      name: "",
      status: Status.Normal,
    },
  });
  return true;
};

export const addTaskWithScheduledDate = async (
  context: any,
  scheduledDate: number
): Promise<boolean> => {
  const task = await context.prisma.tasks.findFirst({
    where: {
      status: Status.Normal,
      scheduled_date: scheduledDate,
      next_id: null,
    },
  });
  const createdTask = await context.prisma.tasks.create({
    data: {
      name: "",
      status: Status.Normal,
      scheduled_date: scheduledDate,
      ...(task
        ? {
            tasks_tasksTotasks_previous_id: {
              connect: { id: task.id },
            },
          }
        : {}),
    },
  });
  if (task) {
    await context.prisma.tasks.update({
      where: {
        id: task.id,
      },
      data: {
        tasks_tasksTotasks_next_id: {
          connect: { id: createdTask.id },
        },
      },
    });
  }
  return true;
};

export const updateTask = async (
  context: any,
  id: number,
  name?: string,
  estimate?: number
): Promise<boolean> => {
  await context.prisma.tasks.update({
    where: { id: id },
    data: {
      ...(name ? { name } : {}),
      ...(estimate ? { estimate } : {}),
    },
  });
  return true;
};

export const changeScheduledDate = async (
  context: any,
  id: number,
  scheduledDate?: number
): Promise<boolean> => {
  const task = await context.prisma.tasks.findUnique({
    where: { id },
  });
  const lastTask = scheduledDate
    ? await context.prisma.tasks.findFirst({
        where: {
          status: Status.Normal,
          scheduled_date: scheduledDate,
          next_id: null,
        },
      })
    : undefined;
  await context.prisma.$transaction([
    context.prisma.tasks.update({
      where: { id: task.id },
      data: {
        scheduled_date: scheduledDate,
        ...(lastTask
          ? {
              tasks_tasksTotasks_previous_id: {
                connect: { id: lastTask.id },
              },
            }
          : task.previous_id
          ? {
              tasks_tasksTotasks_previous_id: {
                disconnect: true,
              },
            }
          : {}),
        ...(task.next_id
          ? {
              tasks_tasksTotasks_next_id: {
                disconnect: true,
              },
            }
          : {}),
      },
    }),
    ...(task.previous_id
      ? [
          context.prisma.tasks.update({
            where: { id: task.previous_id },
            data: {
              tasks_tasksTotasks_next_id: {
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
          context.prisma.tasks.update({
            where: { id: task.next_id },
            data: {
              tasks_tasksTotasks_previous_id: {
                ...(task.previous_id
                  ? { connect: { id: task.previous_id } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(lastTask
      ? [
          context.prisma.tasks.update({
            where: {
              id: lastTask.id,
            },
            data: {
              tasks_tasksTotasks_next_id: {
                connect: { id: task.id },
              },
            },
          }),
        ]
      : []),
  ]);
  return true;
};

export const changeTaskStatus = async (
  context: any,
  id: number,
  status: Status
): Promise<boolean> => {
  const task = await context.prisma.tasks.findUnique({
    where: { id },
  });
  await context.prisma.$transaction([
    context.prisma.tasks.update({
      where: { id: task.id },
      data: {
        status,
        ...(task.status_changed_at
          ? {}
          : {
              status_changed_at: Math.floor(Date.now() / 1000),
            }),
        ...(task.previous_id
          ? {
              tasks_tasksTotasks_previous_id: {
                disconnect: true,
              },
            }
          : {}),
        ...(task.next_id
          ? {
              tasks_tasksTotasks_next_id: {
                disconnect: true,
              },
            }
          : {}),
      },
    }),
    ...(task.previous_id
      ? [
          context.prisma.tasks.update({
            where: { id: task.previous_id },
            data: {
              tasks_tasksTotasks_next_id: {
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
          context.prisma.tasks.update({
            where: { id: task.next_id },
            data: {
              tasks_tasksTotasks_previous_id: {
                ...(task.previous_id
                  ? { connect: { id: task.previous_id } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
  ]);
  return true;
};

export const deleteTask = async (
  context: any,
  id: number
): Promise<boolean> => {
  const task = await context.prisma.tasks.findUnique({
    where: { id },
  });
  await context.prisma.$transaction([
    ...(task.previous_id
      ? [
          context.prisma.tasks.update({
            where: { id: task.previous_id },
            data: {
              tasks_tasksTotasks_next_id: {
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
          context.prisma.tasks.update({
            where: { id: task.next_id },
            data: {
              tasks_tasksTotasks_previous_id: {
                ...(task.previous_id
                  ? { connect: { id: task.previous_id } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    context.prisma.task_tracks.deleteMany({
      where: { task_id: task.id },
    }),
    context.prisma.tasks.delete({
      where: { id: task.id },
    }),
  ]);
  return true;
};

export const importTemplate = async (
  context: any,
  templateId: number
): Promise<boolean> => {
  const tasks = sort<TemplateTask>(
    await context.prisma.template_tasks.findMany({
      where: { templateId },
    })
  );

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    await context.prisma.tasks.create({
      data: {
        name: task.name,
        status: Status.Normal,
        estimate: task.estimate,
      },
    });
  }

  return true;
};

export const importTemplateWithScheduledDate = async (
  context: any,
  templateId: number,
  scheduledDate: number
): Promise<boolean> => {
  const lastTask = await context.prisma.tasks.findFirst({
    where: {
      status: Status.Normal,
      scheduled_date: scheduledDate,
      next_id: null,
    },
  });
  const tasks = sort<TemplateTask>(
    await context.prisma.template_tasks.findMany({
      where: { templateId },
    })
  );

  let previous_id = lastTask?.id;
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];

    const createdTask = await context.prisma.tasks.create({
      data: {
        name: task.name,
        status: Status.Normal,
        estimate: task.estimate,
        scheduled_date: scheduledDate,
        ...(previous_id
          ? {
              tasks_tasksTotasks_previous_id: {
                connect: { id: previous_id },
              },
            }
          : {}),
      },
    });

    if (previous_id) {
      await context.prisma.tasks.update({
        where: { id: previous_id },
        data: {
          tasks_tasksTotasks_next_id: {
            connect: { id: createdTask.id },
          },
        },
      });
    }

    previous_id = createdTask.id;
  }

  return true;
};

export const updateTasksOrder = async (
  context: any,
  updatedTasks: Tasks_Updated_Task[]
): Promise<boolean> => {
  await context.prisma.$transaction(
    updatedTasks.map(({ id, previous_id, next_id }) =>
      context.prisma.tasks.update({
        where: { id: id },
        data: {
          ...(previous_id
            ? {
                tasks_tasksTotasks_previous_id: {
                  connect: { id: previous_id },
                },
              }
            : previous_id === null
            ? {
                tasks_tasksTotasks_previous_id: {
                  disconnect: true,
                },
              }
            : {}),
          ...(next_id
            ? {
                tasks_tasksTotasks_next_id: {
                  connect: { id: next_id },
                },
              }
            : next_id === null
            ? {
                tasks_tasksTotasks_next_id: {
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
