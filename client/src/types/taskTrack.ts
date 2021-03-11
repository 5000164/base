import { TaskTrackTask } from "./taskTrackTask";

export interface TaskTrack {
  task_track_id: number;
  task: TaskTrackTask;
  start_at: number;
  stop_at?: number;
}

export const setStartAt = (
  taskTracks: TaskTrack[],
  setTaskTracks: Function,
  index: number,
  startAt: string
) => {
  const newTaskTracks = [...taskTracks];
  newTaskTracks[index].start_at = Math.floor(
    new Date(startAt).getTime() / 1000
  );
  setTaskTracks(newTaskTracks);
};

export const setStopAt = (
  taskTracks: TaskTrack[],
  setTaskTracks: Function,
  index: number,
  stopAt: string
) => {
  const newTaskTracks = [...taskTracks];
  newTaskTracks[index].stop_at = Math.floor(new Date(stopAt).getTime() / 1000);
  setTaskTracks(newTaskTracks);
};
