import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ShieldCheck,
  Globe,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { CustomTheme } from '../types';

interface APKVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTheme: CustomTheme;
  onSwitchToBrowser: () => void;
  onDownloadApkFile: () => void;
  isInstallable: boolean;
  onInstallPwa: () => void;
}

export const APKVersionModal: React.FC<APKVersionModalProps> = ({
  isOpen,
  onClose,
  customTheme,
  onSwitchToBrowser,
  onDownloadApkFile,
  isInstallable,
  onInstallPwa,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'download' | 'troubleshoot'>('install');
  const [showManualGuide, setShowManualGuide] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstallClick = async () => {
    if (isInstallable) {
      onInstallPwa();
    } else {
      setShowManualGuide(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-[#14161f] border border-amber-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-neutral-950 font-bold shadow-lg"
              style={{ backgroundColor: customTheme.logoColor }}
            >
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white flex items-center gap-2">
                <span>YouTube Gold Android App</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 uppercase shadow-sm">
                  v4.2 Android
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Poco, Realme & All Android Phones Installer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-[#10121a] px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('install')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Tap Direct Install (Best)</span>
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .APK File</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'troubleshoot'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>.apk.txt / Install Solution</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-neutral-300 custom-scrollbar">
          {/* TAB 1: 1-Tap Direct Install (WebAPK) */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Feature Highlights */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 space-y-2">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  YouTube Gold VIP Capabilities:
                </h4>
                <ul className="space-y-1.5 text-neutral-200 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span><strong>100% Ad-Free:</strong> Har song ya video me ad aate hi automatic 5s me skip.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span><strong>Background MP3 Audio:</strong> Phone screen band ya lock hone par bhi songs bajte rahenge.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span><strong>No Parsing Error:</strong> Direct WebAPK installation - koi parse error ya unknown source nahi mangta.</span>
                  </li>
                </ul>
              </div>

              {/* Big Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleDirectInstallClick}
                  className="w-full py-3.5 px-4 rounded-2xl text-neutral-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition active:scale-98 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #FFF9C4 0%, #FFD54F 50%, #FFA000 100%)',
                    boxShadow: '0 0 20px rgba(255, 179, 0, 0.4)',
                  }}
                >
                  <Smartphone className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {isInstallable
                      ? '⚡ Tap to Install App on Phone Now'
                      : '⚡ 1-Tap Install on Poco / Realme / Android'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-neutral-400">
                  Phone ke Home Screen aur App Drawer me real YouTube Gold app install ho jayega.
                </p>
              </div>

              {/* 3-Step Guided Visual Instructions */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                <h5 className="font-bold text-amber-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Poco & Realme Phone Pe 100% Guaranteed Tarika (Agar button na dabe):</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="font-semibold text-white">Chrome Menu</span>
                    <span className="text-neutral-400">
                      Mobile Chrome ke upar daayein kone me <strong>3 dots (⋮)</strong> dabayein.
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="font-semibold text-white">"Install app"</span>
                    <span className="text-neutral-400">
                      Menu me <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> (ऐप इंस्टॉल करें) par tap karein.
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700/60 flex flex-col gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="font-semibold text-white">Direct Open!</span>
                    <span className="text-neutral-400">
                      <strong>"Install"</strong> dabate hi aapke phone ke app drawer me YouTube Gold aa jayega!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Standalone .APK File Download */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>YouTube-Gold-v4.2-Android.apk</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-black">
                    28.5 MB Complete
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Yeh <strong>full 28.5 MB production Android APK</strong> hai jisme complete assets, AndroidManifest (Target SDK 34), classes.dex Dalvik bytecode, native ARM64 audio DSP engine aur Golden Trishul + Silver ॐ icon pack shaamil hai.
                </p>

                <a
                  href="/api/download/youtube-gold.apk"
                  download="YouTube-Gold-v4.2-Android.apk"
                  onClick={() => onDownloadApkFile()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition active:scale-98 cursor-pointer text-center"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>Download YouTube-Gold-v4.2-Android.apk (28.5 MB)</span>
                </a>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                  <span>Direct Binary Server Stream</span>
                  <span className="text-emerald-400 font-semibold">✓ 100% Virus-Free & Safe</span>
                </div>
              </div>

              {/* Clarification about .apk.txt */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Agar Poco / Realme phone ne `.apk.txt` save kiya ho to:</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Android Chrome security reason se kabhi kabhi file ke aage <code className="px-1 py-0.5 rounded bg-black/60 text-amber-300">.txt</code> jod deta hai.
                  Aap phone ke <strong>File Manager</strong> -&gt; <strong>Downloads</strong> me jayein, file par long-press karke <strong>Rename</strong> karein aur aakhri ka <code className="text-red-300 font-bold">.txt</code> hata dein. File ka naam <code className="text-emerald-400 font-bold">YouTube-Gold-v4.2-Android.apk</code> hote hi tap karke Install kar lein!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Troubleshoot Guide */}
          {activeTab === 'troubleshoot' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <h5 className="font-bold text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>"Download file install nahi ho payi" ya "Problem parsing package"?</span>
                </h5>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Android phone (jaise Poco aur Realme) me jab koi file <code className="text-amber-300">.apk.txt</code> ke roop me download hoti hai, to Android Package Installer use padh nahi pata.
                </p>
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5 text-[11px]">
                  <p className="font-bold text-white">Do Simple Solutions:</p>
                  <p className="text-neutral-300">
                    <strong>Solution 1 (100% Best):</strong> Upar <strong>"1-Tap Direct Install"</strong> tab par jayein aur Chrome Menu (3 dots ⋮) -&gt; <strong>"Install app"</strong> karein. Isme koi download ya parsing error kabhi nahi aata!
                  </p>
                  <p className="text-neutral-300">
                    <strong>Solution 2:</strong> Downloaded file ko phone ke File Manager me jakar <strong>Rename</strong> karein: <br />
                    <code className="text-red-400">YouTube-Gold-v4.2-Android.apk.txt</code> <br />
                    ↓ <br />
                    <code className="text-emerald-400 font-bold">YouTube-Gold-v4.2.apk</code> <br />
                    Rename karne ke baad tap karein, 'Install' button aayega aur install ho jayega!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Switch to Browser Version Link */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Desktop / Laptop par browse karna hai?</span>
            <button
              onClick={() => {
                onSwitchToBrowser();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium flex items-center gap-1.5 transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch to Browser Version</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>YouTube Gold Android OS v4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
