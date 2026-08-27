import { useQuery } from "@tanstack/react-query";
import { riskApi } from "@/api/riskApi";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ward } from "@/types";

export function useWards() {
  return useQuery({ queryKey: ["wards"], queryFn: () => riskApi.listWards() });
}

export function WardSelect({
  wards,
  value,
  onChange,
  label = "Ward",
}: {
  wards: Ward[];
  value: string;
  onChange: (wardId: string) => void;
  label?: string | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="ward-select" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="ward-select" className="w-[260px]">
          <SelectValue placeholder="Select a ward" />
        </SelectTrigger>
        <SelectContent>
          {wards.map((ward) => (
            <SelectItem key={ward.id} value={ward.id}>
              {ward.name} — {ward.zone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
