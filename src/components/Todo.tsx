import server$ from "solid-start/server";
import { Item, db } from "~/db";

interface TodoProps {
  title?: string;
  state?: boolean;
  id?: number;
  onDelete?: (newItems: Item[]) => void;
  onToggle?: () => void;
}

const deleteItem = server$((id?: number) => {
  db.item.deleteOne({
    where: {
      id,
    },
  });

  return db.item.findMany();
});

const toggleItem = server$((id?: number, state?: boolean) => {
  db.item.updateOne({
    where: {
      id,
    },
    data: {
      state,
    },
  });

  return db.item.findMany();
});

export function Todo({title, state, id, onDelete, onToggle}: TodoProps) {
  const handleDelete = () => {
    deleteItem(id)
      .then((items) => {
        onDelete?.(items);
      });
  };

  const handleToggle = () => {
    toggleItem(id, !state)
      .then(() => {
        onToggle?.();
      });
  };

  return (
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-row items-center">
        <label class="ml-2">
          <input type="checkbox" name="state" checked={state} onChange={handleToggle}/>
          <span>{title}</span>
        </label>
      </div>
      <div class="flex flex-row items-center">
        <button class="text-red-500" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}
