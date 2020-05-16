import React from "react";
import { Task } from "../../App";

export const PlanListItem = ({
  task,
  setName,
  setEstimate,
  updateTask,
  completeTask,
  archiveTask,
  deleteTask,
}: {
  task: Task;
  setName: Function;
  setEstimate: Function;
  updateTask: Function;
  completeTask: Function;
  archiveTask: Function;
  deleteTask: Function;
}) => (
  <li>
    <input
      type="text"
      value={task.name ?? ""}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      type="text"
      value={task.estimate ?? ""}
      onChange={(e) => setEstimate(Number(e.target.value))}
    />
    <button onClick={() => updateTask(task)}>Update</button>
    <button onClick={() => completeTask(task.id)}>Complete</button>
    <button onClick={() => archiveTask(task.id)}>Archive</button>
    <button onClick={() => deleteTask(task.id)}>Delete</button>
  </li>
);
