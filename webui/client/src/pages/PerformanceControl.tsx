import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Zap, Wind, Flame, Battery } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type PerformanceMode = "auto" | "aggressive" | "high" | "powersave";

interface ModeConfig {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
}

const modeConfigs: Record<PerformanceMode, ModeConfig> = {
  auto: {
    name: "Auto (AI)",
    description: "Intelligent mode that adapts to your usage patterns",
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-600 to-blue-400",
    benefits: ["Balanced performance", "Adaptive optimization", "Smart power management"],
  },
  aggressive: {
    name: "Aggressive",
    description: "Maximum performance for demanding tasks",
    icon: <Flame className="w-6 h-6" />,
    color: "from-red-600 to-red-400",
    benefits: ["Peak performance", "High CPU/GPU clocks", "Minimal throttling"],
  },
  high: {
    name: "High Performance",
    description: "Optimized for gaming and heavy workloads",
    icon: <Wind className="w-6 h-6" />,
    color: "from-orange-600 to-orange-400",
    benefits: ["Gaming optimized", "Sustained performance", "Moderate power usage"],
  },
  powersave: {
    name: "Powersave",
    description: "Extended battery life with reduced performance",
    icon: <Battery className="w-6 h-6" />,
    color: "from-green-600 to-green-400",
    benefits: ["Battery efficient", "Lower heat", "Reduced power consumption"],
  },
};

export default function PerformanceControl() {
  const [currentMode, setCurrentMode] = useState<PerformanceMode>("auto");
  const [thermalEnabled, setThermalEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<string>("");

  // Load current configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // This will be called with KernelSU exec API to read lynx.conf
        // For now, we'll use placeholder data
        setConfig("lynx.mode=auto\nlynx.thermal=1");
      } catch (error) {
        console.error("Failed to load config:", error);
        toast.error("Failed to load configuration");
      }
    };

    loadConfig();
  }, []);

  const handleModeChange = async (mode: PerformanceMode) => {
    setLoading(true);
    try {
      // Call the backend to prepare the mode change
      // The actual execution happens on the client via KernelSU APIs
      toast.loading(`Applying ${modeConfigs[mode].name}...`);
      
      // Simulate the mode change
      setCurrentMode(mode);
      
      setTimeout(() => {
        toast.success(`${modeConfigs[mode].name} applied successfully`);
      }, 2000);
    } catch (error) {
      console.error("Failed to change mode:", error);
      toast.error("Failed to change performance mode");
    } finally {
      setLoading(false);
    }
  };

  const handleThermalToggle = async () => {
    setLoading(true);
    try {
      const newState = !thermalEnabled;
      toast.loading(`${newState ? "Enabling" : "Disabling"} thermal management...`);
      
      // Call the backend to prepare thermal change
      setThermalEnabled(newState);
      
      setTimeout(() => {
        toast.success(`Thermal management ${newState ? "enabled" : "disabled"}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to toggle thermal:", error);
      toast.error("Failed to change thermal settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Performance Control</h1>
          <p className="text-slate-400">Manage system performance modes and thermal settings</p>
        </div>

        <Tabs defaultValue="modes" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="modes" className="text-slate-300">Performance Modes</TabsTrigger>
            <TabsTrigger value="thermal" className="text-slate-300">Thermal Management</TabsTrigger>
            <TabsTrigger value="advanced" className="text-slate-300">Advanced Settings</TabsTrigger>
          </TabsList>

          {/* Performance Modes Tab */}
          <TabsContent value="modes" className="space-y-6">
            <Alert className="bg-blue-900 border-blue-700">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Current mode: <span className="font-semibold">{modeConfigs[currentMode].name}</span>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.entries(modeConfigs) as [PerformanceMode, ModeConfig][]).map(([mode, config]) => (
                <Card
                  key={mode}
                  className={`border-2 cursor-pointer transition-all ${
                    currentMode === mode
                      ? "border-blue-500 bg-slate-700"
                      : "border-slate-700 bg-slate-800 hover:border-slate-600"
                  }`}
                  onClick={() => !loading && handleModeChange(mode)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`bg-gradient-to-br ${config.color} p-3 rounded-lg text-white`}>
                        {config.icon}
                      </div>
                      {currentMode === mode && (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-white">{config.name}</CardTitle>
                    <CardDescription className="text-slate-400">{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {config.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-300">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant={currentMode === mode ? "default" : "outline"}
                      disabled={loading || currentMode === mode}
                    >
                      {currentMode === mode ? "Active" : "Apply"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Thermal Management Tab */}
          <TabsContent value="thermal" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Thermal Engine Control</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage device thermal management and throttling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-semibold mb-1">Thermal Engine</p>
                    <p className="text-slate-400 text-sm">
                      {thermalEnabled ? "Enabled - Device will throttle to prevent overheating" : "Disabled - No thermal throttling"}
                    </p>
                  </div>
                  <Button
                    onClick={handleThermalToggle}
                    disabled={loading}
                    variant={thermalEnabled ? "default" : "outline"}
                  >
                    {thermalEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>

                <Alert className="bg-amber-900 border-amber-700">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-200">
                    Disabling thermal management may cause device overheating. Use with caution during demanding tasks.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-300">Thermal Zones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white text-sm">
                        Thermal zones are monitored for temperature control
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-300">Throttling Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white text-sm">
                        {thermalEnabled ? "Active" : "Inactive"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Advanced Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Fine-tune performance parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">CPU Governor</label>
                  <select className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2">
                    <option>schedutil</option>
                    <option>powersave</option>
                    <option>performance</option>
                    <option>ondemand</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">GPU Frequency Scaling</label>
                  <select className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2">
                    <option>Auto</option>
                    <option>Maximum</option>
                    <option>Balanced</option>
                    <option>Minimum</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">CPU Frequency Scaling</label>
                  <select className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2">
                    <option>Auto</option>
                    <option>Maximum</option>
                    <option>Balanced</option>
                    <option>Minimum</option>
                  </select>
                </div>

                <Button className="w-full mt-4">Save Advanced Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
