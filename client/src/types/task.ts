import { Status } from "shared/src/types/status";
import { Sortable } from "shared/src/types/sortable";

export interface Task extends Sortable {
  id: number;
  name: string;
  status?: Status;
  estimate?: number;
  scheduled_date?: number;
  previous_id?: number;
  next_id?: number;
}

export const setName = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  name: string
) => {
  const newTasks = [...tasks];
  newTasks[index].name = name;
  setTasks(newTasks);
};

export const setEstimate = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  estimate: number
) => {
  const newTasks = [...tasks];
  newTasks[index].estimate = estimate;
  setTasks(newTasks);
};

export const setScheduledDate = (
  tasks: Task[],
  setTasks: Function,
  index: number,
  scheduled_date: number
) => {
  const newTasks = [...tasks];
  newTasks[index].scheduled_date = scheduled_date;
  setTasks(newTasks);
};
