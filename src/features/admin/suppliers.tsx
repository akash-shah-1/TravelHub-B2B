import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/status-badge";
import { suppliers } from "@/lib/mock-data";

export function SupplierConfig() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {suppliers.map(s => (
        <Card key={s.name}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div><CardTitle>{s.name}</CardTitle><CardDescription>{s.category}</CardDescription></div>
              <StatusBadge status={s.connected ? "Connected" : "Disconnected"} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">API Key</Label>
              <Input value={s.key} readOnly className="font-mono text-xs mt-1" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Tier Access</p>
              {["Master Agents", "Agents", "Sub-Agents"].map((tier, i) => (
                <div key={tier} className="flex items-center justify-between text-sm">
                  <span>{tier}</span>
                  <Switch defaultChecked={i < 2} onCheckedChange={(v) => toast(`${tier} ${v ? "enabled" : "disabled"} for ${s.name}`)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
