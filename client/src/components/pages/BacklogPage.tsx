import React, { useCallback, useState } from "react";
import { BacklogTemplate } from "../templates/BacklogTemplate";

export const BacklogPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
});

const useBacklogPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  const reload = useCallback(() => setReloadCount(reloadCount + 1), [
    reloadCount,
  ]);
  return {
    reloadCount,
    reload,
  };
};

export const BacklogPage = () => {
  return (
    <BacklogPageContext.Provider value={useBacklogPageContext()}>
      <BacklogTemplate />
    </BacklogPageContext.Provider>
  );
};
