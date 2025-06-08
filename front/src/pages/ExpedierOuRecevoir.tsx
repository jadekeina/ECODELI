import { useState } from "react";

type ObjectItem = {
    quantity: number;
    name: string;
    size: string;
    weight: string;
};

type ObjectKey = keyof ObjectItem;

const ExpedierOuRecevoir = () => {
    const [objects, setObjects] = useState<ObjectItem[]>([
        { quantity: 1, name: "", size: "", weight: "" }
    ]);

    const handleObjectChange = (
        index: number,
        field: ObjectKey,
        value: string
    ) => {
        const newObjects = [...objects];
        newObjects[index] = {
            ...newObjects[index],
            [field]: field === "quantity" ? Number(value) : value
        };
        setObjects(newObjects);
    };

  const addObject = () => {
    setObjects([
      ...objects,
      { quantity: 1, name: "", size: "", weight: "" },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Quels objets envoyez-vous ?
      </h2>

      {/* Zone d'ajout photo */}
      <div className="border-2 border-dashed rounded-xl p-6 text-center mb-4 bg-gray-50">
        <p className="mb-2 font-medium text-center">Ajouter des photos</p>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/gif"
          className="mx-auto"
        />
        <p className="text-xs text-gray-500 mt-1 text-center">
          Jusqu'à 7 photos, format JPG, PNG et GIF jusqu'à 7MB.
        </p>
      </div>

      {objects.map((obj, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="number"
            min={1}
            value={obj.quantity}
            onChange={(e) =>
              handleObjectChange(index, "quantity", e.target.value)
            }
            placeholder="Quantité"
            className="border p-2 rounded"
          />
          <input
            value={obj.name}
            onChange={(e) =>
              handleObjectChange(index, "name", e.target.value)
            }
            placeholder="Ex : Canapé, fauteuil..."
            className="border p-2 rounded"
          />
          <select
            value={obj.size}
            onChange={(e) =>
              handleObjectChange(index, "size", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Choisir une taille</option>
            <option value="petit">Petit</option>
            <option value="moyen">Moyen</option>
            <option value="grand">Grand</option>
          </select>
          <select
            value={obj.weight}
            onChange={(e) =>
              handleObjectChange(index, "weight", e.target.value)
            }
            className="border p-2 rounded"
          >
            <option value="">Poids</option>
            <option value="0-10kg">0-10kg</option>
            <option value="10-30kg">10-30kg</option>
            <option value="30kg+">30kg+</option>
          </select>
        </div>
      ))}

      <button
        onClick={addObject}
        className="border border-blue-500 text-blue-500 px-4 py-2 rounded mb-6 hover:bg-blue-50"
      >
        Ajouter un objet
      </button>

      <textarea
        placeholder="Ex : Le carton le plus long fait 2m15, le plus lourd est un canapé"
        className="w-full border p-2 rounded mb-6"
      />

      <button className="bg-blue-600 text-white px-6 py-3 w-full rounded hover:bg-blue-700">
        Suivant
      </button>
    </div>
  );
};

export default ExpedierOuRecevoir;
