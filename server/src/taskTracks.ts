export const recorded = async (context: any, recordedDate: number) => {
  const nextDate = recordedDate + 86400000;
  return context.prisma.taskTrack.findMany({
    where: {
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
    },
    include: {
      task: {
        select: {
          taskId: true,
          name: true,
        },
      },
    },
    orderBy: {
      startAt: "desc",
    },
  });
};

export const working = async (context: any) =>
  context.prisma.taskTrack.findMany({
    where: { stopAt: null },
    include: {
      task: {
        select: {
          taskId: true,
          name: true,
        },
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

export const start = async (context: any, taskId: number): Promise<boolean> => {
  await context.prisma.taskTrack.create({
    data: {
      startAt: Date.now(),
      task: {
        connect: {
          taskId,
        },
      },
    },
  });
  return true;
};

export const stop = async (
  context: any,
  taskTrackId: number
): Promise<boolean> => {
  await context.prisma.taskTrack.update({
    where: {
      taskTrackId,
    },
    data: {
      stopAt: Date.now(),
    },
  });
  return true;
};

export const stopByTaskId = async (
  context: any,
  taskId: number
): Promise<boolean> => {
  await context.prisma.taskTrack.updateMany({
    where: {
      taskId,
      stopAt: null,
    },
    data: {
      stopAt: Date.now(),
    },
  });
  return true;
};

export const update = async (
  context: any,
  taskTrackId: number,
  startAt?: number,
  stopAt?: number
): Promise<boolean> => {
  await context.prisma.taskTrack.update({
    where: { taskTrackId: taskTrackId },
    data: {
      ...(startAt ? { startAt } : {}),
      ...(stopAt ? { stopAt } : {}),
    },
  });
  return true;
};

export const deleteTaskTrack = async (
  context: any,
  taskTrackId: number
): Promise<boolean> => {
  await context.prisma.taskTrack.delete({
    where: {
      taskTrackId,
    },
  });
  return true;
};
