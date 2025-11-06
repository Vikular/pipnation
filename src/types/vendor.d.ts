// Vendor ambient declarations for versioned imports used in this repo.
// These map the odd "package@version" import specifiers to `any` so
// the TypeScript checker focuses on local application types.

// Icons that still need ambient declarations (if any)
// Most icons should now resolve from the lucide-react package
declare module "lucide-react" {
  const _default: any;
  export default _default;
}

// Radix primitives that still need ambient declarations
// Keep these until all imports are verified clean
declare module "@radix-ui/react-slot@1.1.2" { export const Slot: any; const _default: any; export default _default; }
declare module "@radix-ui/react-dialog@1.1.6" { const _: any; export = _; }
declare module "@radix-ui/react-select@2.1.6" { const _: any; export = _; }

// Fallback for other versioned imports not explicitly listed
declare module "*@*" { const _: any; export = _; }
