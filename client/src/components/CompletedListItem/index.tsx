import React from "react";
import { Task } from "../../App";

export const CompletedListItem = ({ task }: { task: Task }) => (
  <li>
    <span>{task.name}</span>
    <span>{task.estimate}</span>
  </li>
);
