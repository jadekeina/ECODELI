import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export type Livreur = {
  id: number
  nom: string
  email: string
  statut: "validé" | "en attente" | "refusé"
  justificatif: string
  telephone: string
  ville: string
}

const livreursInitiaux: Livreur[] = [
  {
    id: 1,
    nom: "Jean Dupont",
    email: "jean@mail.com",
    statut: "en attente",
    justificatif: "/docs/permis-jean.pdf",
    telephone: "06 12 34 56 78",
    ville: "Paris",
  },
  {
    id: 2,
    nom: "Sarah Lemoine",
    email: "sarah@mail.com",
    statut: "validé",
    justificatif: "/docs/permis-sarah.pdf",
    telephone: "07 98 76 54 32",
    ville: "Lyon",
  },
  {
    id: 3,
    nom: "Youssef K.",
    email: "youk@mail.com",
    statut: "refusé",
    justificatif: "/docs/permis-youk.pdf",
    telephone: "06 22 33 44 55",
    ville: "Marseille",
  },
]

export default function Livreurs() {
  const [livreurs, setLivreurs] = useState<Livreur[]>(livreursInitiaux)
  const [recherche, setRecherche] = useState<string>("")
  const [filtreStatut, setFiltreStatut] = useState<string>("")

  const changerStatut = (id: number, statut: Livreur["statut"]) => {
    setLivreurs((prev) => prev.map((l) => (l.id === id ? { ...l, statut } : l)))
  }

  const supprimerLivreur = (id: number) => {
    setLivreurs((prev) => prev.filter((l) => l.id !== id))
  }

  const filtrer = livreurs.filter((l) => {
    const matchRecherche =
      l.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      l.email.toLowerCase().includes(recherche.toLowerCase())

    const matchStatut = filtreStatut ? l.statut === filtreStatut : true

    return matchRecherche && matchStatut
  })

  return (
    <div className="p-6 ml-64 mt-16">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold">Gestion des livreurs</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-64"
          />
          <Select onValueChange={(val) => setFiltreStatut(val)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md" >
            <SelectItem value="validé">Validé</SelectItem>
              <SelectItem value="en attente">En attente</SelectItem>
              <SelectItem value="refusé">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <table className="w-full text-left border rounded overflow-hidden shadow-md bg-white">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Justificatif</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtrer.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3 font-medium">
                <Dialog>
                  <DialogTrigger className="text-blue-600 hover:underline">
                    {l.nom}
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Fiche du livreur</DialogTitle>
                      <DialogDescription className="space-y-2 mt-4">
                        <p><strong>Nom :</strong> {l.nom}</p>
                        <p><strong>Email :</strong> {l.email}</p>
                        <p><strong>Téléphone :</strong> {l.telephone}</p>
                        <p><strong>Ville :</strong> {l.ville}</p>
                        <p><strong>Statut :</strong> {l.statut}</p>
                        <p>
                          <strong>Justificatif :</strong>{" "}
                          <a
                            href={l.justificatif}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Voir le fichier
                          </a>
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </td>
              <td className="p-3">{l.email}</td>
              <td className="p-3">{l.telephone}</td>
              <td className="p-3">{l.ville}</td>
              <td className="p-3">
                <a
                  href={l.justificatif}
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
                    l.statut === "validé"
                      ? "default"
                      : l.statut === "en attente"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {l.statut}
                </Badge>
              </td>
              <td className="p-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changerStatut(l.id, "validé")}
                >
                  Valider
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changerStatut(l.id, "refusé")}

                >

                  Refuser

                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => supprimerLivreur(l.id)}

                >

                  Supprimer

                </Button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}
