import { BugTrail } from "@/lib/types";
import Button from "./Button";

interface ExtractPanelProps {
  bugtrail: BugTrail | null;
  onCopyMarkdown: () => void;
  onCopyJira: () => void;
}

export default function ExtractPanel({ bugtrail, onCopyMarkdown, onCopyJira }: ExtractPanelProps) {
  if (!bugtrail) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">BugTrail Report</h2>
        <p className="text-gray-500 text-sm">
          Generate a BugTrail to see the structured report here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">BugTrail Report</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCopyMarkdown}>
            Copy Markdown
          </Button>
          <Button variant="outline" size="sm" onClick={onCopyJira}>
            Copy for Jira
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Trailhead (Title)</h3>
          <p className="text-sm text-gray-900">{bugtrail.title || "No title provided"}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Summary</h3>
          <p className="text-sm text-gray-900">{bugtrail.summary || "No summary provided"}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Environment Markers</h3>
          {bugtrail.environment.length > 0 ? (
            <ul className="text-sm text-gray-900 space-y-1">
              {bugtrail.environment.map((env, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {env}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No environment details provided</p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Preconditions</h3>
          {bugtrail.preconditions.length > 0 ? (
            <ul className="text-sm text-gray-900 space-y-1">
              {bugtrail.preconditions.map((precondition, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {precondition}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No preconditions specified</p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Trail Steps (Steps to reproduce)</h3>
          {bugtrail.steps.length > 0 ? (
            <ol className="text-sm text-gray-900 space-y-1">
              {bugtrail.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-2 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">No steps provided</p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Expected path / Actual detour</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-green-700 mb-1">Expected:</h4>
              <p className="text-sm text-gray-900">{bugtrail.expected || "No expected behavior specified"}</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-red-700 mb-1">Actual:</h4>
              <p className="text-sm text-gray-900">{bugtrail.actual || "No actual behavior specified"}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Impact</h3>
          <p className="text-sm text-gray-900">{bugtrail.impact || "No impact assessment provided"}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Artifacts (Evidence)</h3>
          {bugtrail.evidence.length > 0 ? (
            <ul className="text-sm text-gray-900 space-y-1">
              {bugtrail.evidence.map((evidence, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {evidence}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No evidence provided</p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
          {bugtrail.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bugtrail.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tags provided</p>
          )}
        </section>
      </div>
    </div>
  );
}
