// app/(modules)/commandes/[commandeId]/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingCart,
  Printer,
  User,
  CalendarDays,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useCallback, use, Suspense } from "react";
import { Commande, StatutCommande } from "@/types/commande";
import {
  getCommandeById,
  updateCommandeStatut,
} from "@/services/commandeService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Props for the inner client component that uses `use`
interface CommandeDetailsClientProps {
  params: Promise<{ commandeId: string }>;
}

// Props for the Page component (default export)
interface CommandeDetailsPageParams {
  commandeId: string;
}
interface CommandeDetailsPageProps {
  params: CommandeDetailsPageParams;
}

function CommandeDetails({ params }: CommandeDetailsClientProps) {
  const resolvedParams = use(params);

  const router = useRouter();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null
  );
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<
    StatutCommande | undefined
  >(undefined);

  const [commandeIdNum, setCommandeIdNum] = useState<number | null>(null);

  useEffect(() => {
    if (resolvedParams && typeof resolvedParams.commandeId === "string") {
      const id = parseInt(resolvedParams.commandeId, 10);
      if (!isNaN(id)) {
        setCommandeIdNum(id);
      } else {
        setError("Format de l'ID de commande invalide.");
        setLoading(false);
      }
    } else {
      setError("Paramètres de commande non disponibles ou invalides après résolution.");
      setLoading(false);
    }
  }, [resolvedParams]);

  const fetchCommandeDetails = useCallback(async (idToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommandeById(idToFetch);
      if (data) {
        setCommande(data);
        setSelectedStatus(data.statut);
      } else {
        setCommande(null);
        setError("Commande non trouvée.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de la commande."
      );
      setCommande(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (commandeIdNum !== null) {
      fetchCommandeDetails(commandeIdNum);
    }
  }, [commandeIdNum, fetchCommandeDetails]);

  const handleUpdateStatus = async () => {
    if (!commande || !selectedStatus || commandeIdNum === null) {
      setStatusUpdateError("Données de commande ou statut invalides.");
      return;
    }
    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    setStatusUpdateSuccess(null);
    try {
      await updateCommandeStatut(commandeIdNum, selectedStatus);
      setStatusUpdateSuccess("Statut mis à jour.");
      fetchCommandeDetails(commandeIdNum);
    } catch (err) {
      setStatusUpdateError(
        err instanceof Error ? err.message : "Erreur mise à jour statut."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusVariant = (
    status: StatutCommande
  ):
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "success"
    | "warning"
    | "info" => {
    switch (status) {
      case StatutCommande.LIVREE:
        return "success";
      case StatutCommande.EN_ATTENTE:
        return "warning";
      case StatutCommande.ANNULEE:
        return "destructive";
      case StatutCommande.EN_PREPARATION:
      case StatutCommande.EXPEDIEE:
        return "info";
      case StatutCommande.VALIDEE:
        return "default";
      default:
        return "secondary";
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="text-xl font-semibold">Erreur</p>
        <p>{error}</p>
        <Link href="/commandes">
          <Button className="mt-4">Retour aux commandes</Button>
        </Link>
      </div>
    );
  }

  if (loading || !commande) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement de la commande...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/commandes">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" /> Commande #
              {`CMD-${String(commande.id).padStart(4, "0")}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Passée le{" "}
              {format(new Date(commande.date), "PPPpp", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.print()} disabled>
            <Printer className="h-4 w-4 mr-2" /> Imprimer
          </Button>
          <Select
            value={selectedStatus}
            onValueChange={(value: StatutCommande) => setSelectedStatus(value)}
            disabled={
              isUpdatingStatus ||
              commande.statut === StatutCommande.LIVREE ||
              commande.statut === StatutCommande.ANNULEE
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Changer le statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StatutCommande).map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  disabled={
                    (s === StatutCommande.LIVREE &&
                      commande.statut !== StatutCommande.EXPEDIEE) ||
                    (s === StatutCommande.EXPEDIEE &&
                      commande.statut !== StatutCommande.EN_PREPARATION &&
                      commande.statut !== StatutCommande.VALIDEE)
                  }
                >
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleUpdateStatus}
            disabled={
              isUpdatingStatus ||
              !selectedStatus ||
              selectedStatus === commande.statut ||
              commande.statut === StatutCommande.LIVREE ||
              commande.statut === StatutCommande.ANNULEE
            }
          >
            {isUpdatingStatus ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder Statut
          </Button>
        </div>
      </div>

      {statusUpdateError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            </div>
            <div>
              <p className="font-bold">Erreur de mise à jour</p>
              <p className="text-sm">{statusUpdateError}</p>
            </div>
          </div>
        </div>
      )}
      {statusUpdateSuccess && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
            </div>
            <div>
              <p className="font-bold">Succès</p>
              <p className="text-sm">{statusUpdateSuccess}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Produits Commandés</span>
                <Badge variant={getStatusVariant(commande.statut)}>
                  {commande.statut.replace(/_/g, " ")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-center">Qté</TableHead>
                    <TableHead className="text-right">Prix Unit.</TableHead>
                    <TableHead className="text-right">Total Ligne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commande.lignesCommande.map((ligne) => {
                    const produitNom = ligne?.produit?.nom ?? "Produit inconnu";
                    const produitId = ligne?.produit?.id ?? "N/A";
                    // Use a unique key: ligne.produit.id if available, then ligne.id, then random
                    const rowKey = ligne?.produit?.id ?? ligne?.id ?? Math.random().toString();

                    return (
                      <TableRow key={rowKey}>
                        <TableCell>
                          <div className="font-medium">{produitNom}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {produitId}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {ligne.quantite}
                        </TableCell>
                        <TableCell className="text-right">{`€${ligne.prixUnitaire.toFixed(
                          2
                        )}`}</TableCell>
                        <TableCell className="text-right">{`€${(
                          ligne.quantite * ligne.prixUnitaire
                        ).toFixed(2)}`}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-1 pt-4 border-t">
              <div className="flex justify-between w-full max-w-xs text-lg font-semibold">
                <span>Total Commande:</span>
                <span>{`€${commande.montantTotal.toFixed(2)}`}</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {commande?.client ? (
                <>
                  <p className="font-medium">{commande.client.nom ?? 'Nom non disponible'}</p>
                  {commande.client.email && (
                    <p className="text-muted-foreground">
                      {commande.client.email}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    ID: {commande.client.id ?? 'ID non disponible'}
                  </p>
                  {commande.client.id && (
                    <Link
                      href={`/clients/${commande.client.id}`}
                      className="text-primary hover:underline text-xs"
                    >
                      Voir profil client
                    </Link>
                  )}
                </>
              ) : (
                <p>Informations client non disponibles.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Date de Commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">
                  {format(new Date(commande.date), "PPPpp", { locale: fr })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CommandeDetailsPage({ params: pageParams }: CommandeDetailsPageProps) {
  const paramsPromise = Promise.resolve(pageParams);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Chargement des paramètres...</p>
        </div>
      }
    >
      <CommandeDetails params={paramsPromise} />
    </Suspense>
  );
}
