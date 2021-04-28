import React, { useCallback, useState } from "react";
import { TasksTemplate } from "../templates/TasksTemplate";

export const TasksPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
  isImportDialogShown: false,
  showImportDialog: () => {},
  closeImportDialog: () => {},
});

const useTasksPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount(reloadCount + 1), [
    reloadCount,
  ]);
  const [isImportDialogShown, setIsImportDialogShown] = useState(false);
  const showImportDialog = useCallback(() => setIsImportDialogShown(true), []);
  const closeImportDialog = useCallback(
    () => setIsImportDialogShown(false),
    []
  );
  return {
    reloadCount,
    reload,
    isImportDialogShown,
    showImportDialog,
    closeImportDialog,
  };
};

export const TasksPage = () => {
  return (
    <TasksPageContext.Provider value={useTasksPageContext()}>
      <TasksTemplate />
    </TasksPageContext.Provider>
  );
};
