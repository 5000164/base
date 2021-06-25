import React, { useCallback, useState } from "react";
import { TemplatesTemplate } from "../templates/TemplatesTemplate";

export const TemplatesPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
  selectedTemplate: { id: 0, name: "" },
  setSelectedTemplate: () => {},
  isEditDialogShown: false,
  showEditDialog: () => {},
  closeEditDialog: () => {},
} as {
  reloadCount: number;
  reload: () => void;
  selectedTemplate: {
    id: number;
    name: string;
  };
  setSelectedTemplate: (id: number, name: string) => void;
  isEditDialogShown: boolean;
  showEditDialog: () => void;
  closeEditDialog: () => void;
});

const useTemplatesPageContext = () => {
  const [reloadCount, setReloadCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState({
    id: 0,
    name: "",
  });
  const [isEditDialogShown, setIsEditDialogShown] = useState(false);
  return {
    reloadCount,
    reload: useCallback(() => setReloadCount(reloadCount + 1), [reloadCount]),
    selectedTemplate,
    setSelectedTemplate: useCallback(
      (id, name) => setSelectedTemplate({ id, name }),
      []
    ),
    isEditDialogShown,
    showEditDialog: useCallback(() => setIsEditDialogShown(true), []),
    closeEditDialog: useCallback(() => setIsEditDialogShown(false), []),
  };
};

export const TemplatesPage = () => {
  return (
    <TemplatesPageContext.Provider value={useTemplatesPageContext()}>
      <TemplatesTemplate />
    </TemplatesPageContext.Provider>
  );
};
