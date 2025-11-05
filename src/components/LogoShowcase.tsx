import { Logo } from './Logo';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3 bg-gradient-to-r from-[#d9a55d] via-[#f0b968] to-[#d9a55d] bg-clip-text text-transparent">
            Pip Nation Academy Logo
          </h1>
          <p className="text-gray-600">
            Professional, animated logo system with multiple variants
          </p>
        </div>

        {/* Default Logo - Light Background */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Default Logo - Light Background</CardTitle>
          </CardHeader>
          <CardContent className="p-12 bg-white flex items-center justify-center">
            <Logo variant="default" animated={true} />
          </CardContent>
        </Card>

        {/* Default Logo - Dark Background */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Default Logo - Dark Background (Navigation)</CardTitle>
          </CardHeader>
          <CardContent className="p-12 bg-gradient-to-r from-[#030213] via-[#0a0520] to-[#030213] flex items-center justify-center">
            <Logo variant="default" animated={true} />
          </CardContent>
        </Card>

        {/* Compact Logo */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Compact Logo - For Headers & Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Light background */}
            <div className="p-8 bg-white flex items-center justify-center border rounded-lg">
              <Logo variant="compact" animated={true} />
            </div>
            
            {/* Dark background */}
            <div className="p-8 bg-gradient-to-r from-[#030213] to-[#0a0520] flex items-center justify-center rounded-lg">
              <Logo variant="compact" animated={true} />
            </div>
          </CardContent>
        </Card>

        {/* Icon Only */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Icon Only - For Mobile & Favicons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Light background */}
            <div className="p-8 bg-white flex items-center justify-center border rounded-lg">
              <Logo variant="icon-only" animated={true} />
            </div>
            
            {/* Dark background */}
            <div className="p-8 bg-gradient-to-r from-[#030213] to-[#0a0520] flex items-center justify-center rounded-lg">
              <Logo variant="icon-only" animated={true} />
            </div>
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Responsive Sizing</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8 bg-gradient-to-br from-white to-gray-50">
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-600">Small</div>
                <Logo variant="compact" animated={false} className="scale-75" />
              </div>
              
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-600">Medium</div>
                <Logo variant="compact" animated={false} />
              </div>
              
              <div className="text-center">
                <div className="mb-2 text-sm text-gray-600">Large</div>
                <Logo variant="default" animated={false} className="scale-125" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Demo */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle>Animation Features</CardTitle>
          </CardHeader>
          <CardContent className="p-12 bg-gradient-to-br from-[#030213] via-[#0a0520] to-[#030213]">
            <div className="space-y-6">
              <div className="text-center text-white mb-8">
                <p className="text-sm opacity-70">Hover over the logo to see animations</p>
              </div>
              <div className="flex items-center justify-center">
                <Logo variant="default" animated={true} />
              </div>
              <div className="mt-8 text-center">
                <div className="inline-block text-left text-sm text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#d9a55d]"></div>
                    <span>Entrance animation on load</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f0b968]"></div>
                    <span>Pulsing glow effect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#d9a55d]"></div>
                    <span>Animated gradient text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f0b968]"></div>
                    <span>Hover scale and rotation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Principles */}
        <Card className="overflow-hidden border-2 border-[#d9a55d]/20">
          <CardHeader className="bg-gradient-to-r from-[#d9a55d]/10 to-[#f0b968]/10">
            <CardTitle className="text-[#030213]">Design Principles Applied</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Color Harmony
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Gold (#d9a55d) gradient represents wealth and success in forex trading. 
                  Navy (#030213) conveys professionalism and trust.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Balance & Alignment
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Shield icon and text are perfectly aligned on horizontal axis. 
                  Proper spacing creates visual breathing room.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Typography
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Bold, uppercase "PIPS NATION" with letter spacing for impact. 
                  Lighter "ACADEMY" provides hierarchy.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Animation & Motion
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Smooth entrance animations, pulsing glow, and hover effects 
                  create engagement without distraction.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Scalability
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Three variants (default, compact, icon-only) ensure the logo 
                  works at any size and context.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#030213] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d9a55d]"></span>
                  Responsiveness
                </h3>
                <p className="text-sm text-gray-600 ml-4">
                  Fluid sizing using clamp() ensures perfect display on mobile, 
                  tablet, and desktop screens.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specs */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-[#030213]">Colors</h4>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#d9a55d] border"></div>
                    <code className="text-xs">#d9a55d</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#f0b968] border"></div>
                    <code className="text-xs">#f0b968</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#c49353] border"></div>
                    <code className="text-xs">#c49353</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#030213] border"></div>
                    <code className="text-xs">#030213</code>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#030213]">Animations</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Entrance: 0.6s ease</li>
                  <li>• Icon: Spring animation</li>
                  <li>• Glow: 3s infinite pulse</li>
                  <li>• Hover: 0.3s scale/rotate</li>
                  <li>• Gradient: 4s shift</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-[#030213]">Variants</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>default</strong>: Full logo</li>
                  <li>• <strong>compact</strong>: Name only</li>
                  <li>• <strong>icon-only</strong>: Shield</li>
                  <li>• <strong>animated</strong>: true/false</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
