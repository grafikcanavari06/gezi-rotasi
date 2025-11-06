// app/admin/themes/page.tsx
async function getThemes() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/admin/themes`, { cache: "no-store" });
  return res.json();
}

export default async function AdminThemesPage() {
  const themes = await getThemes();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin – Temalar</h1>
      <a
        href="/admin/themes/new"
        className="inline-block mb-4 px-4 py-2 bg-slate-900 text-white rounded"
      >
        Yeni Tema
      </a>
      <div className="border rounded overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Kod</th>
              <th className="p-2 text-left">Ad (TR)</th>
              <th className="p-2 text-left">Aktif</th>
            </tr>
          </thead>
          <tbody>
            {themes.map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.code}</td>
                <td className="p-2">{t.name_tr}</td>
                <td className="p-2">{t.isActive ? "Evet" : "Hayır"}</td>
              </tr>
            ))}
            {!themes.length && (
              <tr>
                <td className="p-2" colSpan={3}>
                  Tema yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
