import React, { useCallback, useState } from "react";
import { TemplatesTemplate } from "../templates/TemplatesTemplate";

export const TemplatesPageContext = React.createContext({
  reloadCount: 0,
  reload: () => {},
  selectedTemplate: { templateId: 0, name: "" },
  setSelectedTemplate: () => {},
  isEditDialogShown: false,
  showEditDialog: () => {},
  closeEditDialog: () => {},
} as {
  reloadCount: number;
  reload: () => void;
  selectedTemplate: {
    templateId: number;
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
    templateId: 0,
    name: "",
  });
  const [isEditDialogShown, setIsEditDialogShown] = useState(false);
  return {
    reloadCount,
    reload: useCallback(() => setReloadCount(reloadCount + 1), [reloadCount]),
    selectedTemplate,
    setSelectedTemplate: useCallback(
      (templateId, name) => setSelectedTemplate({ templateId, name }),
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
