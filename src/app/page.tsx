import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" >
      <Card className="w-full max-w-md m-4">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenue!</CardTitle>
          <CardDescription>
            Bienvenue sur l'application de Gestion des Commandes et Livraisons.
            Utilisez la navigation pour accéder aux différentes sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p>Sélectionnez une option dans le menu de gauche pour commencer.</p>
          <Link href="/dashboard">
            <Button>Aller au Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
