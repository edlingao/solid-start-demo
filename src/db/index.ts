export interface Item {
  id?: number;
  title?: string;
  state?: boolean;
};

let users = [{ id: 0, username: "kody", password: "twixrox" }];
let items: Item[] = [{ id: 0, title: "twix", state: false }];
export const db = {
  user: {
    async create({ data }: { data: { username: string; password: string } }) {
      let user = { ...data, id: users.length };
      users.push(user);
      return user;
    },

    async findUnique({
      where: { username = undefined, id = undefined },
    }: {
      where: { username?: string; id?: number };
    }) {
      if (id !== undefined) {
        return users.find((user) => user.id === id);
      } else {
        return users.find((user) => user.username === username);
      }
    },
  },
  item: {
    async create({ data }: { data: Item }): Promise<Item> {
      const item = { ...data, id: items.length };
      items.push(item);
      return item;
    },

    async findUnique({ where: { id = undefined } }: { where: { id?: number } }): Promise<Item | undefined> {
      return items.find((item) => item.id === id);
    },

    async findMany(): Promise<Item[]> {
      return items;
    },

    async deleteOne({ where: { id = undefined } }: { where: { id?: number } }): Promise<Item[]> {
      items = items.filter((item) => item.id !== id);
      return items;
    },

    async updateOne({ where: { id = undefined }, data }: { where: { id?: number }; data: Item }): Promise<Item[]> {
      items = items.map((item) => {
        if (item.id === id) {
          return { ...item, ...data };
        } else {
          return item;
        }
      });
      return items;
    },
  }
};
