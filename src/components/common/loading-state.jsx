function LoadingState({
  type = "card",
  title = "Loading data...",
  rows = 4,
}) {
  const skeletonRows = Array.from({ length: rows }, (_, index) => index);

  if (type === "table") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="h-5 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-56 bg-slate-100 rounded-lg mt-3" />
        </div>

        <div className="hidden md:grid grid-cols-[1fr_140px_120px_120px_90px] gap-5 px-6 py-4 border-b border-slate-100">
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
        </div>

        {skeletonRows.map((row) => (
          <div
            key={row}
            className="grid grid-cols-1 md:grid-cols-[1fr_140px_120px_120px_90px] gap-5 items-center px-6 py-5 border-b border-slate-50 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />

              <div className="flex-1">
                <div className="h-4 w-44 bg-slate-200 rounded-lg" />
                <div className="h-3 w-32 bg-slate-100 rounded-lg mt-3" />
              </div>
            </div>

            <div className="h-4 bg-slate-100 rounded-lg" />
            <div className="h-8 bg-slate-100 rounded-full" />
            <div className="h-8 bg-slate-100 rounded-full" />
            <div className="h-8 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 animate-pulse">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div>
            <div className="h-4 w-32 bg-slate-200 rounded-lg mb-3" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
          </div>

          <div>
            <div className="h-4 w-28 bg-slate-200 rounded-lg mb-3" />
            <div className="h-32 w-full bg-slate-100 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="h-4 w-24 bg-slate-200 rounded-lg mb-3" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>

            <div>
              <div className="h-4 w-24 bg-slate-200 rounded-lg mb-3" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-12 w-24 bg-slate-100 rounded-xl" />
            <div className="h-12 w-32 bg-slate-200 rounded-xl" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5">
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
            <div className="h-10 w-20 bg-slate-100 rounded-lg" />
            <div className="h-10 w-20 bg-slate-100 rounded-lg" />
            <div className="h-10 w-20 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className="space-y-8 animate-pulse">
        <section>
          <div className="mb-8">
            <div className="h-3 w-32 bg-slate-200 rounded-lg" />
            <div className="h-9 w-80 bg-slate-200 rounded-xl mt-4" />
            <div className="h-4 w-full max-w-2xl bg-slate-100 rounded-lg mt-4" />
            <div className="h-4 w-2/3 bg-slate-100 rounded-lg mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-white p-8 rounded-xl border border-slate-100">
              <div className="h-3 w-40 bg-slate-200 rounded-lg" />
              <div className="h-10 w-24 bg-slate-200 rounded-lg mt-5" />
              <div className="h-3 w-full bg-slate-100 rounded-full mt-6" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100">
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              <div className="h-4 w-24 bg-slate-200 rounded-lg mt-5" />
              <div className="h-5 w-20 bg-slate-100 rounded-lg mt-3" />
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100">
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              <div className="h-4 w-24 bg-slate-200 rounded-lg mt-5" />
              <div className="h-5 w-20 bg-slate-100 rounded-lg mt-3" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100" />

        <div className="flex-1">
          <div className="h-5 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-64 bg-slate-100 rounded-lg mt-3" />
        </div>
      </div>

      <p className="sr-only">{title}</p>
    </div>
  );
}

export default LoadingState;