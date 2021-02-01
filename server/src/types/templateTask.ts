import { Sortable } from "shared/src/types/sortable";
import { Templates_Task } from "schema/src/generated/server/graphql";

export interface TemplateTask extends Templates_Task, Sortable {}
