function ProjectSideInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-900 text-white p-8 rounded-xl relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <p className="uppercase tracking-widest text-[11px] text-blue-200 mb-1">
            Active Template
          </p>

          <h4 className="text-xl font-bold mb-4">Enterprise Core v4.2</h4>

          <p className="text-sm text-blue-100 leading-relaxed opacity-80 mb-6">
            Optimized for high-frequency operational scaling and architectural
            integrity across multi-node environments.
          </p>

          <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all">
            View Blueprint
          </button>
        </div>

        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">
            auto_awesome
          </span>
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
        <h4 className="uppercase tracking-widest text-[11px] text-slate-500">
          Project Stakeholders
        </h4>

        <div className="flex -space-x-2">
          {[
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDTCHr1EtBMlaQl1uGkcsfZ3tX31tAmwH0uWgMdoSYKKzeLSj7HYcpBKer8FRXU4wrJi2TDcNANqkFZXh8heXfeo6ER4xAC7U3BiiBIGpdHtXC-gGd-OKx7nxlGgQizslFYoZSCm6uigB-Y9vl9QJRH6OVBH9Lk0oxKIGmEW0DBeHjQpImJPnJ3grso5zLi43buvEzE2WXNJ4IHauVDrZ6hI4pM3lMEcgP5G1FGuVG9zftACwco0jlXsRTGOgih3WroZ3lNFSgnlKs",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAe3jTXDS6JlqSbQD0BR-a9QIe7zERyFHVtt0x_Rgj99qI1FWO4I1TB6MsZO48PxoK8wyYvxHrxbGaAfDKyqvlVRqLOVbvOguCcRAUMDsIq5zcykgllXjTgbkxFeZmUr0fYxd0fe2ewget1K42tgCbdBv5OQ7DPG7YHSUHWqrgwWdNsG0uvDT6ffDh59FsvpsIBqJbbaW7-Hhe7NesI5EyzibBIsChtwaG0HOr47ZtNS8Xofo4YtlM6io_SpPqmh559bBaS1I7dLjY",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCtD1VrtaowuTGaqzAjEw23eBp8FR-7I1JYsx6cNq0DTUM8vSeVnLPWPlXqnu14pkvIzbojhd4KXYEayvSqvOSBU7PjdHuX7e-4Ixyey_XFBs8_Qf9_UdVoh-Guq-buRZQ4P7wJKaU51HrBWw7aCSkCcq0D1YKNr5bJl1QxaSuKcCwyWPQPSeck1sm5IGvFHvZ5ULy4OCDtR9-9UhjwAGdg9oOU0hbK0x8LaYGRxRVlSbUIstQRRgFOyKfLPL9_nhnsSf0Ow1IipBQ",
          ].map((src) => (
            <img
              key={src}
              alt="Team member"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              src={src}
            />
          ))}

          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
            +9
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl">
        <h4 className="uppercase tracking-widest text-[11px] text-slate-500 mb-4">
          Timeline Track
        </h4>

        <div className="space-y-3">
          <Bar width="w-full" color="bg-primary" />
          <Bar width="w-3/4" color="bg-primary" />
          <Bar width="w-1/2" color="bg-primary-fixed-dim" />
        </div>
      </div>
    </div>
  );
}

function Bar({ width, color }) {
  return (
    <div className="h-2 w-full bg-slate-200 rounded-full">
      <div className={`h-full ${color} rounded-full ${width}`} />
    </div>
  );
}

export default ProjectSideInfo;