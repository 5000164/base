import React from "react";
import { ScheduledTaskList } from "../organisms/ScheduledTaskList";
import { WorkingTaskTrackList } from "../organisms/WorkingTaskTrackList";

export const BacklogTemplate = () => {
  return (
    <>
      <ScheduledTaskList />
      <WorkingTaskTrackList />
    </>
  );
};
