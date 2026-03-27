import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Target, 
  Zap, 
  Settings, 
  History, 
  ChevronRight, 
  Search, 
  Cpu, 
  Gauge,
  Battery,
  Layers, 
  MousePointer2,
  Trophy,
  Info,
  CheckCircle2,
  Copy,
  Save,
  RefreshCw,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { BRANDS, POPULAR_DEVICES, PLAY_STYLES, AIM_TYPES, FOCUS_MODES, DEVICE_FEELS, CONTROL_TYPES, AIM_PROBLEMS, DRAG_RESPONSE, SCOPE_STABILITY } from './constants';
import { DeviceSpecs, UserPreferences, OptimizationResult } from './types';
import { calculateSensitivity, detectDevice } from './engine';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const variants: any = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700',
    outline: 'bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-600/10',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', title = '' }: any) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm ${className}`}>
    {title && <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-4">{title}</h3>}
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
    />
  </div>
);

const SelectField = ({ label, options, value, onChange, labels = {} }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            value === opt 
              ? 'bg-red-600/20 border-red-600 text-red-500' 
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
          }`}
        >
          {labels[opt] || opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, ' ')}
        </button>
      ))}
    </div>
  </div>
);

// --- Screens ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 bg-red-600 rounded-3xl rotate-45 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
          <Target className="-rotate-45 text-white w-16 h-16" />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-600 rounded-3xl rotate-45 blur-2xl -z-10"
        />
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12 text-center"
      >
        <h1 className="text-3xl font-black text-white tracking-tighter italic">
          BRAZILIAN <span className="text-red-600">FF</span> SENS PRO
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-widest mt-2 uppercase">
          Device-Based Sensitivity Engine
        </p>
      </motion.div>

      <div className="absolute bottom-12 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
        />
      </div>
    </div>
  );
};

const HomeScreen = ({ onStart, onAutoDetect }: { onStart: () => void, onAutoDetect: () => void }) => {
  const [activeTab, setActiveTab] = useState<'optimize' | 'history' | 'training' | 'presets' | 'booster'>('optimize');
  const [selectedGuide, setSelectedGuide] = useState<{title: string, content: string} | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('ff_sens_history') || '[]');
    setHistory(savedHistory);
  }, [activeTab]);

  const clearHistory = () => {
    localStorage.removeItem('ff_sens_history');
    setHistory([]);
  };

  const guides = [
    { 
      title: 'M1887 One Tap', 
      content: 'To master the M1887 one-tap, keep your crosshair slightly below the enemy\'s feet and perform a quick "J" drag upwards. Ensure your General sensitivity is above 95 for maximum flick speed.' 
    },
    { 
      title: 'Desert Eagle Drag', 
      content: 'For Desert Eagle, wait for the enemy to stand still. Use a straight vertical drag. Your Red Dot sensitivity should be around 90-92 for the best lock-on.' 
    },
    { 
      title: 'MP40 Spray', 
      content: 'Control the MP40 recoil by dragging down slightly after the first 5 bullets. High General sensitivity (98+) helps in close-range tracking.' 
    }
  ];

  return (
    <div className="h-full bg-black text-white flex flex-col relative">
      <header className="p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter">
              {activeTab === 'optimize' && 'DASHBOARD'}
              {activeTab === 'history' && 'HISTORY'}
              {activeTab === 'training' && 'TRAINING'}
              {activeTab === 'presets' && 'PRESETS'}
              {activeTab === 'booster' && 'BOOSTER'}
            </h2>
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Brazilian Pro Edition</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Settings className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
        {activeTab === 'optimize' && (
          <>
            <Card className="bg-gradient-to-br from-red-600/20 to-transparent border-red-600/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black italic">OPTIMIZE NOW</h3>
                  <p className="text-zinc-400 text-sm">Generate pro-level sensitivity for your specific device.</p>
                </div>
                <Zap className="text-red-500 w-8 h-8" />
              </div>
              <div className="space-y-3">
                <Button onClick={onAutoDetect} className="w-full">
                  AUTO-DETECT DEVICE <RefreshCw className="w-5 h-5" />
                </Button>
                <Button onClick={onStart} variant="secondary" className="w-full">
                  MANUAL SETUP <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center text-center py-6">
                <Target className="text-red-500 w-8 h-8 mb-2" />
                <span className="text-xs font-bold text-zinc-500 uppercase">Headshot Mode</span>
                <span className="text-sm font-black text-white">ACTIVE</span>
              </Card>
              <Card className="flex flex-col items-center text-center py-6">
                <MousePointer2 className="text-blue-500 w-8 h-8 mb-2" />
                <span className="text-xs font-bold text-zinc-500 uppercase">No Gyro Mode</span>
                <span className="text-sm font-black text-white">READY</span>
              </Card>
            </div>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Popular Presets</h3>
                <button onClick={() => setActiveTab('presets')} className="text-xs text-red-500 font-bold uppercase">View All</button>
              </div>
              <div className="space-y-3">
                {POPULAR_DEVICES.map((device, i) => (
                  <div key={i} className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{device.brand} {device.model}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{device.ram}GB RAM • {device.refreshRate}Hz</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length > 0 ? (
              <>
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedGuide({ 
                      title: item.device, 
                      content: `Optimization results from ${item.date} at ${item.time}. Tier ${item.tier} performance detected. Settings applied: General ${item.settings.general}, Red Dot ${item.settings.redDot}, DPI ${item.settings.dpi}.` 
                    })}
                    className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <History className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.device}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{item.date} • {item.time} • TIER {item.tier}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                ))}
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => setActiveTab('optimize')} variant="outline" className="flex-1">
                    NEW OPTIMIZATION
                  </Button>
                  <Button onClick={clearHistory} variant="ghost" className="flex-1 text-zinc-500 hover:text-red-500">
                    CLEAR ALL
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                  <History className="w-8 h-8 text-zinc-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">No History Yet</h3>
                  <p className="text-zinc-500 text-sm">Your optimized settings will appear here.</p>
                </div>
                <Button onClick={() => setActiveTab('optimize')} variant="outline" className="mt-4">
                  START OPTIMIZING
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            <Card title="Daily Drill">
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedGuide({ title: 'Drag Headshot Master', content: 'Practice your vertical drag speed in the training grounds. Aim for the head and pull up quickly. Repeat 50 times with different weapons.' })}
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold">Drag Headshot Master</h4>
                  <p className="text-xs text-zinc-500">Practice for 10 mins daily</p>
                </div>
              </div>
            </Card>
            <Card title="Weapon Guides">
              <div className="space-y-3">
                {guides.map((guide, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                  >
                    <span className="text-sm font-bold">{guide.title}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search device presets..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {POPULAR_DEVICES.map((device, i) => (
                <Card key={i} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-bold text-sm">{device.brand} {device.model}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">{device.ram}GB RAM</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="px-3 py-1 text-[10px]"
                    onClick={() => setSelectedGuide({ title: 'Preset Applied', content: `The optimized settings for ${device.brand} ${device.model} have been loaded into your dashboard. You can now fine-tune them in the Optimize tab.` })}
                  >
                    APPLY
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'booster' && (
          <div className="space-y-6">
            <Card title="System Optimization">
              <div className="space-y-4">
                {[
                  { icon: <Smartphone className="w-5 h-5 text-blue-500" />, title: 'Clear RAM', desc: 'Close all background apps like WhatsApp/Instagram before playing.' },
                  { icon: <Battery className="w-5 h-5 text-green-500" />, title: 'Battery Mode', desc: 'Disable Battery Saver. Use "Performance Mode" in system settings.' },
                  { icon: <Cpu className="w-5 h-5 text-purple-500" />, title: 'Game Turbo', desc: 'Enable built-in Game Booster/Turbo for CPU prioritization.' }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
                    <div className="mt-1">{tip.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold">{tip.title}</h4>
                      <p className="text-[10px] text-zinc-500 leading-tight">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="In-Game Graphics">
              <div className="space-y-3">
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl">
                  <h4 className="text-xs font-black italic text-red-500 mb-2 uppercase tracking-widest">Pro Recommendation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-400">Graphics</span>
                      <span className="text-white">SMOOTH</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-400">High FPS</span>
                      <span className="text-white">HIGH (60+)</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-400">Shadows</span>
                      <span className="text-white">OFF</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-3 italic leading-tight">
                    *Lowering graphics reduces input lag, making your sensitivity feel much smoother and more responsive for headshots.
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Network Stability">
              <div 
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg cursor-pointer"
                onClick={() => setSelectedGuide({ title: 'Ping Optimization', content: '1. Use 5GHz Wi-Fi if possible. 2. Disable Auto-Sync in Google account settings. 3. Turn off Bluetooth while playing to avoid interference with 2.4GHz Wi-Fi.' })}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold uppercase">Fix High Ping</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            </Card>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-4 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('optimize')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'optimize' ? 'text-red-500' : 'text-zinc-500'}`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase">Optimize</span>
        </button>
        <button 
          onClick={() => setActiveTab('booster')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'booster' ? 'text-red-500' : 'text-zinc-500'}`}
        >
          <Gauge className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase">Booster</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-red-500' : 'text-zinc-500'}`}
        >
          <History className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('training')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'training' ? 'text-red-500' : 'text-zinc-500'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase">Training</span>
        </button>
        <button 
          onClick={() => setActiveTab('presets')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'presets' ? 'text-red-500' : 'text-zinc-500'}`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase">Presets</span>
        </button>
      </nav>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-sm relative"
            >
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 rotate-180 text-zinc-400" />
              </button>
              <h3 className="text-2xl font-black italic text-red-500 mb-4 uppercase tracking-tighter">{selectedGuide.title}</h3>
              <div className="h-1 w-12 bg-red-600 mb-6 rounded-full" />
              <p className="text-zinc-300 leading-relaxed text-sm font-medium">
                {selectedGuide.content}
              </p>
              <Button onClick={() => setSelectedGuide(null)} className="w-full mt-8">
                GOT IT
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputScreen = ({ onNext, onBack, initialSpecs }: { onNext: (specs: DeviceSpecs) => void, onBack: () => void, initialSpecs?: Partial<DeviceSpecs> }) => {
  const [specs, setSpecs] = useState<DeviceSpecs>({
    brand: initialSpecs?.brand || 'Redmi',
    model: initialSpecs?.model || '',
    ram: initialSpecs?.ram || 8,
    refreshRate: initialSpecs?.refreshRate || 60,
    processor: initialSpecs?.processor || '',
    gyroscope: initialSpecs?.gyroscope || false,
    screenSize: initialSpecs?.screenSize || '6.67"'
  });

  useEffect(() => {
    if (initialSpecs) {
      setSpecs(prev => ({
        ...prev,
        ...initialSpecs
      }));
    }
  }, [initialSpecs]);

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <header className="flex items-center gap-4 p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 rotate-180 text-zinc-400" />
        </button>
        <div>
          <h2 className="text-xl font-black italic tracking-tighter">DEVICE SPECS</h2>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Step 1 of 2</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        <Card title="Brand & Model">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Select Brand</label>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {BRANDS.map(b => (
                  <button 
                    key={b}
                    onClick={() => setSpecs({...specs, brand: b})}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap border transition-all ${
                      specs.brand === b ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Model Name" value={specs.model} onChange={(v: string) => setSpecs({...specs, model: v})} placeholder="e.g. Note 14 5G" />
          </div>
        </Card>

        <Card title="Hardware Performance">
          <div className="space-y-4">
            <SelectField 
              label="RAM Size" 
              options={['4', '6', '8', '12', '16']} 
              value={specs.ram.toString()} 
              onChange={(v: string) => setSpecs({...specs, ram: parseInt(v)})} 
            />
            <SelectField 
              label="Refresh Rate" 
              options={['60', '90', '120', '144']} 
              value={specs.refreshRate.toString()} 
              onChange={(v: string) => setSpecs({...specs, refreshRate: parseInt(v)})} 
            />
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold">Gyroscope Sensor</span>
              </div>
              <button 
                onClick={() => setSpecs({...specs, gyroscope: !specs.gyroscope})}
                className={`w-12 h-6 rounded-full transition-colors relative ${specs.gyroscope ? 'bg-red-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${specs.gyroscope ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </Card>

        <Button 
          onClick={() => onNext(specs)} 
          className="w-full py-4 mb-6"
          variant={specs.model ? 'primary' : 'secondary'}
          disabled={!specs.model}
        >
          CONTINUE <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const QuestionnaireScreen = ({ onFinish, onBack }: { onFinish: (prefs: UserPreferences) => void, onBack: () => void }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    playStyle: 'balanced',
    aimType: 'drag',
    focus: 'headshots',
    deviceFeel: 'smooth',
    controls: 'thumb',
    aimProblem: 'none',
    dragResponse: 'perfect',
    scopeStability: 'perfect'
  });

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <header className="flex items-center gap-4 p-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 rotate-180 text-zinc-400" />
        </button>
        <div>
          <h2 className="text-xl font-black italic tracking-tighter">PLAY STYLE</h2>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Step 2 of 2</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        <Card title="Gameplay Preferences">
          <div className="space-y-6">
            <SelectField label="Play Style" options={PLAY_STYLES} value={prefs.playStyle} onChange={(v: any) => setPrefs({...prefs, playStyle: v})} />
            <SelectField label="Aim Method" options={AIM_TYPES} value={prefs.aimType} onChange={(v: any) => setPrefs({...prefs, aimType: v})} />
            <SelectField label="Priority" options={FOCUS_MODES} value={prefs.focus} onChange={(v: any) => setPrefs({...prefs, focus: v})} />
            <SelectField label="Device Smoothness" options={DEVICE_FEELS} value={prefs.deviceFeel} onChange={(v: any) => setPrefs({...prefs, deviceFeel: v})} />
            <SelectField label="Control Type" options={CONTROL_TYPES} value={prefs.controls} onChange={(v: any) => setPrefs({...prefs, controls: v})} />
            <SelectField 
              label="Aiming Problem" 
              options={AIM_PROBLEMS} 
              value={prefs.aimProblem || 'none'} 
              onChange={(v: any) => setPrefs({...prefs, aimProblem: v})} 
              labels={{
                'none': 'None',
                'crosshair-too-high': 'Crosshair too high?',
                'drag-too-hard': 'Drag too hard?',
                'overshooting': 'Overshooting?',
                'weak-headshot-pull': 'Weak headshot pull?',
                'shaky-red-dot': 'Shaky Red Dot?',
                'stiff-movement': 'Stiff Movement?'
              }}
            />
            <SelectField 
              label="Drag Response" 
              options={DRAG_RESPONSE} 
              value={prefs.dragResponse} 
              onChange={(v: any) => setPrefs({...prefs, dragResponse: v})} 
              labels={{
                'perfect': 'Perfect Response',
                'slow': 'Feels Slow/Heavy',
                'fast': 'Feels Too Fast'
              }}
            />
            <SelectField 
              label="Scope Stability" 
              options={SCOPE_STABILITY} 
              value={prefs.scopeStability} 
              onChange={(v: any) => setPrefs({...prefs, scopeStability: v})} 
              labels={{
                'perfect': 'Steady/Perfect',
                'shaking': 'Shaking/Unstable',
                'stiff': 'Too Stiff/Hard to move'
              }}
            />
          </div>
        </Card>

        <Button onClick={() => onFinish(prefs)} className="w-full py-4 mb-6">
          GENERATE OPTIMIZATION <Zap className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const HudPreview = ({ buttons }: { buttons: any[] }) => {
  return (
    <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mb-6">
      {/* Visual representation of a phone screen */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full border-2 border-zinc-700 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-zinc-700 rounded-full"></div>
      </div>
      
      {/* Button Indicators */}
      {buttons.map((btn, i) => {
        let style: any = {};
        const pos = btn.position.toLowerCase();
        
        if (pos.includes('bottom right')) {
          style = { bottom: '15%', right: '15%' };
          if (pos.includes('lower')) style.bottom = '8%';
          if (pos.includes('near fire')) { style.bottom = '20%'; style.right = '25%'; }
        }
        else if (pos.includes('top right')) {
          style = { top: '15%', right: '15%' };
          if (pos.includes('inner')) style.right = '25%';
        }
        else if (pos.includes('top left')) {
          style = { top: '15%', left: '15%' };
          if (pos.includes('inner')) style.left = '25%';
          if (pos.includes('near gloo')) { style.top = '25%'; style.left = '15%'; }
        }
        else if (pos.includes('bottom left')) {
          style = { bottom: '15%', left: '15%' };
        }
        else if (pos.includes('left center')) {
          style = { top: '50%', left: '10%', transform: 'translateY(-50%)' };
        }
        else if (pos.includes('right center')) {
          style = { top: '50%', right: '10%', transform: 'translateY(-50%)' };
          if (pos.includes('above fire')) { style.top = '35%'; style.right = '15%'; }
        }
        else if (pos.includes('top center')) {
          style = { top: '10%', left: '50%', transform: 'translateX(-50%)' };
        }
        else if (pos.includes('bottom center')) {
          style = { bottom: '10%', left: '50%', transform: 'translateX(-50%)' };
        }
        
        return (
          <motion.div 
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="absolute flex flex-col items-center"
            style={style}
          >
            <div className="w-8 h-8 rounded-full bg-red-600/40 border border-red-500/60 flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              <span className="text-[8px] font-black text-white">{btn.size}</span>
            </div>
            <span className="text-[6px] font-bold text-zinc-500 uppercase mt-1 whitespace-nowrap">{btn.name}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const ResultScreen = ({ result, specs, onReset }: { result: OptimizationResult, specs: DeviceSpecs, onReset: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    const text = `
Brazilian FF Sensitivity Pro Results:
Device: ${specs.brand} ${specs.model}
Tier: ${result.deviceTier} (${result.performanceType})
DPI: ${result.settings.dpi}
General: ${result.settings.general}
Red Dot: ${result.settings.redDot}
2x Scope: ${result.settings.scope2x}
4x Scope: ${result.settings.scope4x}
Sniper: ${result.settings.sniper}
Free Look: ${result.settings.freeLook}
${result.settings.gyro ? `Gyro: ${result.settings.gyro}` : ''}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    try {
      const history = JSON.parse(localStorage.getItem('ff_sens_history') || '[]');
      const newItem = {
        id: Date.now(),
        device: `${specs.brand} ${specs.model}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tier: result.deviceTier,
        settings: result.settings,
        hud: result.hudRecommendation
      };
      localStorage.setItem('ff_sens_history', JSON.stringify([newItem, ...history]));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter">OPTIMIZED!</h2>
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Results for {specs.model}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          result.deviceTier === 'A' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
        }`}>
          TIER {result.deviceTier}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        <Card className="relative overflow-hidden border-red-600/50 bg-gradient-to-b from-red-600/10 to-transparent">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24" />
          </div>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recommended DPI</p>
              <p className="text-3xl font-black italic text-red-500">{result.settings.dpi}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">General</p>
              <p className="text-3xl font-black italic">{result.settings.general}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800">
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Red Dot</p>
              <p className="text-xl font-black italic">{result.settings.redDot}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">2x Scope</p>
              <p className="text-xl font-black italic">{result.settings.scope2x}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">4x Scope</p>
              <p className="text-xl font-black italic">{result.settings.scope4x}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Sniper</p>
              <p className="text-xl font-black italic">{result.settings.sniper}</p>
            </div>
            <div className="text-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Free Look</p>
              <p className="text-xl font-black italic">{result.settings.freeLook}</p>
            </div>
          </div>

          {result.settings.gyro && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600/30 rounded-xl flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest">Gyroscope Sensitivity</span>
              <span className="text-xl font-black italic text-red-500">{result.settings.gyro}</span>
            </div>
          )}
        </Card>

        <Card title="AI Coach Advice" className="border-l-4 border-l-red-600">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center">
              <Info className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {result.coachAdvice}
            </p>
          </div>
        </Card>

        <Card title={`Recommended HUD: ${result.hudRecommendation.layout}`}>
          <HudPreview buttons={result.hudRecommendation.buttons} />
          <div className="grid grid-cols-2 gap-4">
            {result.hudRecommendation.buttons.map((btn, i) => (
              <div key={i} className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">{btn.name}</p>
                  <span className="text-[9px] text-red-500 font-black">{btn.size}</span>
                </div>
                <p className="text-[9px] text-zinc-400 uppercase font-medium mb-2">{btn.position}</p>
                <p className="text-[8px] text-zinc-500 leading-tight italic">{btn.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pro Training Plan">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Best Weapon Type</p>
                <p className="text-sm font-black italic text-white">{result.trainingPlan.weapon}</p>
                <p className="text-[9px] text-zinc-500 mt-1">Optimized for your current sensitivity and playstyle.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Gauge className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">5-Minute Training Drill</p>
                <p className="text-sm font-bold text-zinc-200 leading-tight">{result.trainingPlan.drill}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-red-600/5 border border-red-600/20 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Red Dot Practice Plan</p>
                <p className="text-sm font-bold text-zinc-200 leading-tight">{result.trainingPlan.practice}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleCopy} variant="secondary" className="flex-1">
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            {copied ? 'COPIED' : 'COPY'}
          </Button>
          <Button onClick={handleSave} variant="secondary" className="flex-1">
            {saved ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Save className="w-5 h-5" />}
            {saved ? 'SAVED' : 'SAVE'}
          </Button>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full mb-6">
          OPTIMIZE ANOTHER DEVICE
        </Button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'home' | 'input' | 'questions' | 'result'>('splash');
  const [specs, setSpecs] = useState<DeviceSpecs | null>(null);
  const [initialSpecs, setInitialSpecs] = useState<Partial<DeviceSpecs> | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [detecting, setDetecting] = useState(false);

  const handleStart = () => {
    setInitialSpecs(null);
    setScreen('input');
  };

  const handleAutoDetect = async () => {
    setDetecting(true);
    try {
      const detected = await detectDevice();
      setInitialSpecs(detected);
      setScreen('input');
    } catch (error) {
      console.error("Detection failed", error);
    } finally {
      setDetecting(false);
    }
  };

  const handleSpecsNext = (newSpecs: DeviceSpecs) => {
    setSpecs(newSpecs);
    setScreen('questions');
  };
  const handlePrefsFinish = (prefs: UserPreferences) => {
    if (specs) {
      const res = calculateSensitivity(specs, prefs);
      setResult(res);
      setScreen('result');
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-black overflow-hidden relative shadow-2xl">
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div key="splash" exit={{ opacity: 0 }} className="h-full">
            <SplashScreen onFinish={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div 
            key="home" 
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <HomeScreen onStart={handleStart} onAutoDetect={handleAutoDetect} />
          </motion.div>
        )}

        {screen === 'input' && (
          <motion.div 
            key="input" 
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <InputScreen 
              onNext={handleSpecsNext} 
              onBack={() => setScreen('home')} 
              initialSpecs={initialSpecs || undefined} 
            />
          </motion.div>
        )}

        {screen === 'questions' && (
          <motion.div 
            key="questions" 
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <QuestionnaireScreen onFinish={handlePrefsFinish} onBack={() => setScreen('input')} />
          </motion.div>
        )}

        {screen === 'result' && result && specs && (
          <motion.div 
            key="result" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <ResultScreen result={result} specs={specs} onReset={() => setScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      {detecting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mb-4"
          />
          <p className="text-white font-black italic tracking-widest animate-pulse">DETECTING HARDWARE...</p>
        </div>
      )}
    </div>
  );
}
