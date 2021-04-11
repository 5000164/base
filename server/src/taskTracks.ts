export const taskTracks = async (context: any, dateString: string) => {
  const date = new Date(new Date(Date.parse(dateString)).setHours(0, 0, 0, 0));
  const nextDayDate = new Date(
    new Date(new Date(date).setDate(date.getDate() + 1)).setHours(0, 0, 0, 0)
  );
  return context.prisma.task_tracks.findMany({
    where: {
      AND: [
        {
          start_at: { gte: Math.floor(date.getTime() / 1000) },
        },
        {
          start_at: {
            lt: Math.floor(nextDayDate.getTime() / 1000),
          },
        },
      ],
    },
    include: {
      task: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      start_at: "desc",
    },
  });
};

export const workingTaskTracks = async (context: any) => {
  return context.prisma.task_tracks.findMany({
    where: { stop_at: null },
    include: {
      task: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      start_at: "asc",
    },
  });
};

export const deleteTaskTrack = async (
  context: any,
  taskTrackId: number
): Promise<boolean> => {
  await context.prisma.task_tracks.delete({
    where: {
      task_track_id: taskTrackId,
    },
  });
  return true;
};
