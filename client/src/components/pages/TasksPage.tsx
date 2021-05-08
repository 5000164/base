import React, { useCallback, useState } from "react";
import { TasksTemplate } from "../templates/TasksTemplate";

export const TasksPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
});

const useTasksPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount(reloadCount + 1), [
    reloadCount,
  ]);
  return {
    reloadCount,
    reload,
  };
};

export const TasksPage = () => {
  return (
    <TasksPageContext.Provider value={useTasksPageContext()}>
      <TasksTemplate />
    </TasksPageContext.Provider>
  );
};
