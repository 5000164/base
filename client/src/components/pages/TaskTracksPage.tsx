import React, { useCallback, useState } from "react";
import { TaskTracksTemplate } from "../templates/TaskTracksTemplate";

export const TaskTracksPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
});

const useTaskTracksPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  return {
    reloadCount,
    reload: useCallback(() => setReloadCount(reloadCount + 1), [reloadCount]),
  };
};

export const TaskTracksPage = () => (
  <TaskTracksPageContext.Provider value={useTaskTracksPageContext()}>
    <TaskTracksTemplate />
  </TaskTracksPageContext.Provider>
);
