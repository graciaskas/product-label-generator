import { LabelGenerator } from "@/components/label-generator";

export default function GeneratePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Générer une étiquette
        </h1>
        <p className="text-muted-foreground">
          Créez des étiquettes professionnelles avec codes de traçabilité
        </p>
      </div>
      <LabelGenerator />
    </div>
  );
}
