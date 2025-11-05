// Vendor ambient declarations for versioned imports used in this repo.
// These map the odd "package@version" import specifiers to `any` so
// the TypeScript checker focuses on local application types.

// lucide icons (common icons used across the app)
declare module "lucide-react" {
  // Broad list of named icon exports used across the app. All typed as `any` to
  // allow the TypeScript checker to focus on application types. Replace with
  // accurate upstream types when available.
  export const X: any;
  export const XIcon: any;
  export const Check: any;
  export const CheckIcon: any;
  export const CheckCircle: any;
  export const XCircle: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ChevronDownIcon: any;
  export const ChevronUpIcon: any;
  export const Play: any;
  export const PlayCircle: any;
  export const Globe: any;
  export const Calendar: any;
  export const Clock: any;
  export const Upload: any;
  export const UploadIcon: any;
  export const Download: any;
  export const FileText: any;
  export const Image: any;
  export const ImageIcon: any;
  export const Video: any;
  export const Headphones: any;
  export const Users: any;
  export const User: any;
  export const UserPlus: any;
  export const LogOut: any;
  export const LogIn: any;
  export const Mail: any;
  export const Phone: any;
  export const Shield: any;
  export const Lock: any;
  export const CreditCard: any;
  export const Coins: any;
  export const Building: any;
  export const DollarSign: any;
  export const TrendingUp: any;
  export const TrendingDown: any;
  export const Target: any;
  export const Sparkles: any;
  export const Star: any;
  export const Award: any;
  export const AwardIcon: any;
  export const BarChart: any;
  export const BarChart3: any;
  export const PieChart: any;
  export const LineChart: any;
  export const CheckCheck: any;
  export const RefreshCw: any;
  export const DownloadCloud: any;
  export const MoreHorizontal: any;
  export const Search: any;
  export const Filter: any;
  export const Eye: any;
  export const ExternalLink: any;
  export const Trash2: any;
  export const Plus: any;
  export const Save: any;
  export const MessageCircle: any;
  export const Send: any;
  export const Copy: any;
  export const Loader2: any;
  export const CheckCircle2: any;
  export const AlertCircle: any;
  export const AlertTriangle: any;
  export const PanelLeftIcon: any;
  export const GripVerticalIcon: any;
  export const File: any;
  export const BookOpen: any;
  export const BookMarked: any;
  export const Zap: any;
  export const ArrowUp: any;
  export const ArrowDown: any;
  export const MessageSquare: any;
  export const Database: any;
  export const Briefcase: any;
  export const Activity: any;
  export const Bell: any;
  export const Settings: any;
  export const Unlock: any;
  export const Crown: any;
  export const Home: any;
  export const CircleIcon: any;
  export const TargetIcon: any;
  export const Check2: any;

  // Default export fallback
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
