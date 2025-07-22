import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AutocompleteInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AutocompleteInput({
  name,
  label,
  value,
  onChange,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    onChange(e);

    if (!inputVal) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete?key=${import.meta.env.VITE_Maps_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: inputVal,
            languageCode: "fr",
            regionCode: "FR",
          }),
        },
      );

      const data = await res.json();
      const results =
        data?.suggestions?.map((s: any) => s?.placePrediction?.text?.text) ||
        [];

      setSuggestions(results);
    } catch (error) {
      console.error("Erreur API Google Places :", error);
    }
  };

  const handleSelect = (suggestion: string) => {
    const fakeEvent = {
      target: {
        name,
        value: suggestion,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent); // met bien à jour formData
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Label className="text-base mb-1">{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={handleInput}
        autoComplete="off"
        className="h-12 text-base"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
