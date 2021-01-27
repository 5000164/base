import React from "react";
import { TemplatesPageContext } from "../pages/TemplatesPage";
import { TemplateList } from "../organisms/TemplateList";
import { TemplateTaskListLayer } from "../organisms/TemplateTaskListLayer";

export const TemplatesTemplate = () => {
  const { isEditDialogShown } = React.useContext(TemplatesPageContext);

  return (
    <>
      <TemplateList />
      {isEditDialogShown && <TemplateTaskListLayer />}
    </>
  );
};
