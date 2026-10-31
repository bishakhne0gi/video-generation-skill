// Author: Bishakh
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
// Kling clips are H.264; OffthreadVideo decodes them frame-accurately.
Config.setChromiumOpenGlRenderer("angle");
