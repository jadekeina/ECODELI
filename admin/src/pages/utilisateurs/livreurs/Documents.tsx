import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const documentsInitiaux = [
  {
    id: 1,
    livreur: "Jean Dupont",
    email: "jean@mail.com",
    type: "Permis de conduire",
    url: "/docs/permis-jean.pdf",
    statut: "en attente",
  },
  {
    id: 2,
    livreur: "Sarah Lemoine",
    email: "sarah@mail.com",
    type: "Carte d'identité",
    url: "/docs/cni-sarah.pdf",
    statut: "validé",
  },
  {
    id: 3,
    livreur: "Youssef K.",
    email: "youk@mail.com",
    type: "Justificatif de domicile",
    url: "/docs/domicile-youk.pdf",
    statut: "refusé",
  },
]

export default function DocumentsLivreurs() {
  const [documents] = useState(documentsInitiaux)
  const [recherche, setRecherche] = useState("")
  const [filtreStatut, setFiltreStatut] = useState("")

  const filtrer = documents.filter((doc) => {
    const matchRecherche =
      doc.livreur.toLowerCase().includes(recherche.toLowerCase()) ||
      doc.email.toLowerCase().includes(recherche.toLowerCase()) ||
      doc.type.toLowerCase().includes(recherche.toLowerCase())

    const matchStatut = filtreStatut ? doc.statut === filtreStatut : true

    return matchRecherche && matchStatut
  })

  return (
    <div className="p-6 ml-64 mt-16">
      <h2 className="text-xl font-semibold mb-4">Documents à valider</h2>

      <div className="flex justify-between gap-4 mb-4">
        <Input
          placeholder="Rechercher par nom, email ou type..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-1/2"
        />
        <Select onValueChange={(val) => setFiltreStatut(val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-md">
            <SelectItem value="validé">Validé</SelectItem>
            <SelectItem value="en attente">En attente</SelectItem>
            <SelectItem value="refusé">Refusé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <table className="w-full text-left border rounded overflow-hidden shadow-md bg-white">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3">Livreur</th>
            <th className="p-3">Email</th>
            <th className="p-3">Type</th>
            <th className="p-3">Fichier</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtrer.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="p-3 font-medium">{doc.livreur}</td>
              <td className="p-3">{doc.email}</td>
              <td className="p-3">{doc.type}</td>
              <td className="p-3">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Voir
                </a>
              </td>
              <td className="p-3">
                <Badge
                  variant={
                    doc.statut === "validé"
                      ? "default"
                      : doc.statut === "en attente"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {doc.statut}
                </Badge>
              </td>
              <td className="p-3 flex gap-2">
                <Button size="sm" variant="outline">Valider</Button>
                <Button size="sm" variant="destructive">Refuser</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
