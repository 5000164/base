export interface Template {
  id: number;
  name: string;
}

export const setName = (
  templates: Template[],
  setTemplates: (templates: Template[]) => void,
  index: number,
  name: string
) => {
  const newTemplates = [...templates];
  newTemplates[index].name = name;
  setTemplates(newTemplates);
};
