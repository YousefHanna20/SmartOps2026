function ProjectFab() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          chat_bubble
        </span>
      </button>
    </div>
  );
}

export default ProjectFab;