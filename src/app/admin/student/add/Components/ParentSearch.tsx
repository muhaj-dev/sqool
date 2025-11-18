import { useEffect, useState } from "react";

interface ParentOption {
  parentId: string;
  name: string;
  email?: string;
  occupation: string;
}

interface Props {
  parents: ParentOption[];
  onSelect: (parentId: string) => void;
}

export default function ParentSearch({ parents, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState<ParentOption | null>(null);

  // Reset selectedParent if parents prop changes (e.g., new search)
  useEffect(() => {
    if (selectedParent && !parents.find((p) => p.parentId === selectedParent.parentId)) {
      setSelectedParent(null);
    }
  }, [parents]);

  const filteredParents = parents.filter((parent) =>
    parent.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (parent: ParentOption) => {
    setSelectedParent(parent);
    onSelect(parent.parentId);
  };

  const handleClearSelection = () => {
    setSelectedParent(null);
    onSelect(""); // Clear selection in parent form
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      {/* <input
        type="text"
        placeholder="Search parent..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        disabled={!!selectedParent} // Disable search if parent selected
      /> */}

      {/* Selected parent */}
      {selectedParent ? (
        <div className="p-3 border rounded-md bg-blue-50 flex justify-between items-start">
          <div>
            <p className="font-medium">Selected: {selectedParent?.name}</p>
            <p className="text-sm text-gray-600">{selectedParent?.email}</p>
            <p className="text-sm text-gray-500">{selectedParent?.occupation}</p>
          </div>
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-sm text-blue-600 underline"
          >
            Change
          </button>
        </div>
      ) : null}

      {/* List of parents below */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredParents.map((parent) => (
          <div
            key={parent.parentId}
            onClick={() => handleSelect(parent)}
            className="p-3 border rounded-md cursor-pointer hover:bg-gray-100"
          >
            <p className="font-medium">{parent?.name}</p>
            <p className="text-sm text-gray-600">{parent?.email}</p>
            <p className="text-xs text-gray-500">{parent?.occupation}</p>
          </div>
        ))}

        {filteredParents.length === 0 && <p className="text-gray-500 text-sm">No parent found.</p>}
      </div>
    </div>
  );
}
