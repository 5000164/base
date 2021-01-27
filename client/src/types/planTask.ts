import { Status } from "./status";
import { Sortable } from "./sortable";

export interface PlanTask extends Sortable {
  id: number;
  name: string;
  status?: Status;
  estimate?: number;
  actual?: number;
  previous_id?: number;
  next_id?: number;
}

export const setName = (
  tasks: PlanTask[],
  setTasks: Function,
  index: number,
  name: string
) => {
  const newTasks = [...tasks];
  newTasks[index].name = name;
  setTasks(newTasks);
};

export const setEstimate = (
  tasks: PlanTask[],
  setTasks: Function,
  index: number,
  estimate: number
) => {
  const newTasks = [...tasks];
  newTasks[index].estimate = estimate;
  setTasks(newTasks);
};

export const setActual = (
  tasks: PlanTask[],
  setTasks: Function,
  index: number,
  actual: number
) => {
  const newTasks = [...tasks];
  newTasks[index].actual = actual;
  setTasks(newTasks);
};
