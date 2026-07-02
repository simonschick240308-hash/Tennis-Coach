"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VolumePoint = {
  week: string;
  minutes: number;
};

export function TrainingVolumeChart({ data }: { data: VolumePoint[] }) {
  const hasData = data.some((d) => d.minutes > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainingsvolumen (letzte 8 Wochen)</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="week"
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                />
                <YAxis
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  label={{ value: "Minuten", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--popover-foreground)",
                    fontSize: 13,
                  }}
                  formatter={(value) => [`${value} min`, "Trainingszeit"]}
                />
                <Bar dataKey="minutes" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Noch keine Trainingsdaten für die letzten 8 Wochen vorhanden.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
