interface Item {
  id: number;
  name: string;
}

export default async function Home() {
  const apiUrl =
    process.env.INTERNAL_API_URL ?? "";
  const res = await fetch(`${apiUrl}/api/items`, { cache: "no-store" });
  const items: Item[] = await res.json();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Items</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-4 rounded border border-gray-200 bg-white shadow-sm"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
