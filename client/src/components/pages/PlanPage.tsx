import React, { useCallback, useState } from "react";
import { PlanTemplate } from "../templates/PlanTemplate";

export const PlanPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
  isImportDialogShown: false,
  showImportDialog: () => {},
  closeImportDialog: () => {},
});

const usePlanPageContext = () => {
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

export const PlanPage = () => {
  return (
    <PlanPageContext.Provider value={usePlanPageContext()}>
      <PlanTemplate />
    </PlanPageContext.Provider>
  );
};
