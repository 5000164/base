import React from "react";
import { Task } from "../plan-list";

export const PlanListItem = ({
  task,
  setTask,
}: {
  task: Task;
  setTask: Function;
}) => (
  <li>
    <span>{task.id}</span>
    <input
      type="text"
      value={task.name}
      onChange={(e) => setTask(e.target.value)}
    />
  </li>
);
