import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  parseConfigContent,
  generateConfigContent,
  validateConfigValue,
  buildPerformanceModeConfig,
  buildZramConfig,
  buildThermalConfig,
  generateLxcoreCommand,
  generateZramCommand,
  generateThermalCommand,
  generateBusyBoxInstallScript,
  parseModuleInfo,
  formatDeviceInfo,
  MODPATH,
  CONFIG_FILE,
} from "../lxcore";

export const systemRouter = router({
  // Get real-time system metrics (client will provide the data)
  metrics: publicProcedure
    .input(
      z.object({
        cpuinfo: z.string().optional(),
        meminfo: z.string().optional(),
        cpuFreq: z.string().optional(),
        cpuGov: z.string().optional(),
        thermal: z.string().optional(),
        zramSize: z.string().optional(),
        zramStat: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => {
      // This endpoint receives metrics from the client
      // The client uses KernelSU APIs to gather this data
      return {
        success: true,
        message: "Metrics endpoint ready. Client should send /proc data.",
      };
    }),

  // Get module information
  moduleInfo: publicProcedure.query(() => {
    return {
      success: true,
      data: {
        modpath: MODPATH,
        configFile: CONFIG_FILE,
      },
    };
  }),

  // Read configuration
  readConfig: publicProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        const config = parseConfigContent(input.content);
        return {
          success: true,
          data: config,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to parse config",
        };
      }
    }),

  // Validate and prepare configuration update
  prepareConfigUpdate: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        currentContent: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        // Validate the value
        const validation = validateConfigValue(input.key, input.value);
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error,
          };
        }

        // Parse current config
        const config = parseConfigContent(input.currentContent);

        // Update or add the value
        const existingIndex = config.findIndex((c) => c.key === input.key);
        if (existingIndex >= 0) {
          config[existingIndex].value = input.value;
        } else {
          config.push({ key: input.key, value: input.value });
        }

        // Generate new content
        const newContent = generateConfigContent(config);

        return {
          success: true,
          data: {
            newContent,
            commands: [`resetprop ${input.key} ${input.value}`],
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to prepare update",
        };
      }
    }),

  // Prepare performance mode change
  preparePerformanceMode: publicProcedure
    .input(
      z.object({
        mode: z.enum(["auto", "aggressive", "high", "powersave"]),
        currentContent: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        const config = parseConfigContent(input.currentContent);
        const modeConfig = buildPerformanceModeConfig(input.mode);
        const commands = generateLxcoreCommand(input.mode);

        // Update config with mode
        for (const item of modeConfig) {
          const existingIndex = config.findIndex((c) => c.key === item.key);
          if (existingIndex >= 0) {
            config[existingIndex].value = item.value;
          } else {
            config.push(item);
          }
        }

        const newContent = generateConfigContent(config);

        return {
          success: true,
          data: {
            newContent,
            commands,
            mode: input.mode,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to prepare mode change",
        };
      }
    }),

  // Prepare ZRAM size change
  prepareZramSize: publicProcedure
    .input(
      z.object({
        size: z.string(),
        currentContent: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        const config = parseConfigContent(input.currentContent);
        const zramConfig = buildZramConfig(input.size);
        const command = generateZramCommand(input.size);

        // Update config with ZRAM size
        for (const item of zramConfig) {
          const existingIndex = config.findIndex((c) => c.key === item.key);
          if (existingIndex >= 0) {
            config[existingIndex].value = item.value;
          } else {
            config.push(item);
          }
        }

        const newContent = generateConfigContent(config);

        return {
          success: true,
          data: {
            newContent,
            command,
            size: input.size,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to prepare ZRAM change",
        };
      }
    }),

  // Prepare thermal mode change
  prepareThermalMode: publicProcedure
    .input(
      z.object({
        enabled: z.boolean(),
        currentContent: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        const config = parseConfigContent(input.currentContent);
        const thermalConfig = buildThermalConfig(input.enabled);
        const commands = generateThermalCommand(input.enabled);

        // Update config with thermal mode
        for (const item of thermalConfig) {
          const existingIndex = config.findIndex((c) => c.key === item.key);
          if (existingIndex >= 0) {
            config[existingIndex].value = item.value;
          } else {
            config.push(item);
          }
        }

        const newContent = generateConfigContent(config);

        return {
          success: true,
          data: {
            newContent,
            commands,
            enabled: input.enabled,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to prepare thermal change",
        };
      }
    }),

  // Get BusyBox installation script
  getBusyBoxScript: publicProcedure.query(async () => {
    try {
      const script = generateBusyBoxInstallScript();
      return {
        success: true,
        data: {
          script,
          description: "Script to install BusyBox from KSU or Magisk",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate script",
      };
    }
  }),

  // Parse module information
  parseModuleInfo: publicProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .query(({ input }) => {
      try {
        const info = parseModuleInfo(input.content);
        return {
          success: true,
          data: info,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to parse module info",
        };
      }
    }),

  // Format device information
  formatDeviceInfo: publicProcedure
    .input(
      z.object({
        props: z.record(z.string(), z.string()),
      })
    )
    .query(({ input }) => {
      try {
        const formatted = formatDeviceInfo(input.props as Record<string, string>);
        return {
          success: true,
          data: formatted,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to format device info",
        };
      }
    }),
});
