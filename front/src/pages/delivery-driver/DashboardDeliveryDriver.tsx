import { useEffect, useState, useContext } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {UserContext} from "@/contexts/UserContext";
import API_URL from "@/config";

interface Payment {
    id: number;
    amount: number;
    created_at: string;
    request_id: number;
    status: string;
}

const DashBoardDeliveryDriver = () => {
    const { user } = useContext(UserContext);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");


    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/delivery-driver-payments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setPayments(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des paiements :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const total = payments.reduce((sum: number, item: Payment) => sum + item.amount, 0);

    return (
        <div className="p-6 space-y-6">
            <div className="text-xl font-bold">
                Solde actuel : <span className="text-green-600">{total.toFixed(2)} €</span>
            </div>

            <div className="rounded-lg border shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Montant (€)</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>ID de la demande</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!loading && payments.length > 0 ? (
                            payments.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.amount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                                    <TableCell>{item.request_id}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">{item.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    {loading ? "Chargement..." : "Aucun paiement trouvé."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DashBoardDeliveryDriver;
