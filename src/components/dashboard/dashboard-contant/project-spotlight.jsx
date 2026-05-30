function ProjectSpotlight() {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/5] shadow-xl group">
      <img
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNNZ7e_ScroeT3JzYXKzflzffWR54HYEpO31Kdlq7R4umtLOE2cG9aPmUIKL9CocL4mfkvfhhnYsxBG4Uz8LkBEvAal4yI3y0YUpKi_ZKz6PW0HHCSoAlx8PqmlIcpxX8iNS914JHbIQ33gPq1zGb6kGqHtkI87LJOhs0m0kkjkxhSg-rstMZQicQTRzi-nQhXIH4CzYXhx_95hosig3z5jbFf6qaMVyzn02DVyu7UhpELhDTybbKjg2vMvOS_mFMD-K0mVBIbsfI"
        alt="Project Spotlight"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

      <div className="absolute bottom-0 left-0 p-8">
        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
          Project Spotlight
        </span>

        <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
          Neo-Brutalist Plaza Concept
        </h3>

        <p className="text-white/80 text-sm mt-2">
          Voted top design candidate for the Seattle Innovation Hub.
        </p>

        <button className="mt-6 text-white font-bold flex items-center gap-2 hover:gap-4 transition-all">
          View Details
          <span className="material-symbols-outlined">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}

export default ProjectSpotlight;