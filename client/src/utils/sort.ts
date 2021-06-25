import { DropResult } from "react-beautiful-dnd";
import { Sortable } from "shared/src/types/sortable";

export const reorder = <T, U>(
  result: DropResult,
  items: T[],
  toSortable: (item: T) => Sortable,
  toUpdatedItems: (item: Sortable) => U,
  updateOrder: (items: U[]) => Promise<boolean>
) => {
  if (!result.destination) {
    return Promise.resolve();
  }

  const {
    destination: { index: destinationIndex },
    source: { index: sourceIndex },
  } = result;

  if (destinationIndex === sourceIndex) {
    return Promise.resolve();
  }

  const sortableItems = items.map(toSortable);

  const [source] = sortableItems.splice(sourceIndex, 1);
  sortableItems.splice(destinationIndex, 0, source);

  const updatedItems = [
    ...joinDoublyLinkedItems(
      JSON.parse(
        JSON.stringify([
          sortableItems.find((i) => i.id === source.previousId) ?? null,
          sortableItems.find((i) => i.id === source.nextId) ?? null,
        ])
      )
    ),
    ...joinDoublyLinkedItems(
      JSON.parse(
        JSON.stringify([
          sortableItems[destinationIndex - 1] ?? null,
          source,
          sortableItems[destinationIndex + 1] ?? null,
        ])
      )
    ),
  ]
    // 型を Sortable だけにするために flatMap を使用
    .flatMap((i) => (i !== null ? [i] : []))
    // 同じ id に対して行った操作を統合する
    .reduce((items, item) => {
      const index = items.findIndex((i) => i.id === item.id);
      if (index === -1) {
        items.push(item);
      } else {
        items[index] = { ...items[index], ...item };
      }
      return items;
    }, [] as Sortable[]);

  return updateOrder(updatedItems.map(toUpdatedItems));
};

export const joinDoublyLinkedItems = (items: (Sortable | null)[]) => {
  items.reduce((a, c) => {
    if (a) a.nextId = c?.id ?? null;
    return c;
  });
  items.reduceRight((a, c) => {
    if (a) a.previousId = c?.id ?? null;
    return c;
  });

  // 渡された部分以外の連結については関与しないため関係がある部分だけを残す
  delete items[0]?.previousId;
  delete items[items.length - 1]?.nextId;

  return items;
};
