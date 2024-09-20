import { defineConfig } from "@pandacss/dev";
import { createPreset } from '@park-ui/panda-preset';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: ['@pandacss/preset-base', '@park-ui/panda-preset',
    createPreset({
      accentColor: 'blue',
      grayColor: 'neutral',
      borderRadius: 'sm',
    })
  ],

  // Where to look for your css declarations
  include: ["./src/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],

  // Files to exclude
  exclude: [],

  jsxFramework: 'react',



  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: "styled-system",
});
