import { ScenarioId } from "@/lib/types";
import { scenarioBriefs } from "@/lib/scenarioBriefs";

interface ScenarioPickerProps {
  selectedScenario: ScenarioId | null;
  onScenarioChange: (scenarioId: ScenarioId) => void;
}

export default function ScenarioPicker({ selectedScenario, onScenarioChange }: ScenarioPickerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Scenario</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarioBriefs.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              selectedScenario === scenario.id
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg transform scale-105"
                : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
            }`}
          >
            {scenario.title}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        💡 The customer will reveal one new fact per turn following realistic support patterns.
      </p>
    </div>
  );
}
