import { TemplatesUpdatedTemplateTask } from "schema/src/generated/client/graphql";
import { Sortable } from "shared/src/types/sortable";

export type TemplateTask = {
  templateTaskId: number;
  name: string;
  estimate?: number;
  previousId?: number;
  nextId?: number;
};

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

export const toSortable = (task: TemplateTask) =>
  ({
    id: task.templateTaskId,
    previousId: task.previousId,
    nextId: task.nextId,
  } as Sortable);

export const toTemplateTasksFromSortable = (
  tasks: TemplateTask[],
  sortables: Sortable[]
) =>
  sortables.map((s) =>
    tasks.find((t) => t.templateTaskId === s.id)
  ) as TemplateTask[];

export const toTemplatesUpdatedTemplateTask = (item: Sortable) =>
  // null の場合は null との接続、つまり先頭か末尾を表すので除外するのは undefined の時のみ
  ({
    templateTaskId: item.id,
    ...(typeof item.previousId !== "undefined"
      ? { previousId: item.previousId }
      : {}),
    ...(typeof item.nextId !== "undefined" ? { nextId: item.nextId } : {}),
  } as TemplatesUpdatedTemplateTask);
