import { ThemeSelector } from "@/features/(app)/settings/tabItems/ThemeSelector";
import * as Card from "@/components/ui/card";

export default function AppearanceTab() {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Theme</Card.CardTitle>
        <Card.CardDescription>Customize how the application looks</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="space-y-6">
        <ThemeSelector />
      </Card.CardContent>
    </Card.Card>
  );
}
