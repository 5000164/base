import React from "react";
import { TasksPageContext } from "../pages/TasksPage";
import { WorkingTaskTrackList } from "../organisms/WorkingTaskTrackList";
import { TaskList } from "../organisms/TaskList";
import { TemplateListToImportLayer } from "../organisms/TemplateListToImportLayer";

export const TasksTemplate = () => {
  const { isImportDialogShown } = React.useContext(TasksPageContext);

  return (
    <>
      <TaskList />
      <WorkingTaskTrackList />
      {isImportDialogShown && <TemplateListToImportLayer />}
    </>
  );
};
