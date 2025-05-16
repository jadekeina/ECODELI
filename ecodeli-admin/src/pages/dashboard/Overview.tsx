import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="p-6 ml-64 mt-16">
      <h2 className="text-xl font-semibold mb-4">Statistiques générales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Nombre de livreurs</h3>
            <p>128</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Prestations ce mois</h3>
            <p>312</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Revenus estimés</h3>
            <p>12 540 €</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
