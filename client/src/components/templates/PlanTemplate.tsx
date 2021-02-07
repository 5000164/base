import React from "react";
import { PlanPageContext } from "../pages/PlanPage";
import { WorkingTaskTrackList } from "../organisms/WorkingTaskTrackList";
import { PlanList } from "../organisms/PlanList";
import { RecordedList } from "../organisms/RecordedList";
import { TemplateListToImportLayer } from "../organisms/TemplateListToImportLayer";

export const PlanTemplate = () => {
  const { isImportDialogShown } = React.useContext(PlanPageContext);

  return (
    <>
      <PlanList />
      <RecordedList />
      <WorkingTaskTrackList />
      {isImportDialogShown && <TemplateListToImportLayer />}
    </>
  );
};
