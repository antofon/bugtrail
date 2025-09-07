import { Persona } from "@/lib/types";

interface PersonaControlsProps {
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export default function PersonaControls({ persona, onPersonaChange }: PersonaControlsProps) {
  const updatePersona = (field: keyof Persona, value: string) => {
    onPersonaChange({ ...persona, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Customer Persona</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            value={persona.industry}
            onChange={(e) => updatePersona("industry", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="SaaS">SaaS</option>
            <option value="Ecommerce">Ecommerce</option>
            <option value="Fintech">Fintech</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tech Savvy
          </label>
          <select
            value={persona.techSavvy}
            onChange={(e) => updatePersona("techSavvy", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patience
          </label>
          <select
            value={persona.patience}
            onChange={(e) => updatePersona("patience", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone Arc
          </label>
          <select
            value={persona.toneArc}
            onChange={(e) => updatePersona("toneArc", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="calm_to_frustrated">Calm → Frustrated</option>
            <option value="steady_calm">Steady Calm</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={persona.timezone}
            onChange={(e) => updatePersona("timezone", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="America/Los_Angeles">PT</option>
            <option value="America/New_York">ET</option>
            <option value="Europe/London">GMT</option>
          </select>
        </div>
      </div>
    </div>
  );
}
