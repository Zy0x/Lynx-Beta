import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Zap, Cpu, HardDrive, Thermometer, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    frequency: string[];
    governors: string[];
  };
  gpu: {
    frequency: string;
    load: number;
  };
  ram: {
    total: number;
    available: number;
    used: number;
    percentage: number;
  };
  thermal: {
    temperature: number;
    throttling: boolean;
    zones: Record<string, number>;
  };
  zram: {
    size: number;
    used: number;
    algorithm: string;
  };
}

interface ModuleInfo {
  name?: string;
  version?: string;
  author?: string;
  versionCode?: string;
  description?: string;
}

interface DeviceInfo {
  brand?: string;
  model?: string;
  processor?: string;
  android?: string;
  sdk?: string;
  architecture?: string;
  kernel?: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch module and device info on mount
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        // Get module info from file
        const modPropContent = await getModuleProperty();
        if (modPropContent) {
          const info = parseModuleInfo(modPropContent);
          setModuleInfo(info);
        }

        // Get device info
        const devInfo = await getDeviceProperties();
        setDeviceInfo(devInfo);
      } catch (error) {
        console.error("Failed to fetch info:", error);
      }
    };

    fetchInfo();
  }, []);

  // Fetch metrics periodically
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const procData = await getSystemProcData();
        const formattedMetrics = formatMetrics(procData);
        setMetrics(formattedMetrics);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Lynx Control Center</h1>
          <p className="text-slate-400">Real-time system monitoring and performance management</p>
        </div>

        {/* Module & Device Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Module Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white font-medium">{moduleInfo?.name || "Loading..."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span className="text-white font-medium">{moduleInfo?.version || "Loading..."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Author:</span>
                  <span className="text-white font-medium">{moduleInfo?.author || "Loading..."}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device:</span>
                  <span className="text-white font-medium">
                    {deviceInfo?.brand} {deviceInfo?.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Android:</span>
                  <span className="text-white font-medium">{deviceInfo?.android || "Loading..."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Architecture:</span>
                  <span className="text-white font-medium">{deviceInfo?.architecture || "Loading..."}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300">Overview</TabsTrigger>
            <TabsTrigger value="cpu" className="text-slate-300">CPU</TabsTrigger>
            <TabsTrigger value="memory" className="text-slate-300">Memory</TabsTrigger>
            <TabsTrigger value="thermal" className="text-slate-300">Thermal</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metrics?.cpu.usage || 0}%
                  </div>
                  <p className="text-xs text-slate-400">
                    {metrics?.cpu.cores || 0} cores
                  </p>
                </CardContent>
              </Card>

              {/* GPU Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    GPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metrics?.gpu.load || 0}%
                  </div>
                  <p className="text-xs text-slate-400">
                    {metrics?.gpu.frequency || "0"} MHz
                  </p>
                </CardContent>
              </Card>

              {/* RAM Card */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    RAM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metrics?.ram.percentage.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-slate-400">
                    {(metrics?.ram.used || 0) / 1024 / 1024 / 1024} / {(metrics?.ram.total || 0) / 1024 / 1024 / 1024} GB
                  </p>
                </CardContent>
              </Card>

              {/* Thermal Card */}
              <Card className={`border-slate-700 ${
                metrics?.thermal.throttling ? "bg-red-900" : "bg-slate-800"
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Thermal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {metrics?.thermal.temperature || 0}°C
                  </div>
                  <p className="text-xs text-slate-400">
                    {metrics?.thermal.throttling ? "Throttling" : "Normal"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CPU Tab */}
          <TabsContent value="cpu">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">CPU Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Cores</p>
                    <p className="text-white text-lg font-semibold">{metrics?.cpu.cores || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Frequencies</p>
                    <div className="flex flex-wrap gap-2">
                      {metrics?.cpu.frequency.map((freq, idx) => (
                        <span key={idx} className="bg-slate-700 text-white px-3 py-1 rounded text-sm">
                          {freq} MHz
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Governors</p>
                    <div className="flex flex-wrap gap-2">
                      {metrics?.cpu.governors.map((gov, idx) => (
                        <span key={idx} className="bg-slate-700 text-white px-3 py-1 rounded text-sm">
                          {gov}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Tab */}
          <TabsContent value="memory">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Memory Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">RAM Usage</p>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${metrics?.ram.percentage || 0}%` }}
                      />
                    </div>
                    <p className="text-white text-sm mt-2">
                      {(metrics?.ram.used || 0) / 1024 / 1024 / 1024} GB / {(metrics?.ram.total || 0) / 1024 / 1024 / 1024} GB
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">ZRAM</p>
                    <p className="text-white text-sm">
                      Size: {(metrics?.zram.size || 0) / 1024 / 1024} MB
                    </p>
                    <p className="text-white text-sm">
                      Used: {(metrics?.zram.used || 0) / 1024 / 1024} MB
                    </p>
                    <p className="text-white text-sm">
                      Algorithm: {metrics?.zram.algorithm || "lz4"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Thermal Tab */}
          <TabsContent value="thermal">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Thermal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Temperature</span>
                    <span className="text-white font-semibold text-lg">
                      {metrics?.thermal.temperature || 0}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Throttling Status</span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      metrics?.thermal.throttling
                        ? "bg-red-900 text-red-200"
                        : "bg-green-900 text-green-200"
                    }`}>
                      {metrics?.thermal.throttling ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {Object.entries(metrics?.thermal.zones || {}).map(([zone, temp]) => (
                    <div key={zone} className="flex items-center justify-between">
                      <span className="text-slate-400">{zone}</span>
                      <span className="text-white">{temp}°C</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex items-center justify-center p-8">
            <Activity className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-slate-400">Loading system data...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions to get system data via KernelSU APIs
async function getModuleProperty(): Promise<string | null> {
  try {
    // This will be called from the client with KernelSU exec API
    return null;
  } catch (error) {
    console.error("Failed to get module property:", error);
    return null;
  }
}

async function getDeviceProperties(): Promise<DeviceInfo> {
  return {
    brand: "Unknown",
    model: "Unknown",
    processor: "Unknown",
    android: "Unknown",
    sdk: "Unknown",
    architecture: "Unknown",
    kernel: "Unknown",
  };
}

async function getSystemProcData(): Promise<any> {
  return {};
}

function parseModuleInfo(content: string): ModuleInfo {
  const lines = content.split('\n');
  const info: ModuleInfo = {};

  for (const line of lines) {
    const [key, value] = line.split('=');
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      
      if (trimmedKey === 'name') info.name = trimmedValue;
      if (trimmedKey === 'version') info.version = trimmedValue;
      if (trimmedKey === 'author') info.author = trimmedValue;
      if (trimmedKey === 'versionCode') info.versionCode = trimmedValue;
      if (trimmedKey === 'description') info.description = trimmedValue;
    }
  }

  return info;
}

function formatMetrics(procData: any): SystemMetrics {
  return {
    cpu: {
      usage: 0,
      cores: 0,
      frequency: [],
      governors: [],
    },
    gpu: {
      frequency: "0",
      load: 0,
    },
    ram: {
      total: 0,
      available: 0,
      used: 0,
      percentage: 0,
    },
    thermal: {
      temperature: 0,
      throttling: false,
      zones: {},
    },
    zram: {
      size: 0,
      used: 0,
      algorithm: "lz4",
    },
  };
}
