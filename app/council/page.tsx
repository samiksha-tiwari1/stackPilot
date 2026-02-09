import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CouncilPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Council</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><b>Planner:</b> Breaking roadmap into workstreams.</p>
          <p><b>Critic:</b> Adjusting timelines for KB integration.</p>
          <p><b>Assigner:</b> Assigning auth module to Arjun.</p>
          <p><b>InsightAI:</b> Recommending specs before coding.</p>
        </CardContent>
      </Card>
    </div>
  );
}