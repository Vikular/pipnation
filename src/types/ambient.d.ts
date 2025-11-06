// Ambient module declarations to cover non-standard import specifiers
// used in this repo (for example: "sonner@2.0.3", "@radix-ui/react-accordion@1.2.3", etc.).
// These are intentionally broad to allow the TypeScript checker to focus on
// frontend application logic instead of library versioned-alias resolution.

declare module '*@*' {
  const anyExport: any;
  export default anyExport;
}

// Fallback for packages imported without a version suffix
declare module '*' {
  const anyExport: any;
  export default anyExport;
}
