import { For, createEffect, createSignal } from "solid-js";
import { useRouteData } from "solid-start";
import server$, {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { Todo } from "~/components/Todo";
import { db, type Item } from "~/db";
import { getUser, logout } from "~/db/session";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
}

const createItems = server$((title: string) => {
  db.item.create({
    data: {
      title,
      state: false,
    },
  });

  return db.item.findMany()
});

const fetchItems = server$(() => {
  return db.item.findMany();
});

export default function Home() {
  const user = useRouteData<typeof routeData>();
  const [items, setItems] = createSignal<Item[]>([]);
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { title } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    createItems(title as string)
      .then((items) => {
        setItems(items);
        e.target.reset();
      });
  };

  fetchItems()
    .then((items) => setItems(items));

  return (
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-3xl">Hello {user()?.username}</h1>
      <h3 class="font-bold text-xl">Message board</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Todo item
          <input type="text" name="title" />
        </label>
      </form>
      <hr />
      <For each={items()}>{({title, state, id}) =>
        <Todo title={title} state={state} id={id} onDelete={(items) => setItems(items)}/>
      }</For>
      <Form>
        <button name="logout" type="submit">
          Logout
        </button>
      </Form>
    </main>
  );
}
