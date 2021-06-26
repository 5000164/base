import { Sortable } from "../types/sortable";

export const sort = (items: Sortable[]): Sortable[] => {
  const [firstItem] = items.splice(
    items.findIndex((t) => !t.previousId),
    1
  );

  if (firstItem) {
    const sortedTasks = [];
    sortedTasks.push(firstItem);

    const sort = (
      nextId: number,
      remainItems: Sortable[],
      sortedItems: Sortable[]
    ): Sortable[] => {
      if (remainItems.length === 0) {
        return sortedItems;
      }

      const [nextItem] = remainItems.splice(
        remainItems.findIndex((i) => i.id === nextId),
        1
      );
      sortedItems.push(nextItem);

      if (nextItem.nextId) {
        return sort(nextItem.nextId, remainItems, sortedItems);
      } else {
        return [...sortedItems, ...remainItems];
      }
    };

    if (firstItem.nextId) {
      return sort(firstItem.nextId, items, sortedTasks);
    } else {
      return [...sortedTasks, ...items];
    }
  } else {
    return items;
  }
};
