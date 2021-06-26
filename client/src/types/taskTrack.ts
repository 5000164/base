import { TaskTrackTask } from "./taskTrackTask";

export type TaskTrack = {
  taskTrackId: number;
  task: TaskTrackTask;
  startAt: number;
  stopAt?: number;
};

export const setStartAt = (
  taskTracks: TaskTrack[],
  setTaskTracks: Function,
  index: number,
  startAt: number
) => {
  const newTaskTracks = [...taskTracks];
  newTaskTracks[index].startAt = startAt;
  setTaskTracks(newTaskTracks);
};

export const setStopAt = (
  taskTracks: TaskTrack[],
  setTaskTracks: Function,
  index: number,
  stopAt: number
) => {
  const newTaskTracks = [...taskTracks];
  newTaskTracks[index].stopAt = stopAt;
  setTaskTracks(newTaskTracks);
};
