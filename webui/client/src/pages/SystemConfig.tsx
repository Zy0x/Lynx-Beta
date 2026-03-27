import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, HardDrive, Zap, Wrench } from "lucide-react";
import { toast } from "sonner";

const ZRAM_SIZES = [
  { label: "Default", value: "default" },
  { label: "Disable", value: "disable" },
  { label: "1GB", value: "1024M" },
  { label: "1.5GB", value: "1536M" },
  { label: "2GB", value: "2048M" },
  { label: "2.5GB", value: "2560M" },
  { label: "3GB", value: "3072M" },
  { label: "4GB", value: "4096M" },
  { label: "5GB", value: "5120M" },
  { label: "6GB", value: "6144M" },
];

export default function SystemConfig() {
  const [zramSize, setZramSize] = useState("2048M");
  const [chargeLimit, setChargeLimit] = useState(80);
  const [flowControl, setFlowControl] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleZramChange = async (size: string) => {
    setLoading(true);
    try {
      toast.loading(`Setting ZRAM to ${size}...`);
      setZramSize(size);
      
      setTimeout(() => {
        toast.success(`ZRAM set to ${size}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to set ZRAM:", error);
      toast.error("Failed to set ZRAM size");
    } finally {
      setLoading(false);
    }
  };

  const handleChargeLimitChange = async () => {
    setLoading(true);
    try {
      toast.loading(`Setting charge limit to ${chargeLimit}%...`);
      
      setTimeout(() => {
        toast.success(`Charge limit set to ${chargeLimit}%`);
      }, 1500);
    } catch (error) {
      console.error("Failed to set charge limit:", error);
      toast.error("Failed to set charge limit");
    } finally {
      setLoading(false);
    }
  };

  const handleFlowToggle = async () => {
    setLoading(true);
    try {
      const newState = !flowControl;
      toast.loading(`${newState ? "Enabling" : "Disabling"} flow control...`);
      
      setFlowControl(newState);
      
      setTimeout(() => {
        toast.success(`Flow control ${newState ? "enabled" : "disabled"}`);
      }, 1500);
    } catch (error) {
      console.error("Failed to toggle flow control:", error);
      toast.error("Failed to change flow control");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">System Configuration</h1>
          <p className="text-slate-400">Manage ZRAM, charging, and other system settings</p>
        </div>

        <Tabs defaultValue="zram" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="zram" className="text-slate-300">ZRAM Management</TabsTrigger>
            <TabsTrigger value="charging" className="text-slate-300">Charging Control</TabsTrigger>
            <TabsTrigger value="flow" className="text-slate-300">Flow Control</TabsTrigger>
          </TabsList>

          {/* ZRAM Management Tab */}
          <TabsContent value="zram" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  ZRAM Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Compressed RAM for improved performance and memory management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-900 border-blue-700">
                  <AlertCircle className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Current ZRAM size: <span className="font-semibold">{zramSize}</span>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-white font-medium">Select ZRAM Size:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {ZRAM_SIZES.map((size) => (
                      <Button
                        key={size.value}
                        variant={zramSize === size.value ? "default" : "outline"}
                        onClick={() => handleZramChange(size.value)}
                        disabled={loading}
                        className={`${
                          zramSize === size.value
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        }`}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">ZRAM Benefits:</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Reduces physical RAM pressure</li>
                    <li>• Improves app switching performance</li>
                    <li>• Extends device lifespan</li>
                    <li>• Minimal performance impact</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charging Control Tab */}
          <TabsContent value="charging" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Charging Control
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage battery charging limits and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-green-900 border-green-700">
                  <AlertCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-200">
                    Charge limit: <span className="font-semibold">{chargeLimit}%</span> - Extends battery lifespan
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <label className="text-white font-medium">Maximum Charge Level</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={chargeLimit}
                      onChange={(e) => setChargeLimit(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-white font-semibold min-w-12">{chargeLimit}%</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Limiting charge to 80% can extend battery health significantly
                  </p>
                </div>

                <Button
                  onClick={handleChargeLimitChange}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Charge Limit
                </Button>

                <div className="bg-slate-700 p-4 rounded-lg space-y-2">
                  <h4 className="text-white font-semibold">Recommended Settings:</h4>
                  <div className="text-slate-300 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Daily use:</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heavy use:</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum capacity:</span>
                      <span className="font-medium">100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flow Control Tab */}
          <TabsContent value="flow" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Flow Control
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Advanced RAM and I/O flow management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className={`${
                  flowControl
                    ? "bg-blue-900 border-blue-700"
                    : "bg-slate-700 border-slate-600"
                }`}>
                  <AlertCircle className={`h-4 w-4 ${
                    flowControl ? "text-blue-400" : "text-slate-400"
                  }`} />
                  <AlertDescription className={flowControl ? "text-blue-200" : "text-slate-300"}>
                    Flow Control is currently <span className="font-semibold">{flowControl ? "Enabled" : "Disabled"}</span>
                  </AlertDescription>
                </Alert>

                <div className="bg-slate-700 p-4 rounded-lg space-y-3">
                  <h4 className="text-white font-semibold">Flow Control Features:</h4>
                  <ul className="text-slate-300 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Advanced RAM management and optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>I/O scheduling optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Memory pressure handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Process priority management</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-300">Basic Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-3">Standard flow control</p>
                      <Button variant="outline" className="w-full">Select</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-slate-300">Advanced Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-3">Enhanced optimization</p>
                      <Button variant="outline" className="w-full">Select</Button>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  onClick={handleFlowToggle}
                  disabled={loading}
                  variant={flowControl ? "default" : "outline"}
                  className="w-full"
                >
                  {flowControl ? "Disable Flow Control" : "Enable Flow Control"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
