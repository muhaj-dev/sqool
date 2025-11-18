import { GraduationCap, School, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClassStats } from "@/utils/api";

interface ClassStatsData {
  total: number;
  nursery: number;
  primary: number;
  secondary: number;
  tertiary: number;
}

interface ClassStatsProps {
  onRefresh?: () => void;
}

const ClassStats = ({ onRefresh }: ClassStatsProps) => {
  const [stats, setStats] = useState<ClassStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getClassStats();
        // If response.data is an array, use [0]
        setStats(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (err) {
        console.log(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    void fetchStats();
  }, [onRefresh]);

  if (loading) {
    return <div>Loading class stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow-md transition-shadow border-[gray]/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          <School className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
          <p className="text-xs text-muted-foreground">Active classes</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow border-[gray]/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nursery</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.nursery ?? 0}</div>
          <p className="text-xs text-muted-foreground">Nursery classes</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow border-[gray]/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Primary</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.primary ?? 0}</div>
          <p className="text-xs text-muted-foreground">Primary classes</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow border-[gray]/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Secondary</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.secondary ?? 0}</div>
          <p className="text-xs text-muted-foreground">Secondary classes</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassStats;
