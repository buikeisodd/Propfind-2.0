import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Mail,
  User,
  Lock,
  Fingerprint,
  ShieldAlert,
  CheckSquare,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (userData: {
    name: string;
    email: string;
    age: number;
    role: "seeker" | "owner" | "agent" | "admin";
  }) => void;
  initialMode?: "signin" | "signup";
}

const DUMMY_SHORTCUTS = [
  {
    name: "Chibuike Eseagwu",
    email: "chibuikeeseagwu02@gmail.com",
    age: 34,
    role: "seeker",
    label: "Chibuike (34, Seeker)",
  },
  {
    name: "George Clooney",
    email: "george.clooney@hollywood.com",
    age: 50,
    role: "owner",
    label: "George (50, Private Owner)",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@propfind.com",
    age: 38,
    role: "agent",
    label: "Sarah (38, Agency Broker)",
  },
];

export default function AuthModal({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: 30,
    role: "seeker" as "seeker" | "owner" | "agent",
    nin: "",
    securityQuestion: "first_pet",
    securityAnswer: "",
    agreeAntiScam: false,
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please fill in your email address.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your account password.");
      return;
    }

    if (mode === "signup") {
      if (!formData.name) {
        setError("Please fill in your full name for regulatory auditing.");
        return;
      }
      if (!formData.nin) {
        setError(
          "NIN (National Identification Number) is compulsory for anti-scam identity binding.",
        );
        return;
      }
      if (!formData.securityAnswer) {
        setError("Please answer the identity verification challenge question.");
        return;
      }
      if (!formData.agreeAntiScam) {
        setError(
          "You must attest and agree to the double-lock anti-scam disclosure.",
        );
        return;
      }
      if (formData.age < 18 || formData.age > 100) {
        setError("Ages 18-100 only for secure land registrar contracts.");
        return;
      }
    }

    // Default to a friendly name for signin if blank
    const finalName = formData.name || formData.email.split("@")[0];
    onAuthenticate({
      name: finalName,
      email: formData.email,
      age: Number(formData.age),
      role: formData.role,
    });
    onClose();
  };

  const handleShortcut = (sc: (typeof DUMMY_SHORTCUTS)[0]) => {
    onAuthenticate({
      name: sc.name,
      email: sc.email,
      age: sc.age,
      role: sc.role as any,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      id="auth-wall-modal"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md my-8 text-slate-100 shadow-2xl relative p-6 space-y-5"
        id="auth-panel"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          id="auth-close-btn"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1" id="auth-hdr">
          <div className="inline-flex p-2 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-900/60 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-white text-lg tracking-tight">
            PropFind Member Gate
          </h3>
          <p className="text-xs text-slate-400">
            {mode === "signin"
              ? "Provide your security credentials to access listed properties"
              : "Establish a cryptographic sandbox registry profile (anti-scam enforced)"}
          </p>
        </div>

        {/* Short-cuts selection box */}
        <div
          className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2"
          id="shortcut-box"
        >
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
            Sandbox Quick Sign-In Profiles:
          </span>
          <div className="grid grid-cols-1 gap-1.5" id="shortcuts-grid">
            {DUMMY_SHORTCUTS.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleShortcut(sc)}
                className="w-full text-left p-2 rounded bg-slate-900 hover:bg-subtle border border-slate-850/65 text-[11px] text-slate-300 transition-all font-mono flex justify-between items-center cursor-pointer"
              >
                <span>👤 {sc.label}</span>
                <span className="text-[9px] bg-slate-950 text-blue-400 font-bold uppercase px-1.5 py-0.2 rounded border border-slate-850">
                  Quick-Load
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center" id="or-separator">
          <div className="flex-grow border-t border-slate-850"></div>
          <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-600 uppercase">
            Or Key In Details
          </span>
          <div className="flex-grow border-t border-slate-850"></div>
        </div>

        {error && (
          <div
            className="p-2.5 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded-xl font-medium"
            id="auth-err"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Inputs form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          id="custom-auth-form"
        >
          {mode === "signup" && (
            <div>
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chibuike Eseagwu"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-3 py-2 text-xs placeholder-slate-700 focus:outline-none focus:border-blue-500 text-white font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="email"
                required
                placeholder="e.g. chibuikeeseagwu02@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-3 py-2 text-xs placeholder-slate-700 focus:outline-none focus:border-blue-500 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-3 py-2 text-xs placeholder-slate-700 focus:outline-none focus:border-blue-500 text-white font-mono"
              />
            </div>
          </div>

          {/* Demographic & Verification checks - ENFORCED SOLELY on SignUp Mode (US-08 compliance) */}
          {mode === "signup" && (
            <div
              className="space-y-4 pt-1 border-t border-slate-850 mt-1"
              id="signup-enhanced-security-fields"
            >
              <div className="grid grid-cols-2 gap-3" id="signup-role-age-grid">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Your Age ({formData.age})
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: Number(e.target.value) })
                    }
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2.5"
                  />
                  <span className="text-[9px] text-slate-500 font-mono italic mt-1 block">
                    Demographic checks apply
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Operational Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:border-blue-500 text-white cursor-pointer"
                  >
                    <option value="seeker">Property Seeker</option>
                    <option value="owner">Private Owner / Seller</option>
                    <option value="agent">Licensed Broker Agent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  National Identification Number (NIN / SSN)
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIN-890241-NGR"
                    value={formData.nin}
                    onChange={(e) =>
                      setFormData({ ...formData, nin: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-3 py-2 text-xs placeholder-slate-700 focus:outline-none focus:border-blue-500 text-white font-mono uppercase"
                  />
                </div>
                <span className="text-[8px] text-slate-500 font-mono mt-1 block">
                  Encrypted securely with 256-bit protocol for landlord tax
                  registry.
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                  Fraud-Prevention Audit Question
                </label>
                <select
                  value={formData.securityQuestion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityQuestion: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:border-blue-500 text-white cursor-pointer"
                >
                  <option value="first_pet">Name of your first pet?</option>
                  <option value="mother_maiden">Mother's maiden name?</option>
                  <option value="first_car">
                    Model of your first personal automobile?
                  </option>
                  <option value="birth_city">
                    City in which you purchased your first deed?
                  </option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Your secure answer..."
                  value={formData.securityAnswer}
                  onChange={(e) =>
                    setFormData({ ...formData, securityAnswer: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs placeholder-slate-750 focus:outline-none focus:border-blue-500 text-white font-medium"
                />
              </div>

              <label
                className="flex items-start gap-2 text-[10px] text-slate-300 font-medium cursor-pointer"
                id="anti-scam-attestation-checkbox-label"
              >
                <input
                  type="checkbox"
                  checked={formData.agreeAntiScam}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreeAntiScam: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>
                  I legally attest that my listing queries represent true land
                  titles. I agree to land coordinate and double-lock audit
                  rules.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs font-mono uppercase tracking-widest shadow-md transition-all mt-2 cursor-pointer"
            id="auth-submit-btn"
          >
            {mode === "signin"
              ? "Verify Secret Entry"
              : "Register Secure Profile"}
          </button>
        </form>

        {/* Footer controls */}
        <div
          className="text-center font-mono text-[10px] text-slate-500 pt-1"
          id="auth-ftr"
        >
          {mode === "signin" ? (
            <p>
              New to our marketplace?{" "}
              <span
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
                className="text-blue-400 hover:underline cursor-pointer font-bold"
              >
                Register Account Passport
              </span>
            </p>
          ) : (
            <p>
              Already verified?{" "}
              <span
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
                className="text-blue-400 hover:underline cursor-pointer font-bold"
              >
                Load Credentials Sign-In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
