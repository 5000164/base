import { Status } from "./server";
import { Plan_Updated_Plan_Task } from "./generated/graphql";

export const addTask = async (ctx: any): Promise<boolean> => {
  const task = await ctx.prisma.tasks.findFirst({
    where: { status: Status.Normal, next_id: null },
  });
  const createdTask = await ctx.prisma.tasks.create({
    data: {
      name: "",
      status: Status.Normal,
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
    await ctx.prisma.tasks.update({
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
  ctx: any,
  id: number,
  name?: string,
  estimate?: number,
  actual?: number
): Promise<boolean> => {
  await ctx.prisma.tasks.update({
    where: { id: id },
    data: {
      ...(name ? { name } : {}),
      ...(estimate ? { estimate } : {}),
      ...(actual ? { actual } : {}),
    },
  });
  return true;
};

export const changeTaskStatus = async (
  ctx: any,
  id: number,
  status: Status
): Promise<boolean> => {
  const task = await ctx.prisma.tasks.findUnique({
    where: { id },
  });
  await ctx.prisma.$transaction([
    ctx.prisma.tasks.update({
      where: { id: task.id },
      data: {
        status,
        status_changed_at: Math.floor(Date.now() / 1000),
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
          ctx.prisma.tasks.update({
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
          ctx.prisma.tasks.update({
            where: { id: task.next_id },
            data: {
              tasks_tasksTotasks_previous_id: {
                ...(task.previous_id
                  ? {
                      connect: {
                        id: task.previous_id,
                      },
                    }
                  : { disconnect: true }),
              },
            },
          }),
        ]
      : []),
  ]);
  return true;
};

export const deleteTask = async (ctx: any, id: number): Promise<boolean> => {
  const task = await ctx.prisma.tasks.findUnique({
    where: { id },
  });
  await ctx.prisma.$transaction([
    ...(task.previous_id
      ? [
          ctx.prisma.tasks.update({
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
          ctx.prisma.tasks.update({
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
    ctx.prisma.tasks.delete({
      where: { id: task.id },
    }),
  ]);
  return true;
};

export const updatePlanTasksOrder = async (
  ctx: any,
  updatedPlanTasks: Plan_Updated_Plan_Task[]
): Promise<boolean> => {
  await ctx.prisma.$transaction(
    updatedPlanTasks.map(({ id, previous_id, next_id }) =>
      ctx.prisma.tasks.update({
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
