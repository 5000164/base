import { Sortable } from "shared/src/types/sortable";

export interface TemplateTask extends Sortable {
  id: number;
  name: string;
  estimate?: number;
  previous_id?: number;
  next_id?: number;
}

export const setName = (
  tasks: TemplateTask[],
  setTasks: (tasks: TemplateTask[]) => void,
  index: number,
  name: string
) => {
  const newTasks = [...tasks];
  newTasks[index].name = name;
  setTasks(newTasks);
};

export const setEstimate = (
  tasks: TemplateTask[],
  setTasks: (tasks: TemplateTask[]) => void,
  index: number,
  estimate: number
) => {
  const newTasks = [...tasks];
  newTasks[index].estimate = estimate;
  setTasks(newTasks);
};
