import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "6u680gce",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  studioHost: "madavi-studio",
  deployment: {
    appId: "duh0wa9us1z8a4ufjhsfn9xq",
  },
});
