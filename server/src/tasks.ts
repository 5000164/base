import {
  TasksUpdatedTask,
  TemplatesTemplateTask,
} from "./generated/schema/graphql";
import { Status } from "./generated/shared/types/status";
import { Sortable } from "./generated/shared/types/sortable";
import { sort } from "./generated/shared/utils/sort";

export const all = (context: any) =>
  context.prisma.task.findMany({ where: { status: Status.Normal } });

export const scheduled = (context: any, scheduledDate: number) =>
  context.prisma.task.findMany({
    where: {
      status: Status.Normal,
      scheduledDate,
    },
  });

export const recorded = (context: any, recordedDate: number) => {
  const nextDate = recordedDate + 86400000;
  const conditions = {
    OR: [
      {
        AND: [
          {
            startAt: {
              gte: recordedDate,
            },
          },
          {
            startAt: {
              lt: nextDate,
            },
          },
        ],
      },
      {
        AND: [
          {
            stopAt: {
              gte: recordedDate,
            },
          },
          {
            stopAt: {
              lt: nextDate,
            },
          },
        ],
      },
    ],
  };
  return context.prisma.task.findMany({
    where: {
      AND: {
        status: { in: [Status.Completed, Status.Archived] },
        OR: [
          {
            AND: [
              {
                statusChangedAt: {
                  gte: recordedDate,
                },
              },
              {
                statusChangedAt: {
                  lt: nextDate,
                },
              },
            ],
          },
          {
            taskTracks: {
              some: conditions,
            },
          },
        ],
      },
    },
    include: {
      taskTracks: {
        where: conditions,
      },
    },
    orderBy: {
      statusChangedAt: "desc",
    },
  });
};

export const add = async (context: any): Promise<boolean> => {
  await context.prisma.task.create({
    data: {
      name: "",
      status: Status.Normal,
    },
  });
  return true;
};

export const addWithScheduledDate = async (
  context: any,
  scheduledDate: number
): Promise<boolean> => {
  const task = await context.prisma.task.findFirst({
    where: {
      status: Status.Normal,
      scheduledDate: scheduledDate,
      nextId: null,
    },
  });
  const createdTask = await context.prisma.task.create({
    data: {
      name: "",
      status: Status.Normal,
      scheduledDate,
      ...(task
        ? {
            previousTask: {
              connect: { taskId: task.taskId },
            },
          }
        : {}),
    },
  });
  if (task) {
    await context.prisma.task.update({
      where: {
        taskId: task.taskId,
      },
      data: {
        nextTask: {
          connect: { taskId: createdTask.taskId },
        },
      },
    });
  }
  return true;
};

export const update = async (
  context: any,
  taskId: number,
  name?: string,
  estimate?: number
): Promise<boolean> => {
  await context.prisma.task.update({
    where: { taskId },
    data: {
      ...(name ? { name } : {}),
      ...(estimate ? { estimate } : {}),
    },
  });
  return true;
};

export const changeScheduledDate = async (
  context: any,
  taskId: number,
  scheduledDate?: number
): Promise<boolean> => {
  const task = await context.prisma.task.findUnique({
    where: { taskId },
  });
  const lastTask = scheduledDate
    ? await context.prisma.task.findFirst({
        where: {
          status: Status.Normal,
          scheduledDate,
          nextId: null,
        },
      })
    : undefined;
  await context.prisma.$transaction([
    context.prisma.task.update({
      where: { taskId: task.taskId },
      data: {
        scheduledDate,
        ...(lastTask
          ? {
              previousTask: {
                connect: { taskId: lastTask.taskId },
              },
            }
          : task.previousId
          ? {
              previousTask: {
                disconnect: true,
              },
            }
          : {}),
        ...(task.nextId
          ? {
              nextTask: {
                disconnect: true,
              },
            }
          : {}),
      },
    }),
    ...(task.previousId
      ? [
          context.prisma.task.update({
            where: { taskId: task.previousId },
            data: {
              nextTask: {
                ...(task.nextId
                  ? { connect: { taskId: task.nextId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(task.nextId
      ? [
          context.prisma.task.update({
            where: { taskId: task.nextId },
            data: {
              previousTask: {
                ...(task.previousId
                  ? { connect: { taskId: task.previousId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(lastTask
      ? [
          context.prisma.task.update({
            where: {
              taskId: lastTask.taskId,
            },
            data: {
              nextTask: {
                connect: { taskId: task.taskId },
              },
            },
          }),
        ]
      : []),
  ]);
  return true;
};

const changeStatus = async (
  context: any,
  taskId: number,
  status: Status
): Promise<boolean> => {
  const task = await context.prisma.task.findUnique({
    where: { taskId },
  });
  await context.prisma.$transaction([
    context.prisma.task.update({
      where: { taskId: task.taskId },
      data: {
        status,
        ...(task.statusChangedAt
          ? {}
          : {
              statusChangedAt: Date.now(),
            }),
        ...(task.previousId
          ? {
              previousTask: {
                disconnect: true,
              },
            }
          : {}),
        ...(task.nextId
          ? {
              nextTask: {
                disconnect: true,
              },
            }
          : {}),
      },
    }),
    ...(task.previousId
      ? [
          context.prisma.task.update({
            where: { taskId: task.previousId },
            data: {
              nextTask: {
                ...(task.nextId
                  ? { connect: { taskId: task.nextId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(task.nextId
      ? [
          context.prisma.task.update({
            where: { taskId: task.nextId },
            data: {
              previousTask: {
                ...(task.previousId
                  ? { connect: { taskId: task.previousId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
  ]);
  return true;
};

export const complete = async (
  context: any,
  taskId: number
): Promise<boolean> => changeStatus(context, taskId, Status.Completed);

export const archive = async (context: any, taskId: number): Promise<boolean> =>
  changeStatus(context, taskId, Status.Archived);

export const deleteTask = async (
  context: any,
  taskId: number
): Promise<boolean> => {
  const task = await context.prisma.task.findUnique({
    where: { taskId },
  });
  await context.prisma.$transaction([
    ...(task.previousId
      ? [
          context.prisma.task.update({
            where: { taskId: task.previousId },
            data: {
              nextTask: {
                ...(task.nextId
                  ? { connect: { taskId: task.nextId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    ...(task.nextId
      ? [
          context.prisma.task.update({
            where: { taskId: task.nextId },
            data: {
              previousTask: {
                ...(task.previousId
                  ? { connect: { taskId: task.previousId } }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
    context.prisma.taskTrack.deleteMany({
      where: { taskId: task.taskId },
    }),
    context.prisma.task.delete({
      where: { taskId: task.taskId },
    }),
  ]);
  return true;
};

export const importTemplate = async (
  context: any,
  templateId: number
): Promise<boolean> => {
  const tasks = (await context.prisma.templateTask.findMany({
    where: { templateId },
  })) as TemplatesTemplateTask[];
  const sortedTasks = sort(
    tasks.map(
      (t) =>
        ({
          id: t.templateTaskId,
          previousId: t.previousId,
          nextId: t.nextId,
        } as Sortable)
    )
  ).map((s) => tasks.find((t) => t.templateTaskId === s.id));

  for (let i = 0; i < sortedTasks.length; i++) {
    let task = sortedTasks[i];

    await context.prisma.task.create({
      data: {
        name: task.name,
        status: Status.Normal,
        estimate: task.estimate,
      },
    });
  }

  return true;
};

export const importWithScheduledDate = async (
  context: any,
  templateId: number,
  scheduledDate: number
): Promise<boolean> => {
  const lastTask = await context.prisma.task.findFirst({
    where: {
      status: Status.Normal,
      scheduledDate,
      nextId: null,
    },
  });
  const tasks = (await context.prisma.templateTask.findMany({
    where: { templateId },
  })) as TemplatesTemplateTask[];
  const sortedTasks = sort(
    tasks.map(
      (t) =>
        ({
          id: t.templateTaskId,
          previousId: t.previousId,
          nextId: t.nextId,
        } as Sortable)
    )
  ).map((s) => tasks.find((t) => t.templateTaskId === s.id));

  let previousId = lastTask?.taskId;
  for (let i = 0; i < sortedTasks.length; i++) {
    let task = sortedTasks[i];

    const createdTask = await context.prisma.task.create({
      data: {
        name: task.name,
        status: Status.Normal,
        estimate: task.estimate,
        scheduledDate,
        ...(previousId
          ? {
              previousTask: {
                connect: { taskId: previousId },
              },
            }
          : {}),
      },
    });

    if (previousId) {
      await context.prisma.task.update({
        where: { taskId: previousId },
        data: {
          nextTask: {
            connect: { taskId: createdTask.taskId },
          },
        },
      });
    }

    previousId = createdTask.taskId;
  }

  return true;
};

export const updateTasksOrder = async (
  context: any,
  updatedTasks: TasksUpdatedTask[]
): Promise<boolean> => {
  await context.prisma.$transaction(
    updatedTasks.map(({ taskId, previousId, nextId }) =>
      context.prisma.task.update({
        where: { taskId },
        data: {
          ...(previousId
            ? {
                previousTask: {
                  connect: { taskId: previousId },
                },
              }
            : previousId === null
            ? {
                previousTask: {
                  disconnect: true,
                },
              }
            : {}),
          ...(nextId
            ? {
                nextTask: {
                  connect: { taskId: nextId },
                },
              }
            : nextId === null
            ? {
                nextTask: {
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
