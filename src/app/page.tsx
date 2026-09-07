export default function Home() {
  const hasMovies = false; // troca pra true quando o CRUD estiver puxando dados reais

  return (
    <main className="min-h-screen">
      {!hasMovies && (
        <section className="px-10 pt-16 pb-10">
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Noctreel</h1>
          <p className="text-neutral-400">
            Ainda não há filmes cadastrados. Vá em{" "}
            <a href="/buscar" className="text-emerald-400 hover:underline">
              Buscar
            </a>{" "}
            para adicionar o primeiro.
          </p>
        </section>
      )}

      <section className="px-10 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Filmes assistidos", value: "0" },
            { label: "Este mês", value: "0" },
            { label: "Nota média", value: "—" },
            { label: "Challenges ativos", value: "0" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4">
              <p className="text-neutral-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-medium mb-4">Últimos adicionados</h2>
        <p className="text-neutral-500 text-sm">
          Nenhum filme cadastrado ainda.
        </p>
      </section>
    </main>
  );
}
