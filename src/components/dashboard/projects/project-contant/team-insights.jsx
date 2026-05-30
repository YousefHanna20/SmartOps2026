import SprintCard from "./sprint-card.jsx.jsx";

function TeamInsights() {
  return (
    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
      <SprintCard
        title="Neural Network Phase 2"
        description="Integration of LLM processing units for architectural automation workflows."
        progress="68%"
        tag="Active Sprint"
        icon="analytics"
      />

      <SprintCard
        title="API Gateway Upgrade"
        description="Securing internal endpoints with zero-trust architecture protocols."
        progress="92%"
        tag="Quick Start"
        icon="bolt"
      />
    </div>
  );
}

export default TeamInsights;