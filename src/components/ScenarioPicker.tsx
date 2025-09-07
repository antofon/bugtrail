import { ScenarioId } from "@/lib/types";
import { scenarioBriefs } from "@/lib/scenarioBriefs";

interface ScenarioPickerProps {
  selectedScenario: ScenarioId | null;
  onScenarioChange: (scenarioId: ScenarioId) => void;
}

export default function ScenarioPicker({ selectedScenario, onScenarioChange }: ScenarioPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Scenario</h3>
      <div className="flex flex-wrap gap-2">
        {scenarioBriefs.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              selectedScenario === scenario.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {scenario.title}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        The customer will reveal one new fact per turn.
      </p>
    </div>
  );
}
