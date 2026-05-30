function IntegratedChannels() {
  return (
    <div className="bg-white rounded-xl p-6 border border-outline-variant/10">
      <h3 className="font-bold text-primary uppercase tracking-wider text-[10px] mb-4">
        Integrated Channels
      </h3>

      <div className="flex flex-wrap gap-2">
        <Channel name="Slack" color="bg-green-500" />
        <Channel name="Teams" color="bg-blue-500" />
        <Channel name="Email" color="bg-orange-500" />
      </div>
    </div>
  );
}

function Channel({ name, color }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-slate-600 uppercase">
        {name}
      </span>
    </div>
  );
}

export default IntegratedChannels;