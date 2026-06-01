import React, { useState } from "react";
import { X, User, Camera, ShieldCheck, FileText, CheckCircle, Upload } from "lucide-react";
import { UserProfile } from "../types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}: UserProfileModalProps) {
  const [bio, setBio] = useState(userProfile.bio || "");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({ bio });
    onClose();
  };

  const handleUploadCredentials = () => {
    setIsUploading(true);
    setTimeout(() => {
      onUpdateProfile({ verificationStatus: "pending" });
      setIsUploading(false);
      alert("Credentials uploaded securely! Pending administrator review.");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative text-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <img
              src={userProfile.photo}
              alt={userProfile.name}
              className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover"
            />
            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full border-2 border-slate-900 text-white hover:bg-blue-500 cursor-pointer">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <h3 className="font-extrabold text-xl tracking-tight flex items-center justify-center gap-2">
            {userProfile.name}
            {userProfile.verificationStatus === "verified" && (
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            )}
          </h3>
          <p className="text-sm text-slate-400 font-medium capitalize">
            {userProfile.role} Account
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={userProfile.email}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Bio / About Me
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your preferences or expertise..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white resize-none"
            />
          </div>

          {/* Verification section for Agents and Owners */}
          {(userProfile.role === "agent" || userProfile.role === "owner") && (
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">
                Identity Verification
              </label>
              
              {userProfile.verificationStatus === "verified" ? (
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300">Your profile is fully verified by administrators.</p>
                </div>
              ) : userProfile.verificationStatus === "pending" ? (
                <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300">Credentials under review. Please wait 24-48 hours.</p>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2">
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Upload official government ID and relevant real estate licenses to obtain your verified badge.
                  </p>
                  <button
                    onClick={handleUploadCredentials}
                    disabled={isUploading}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold font-mono rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? "Uploading Securely..." : <><Upload className="w-3.5 h-3.5" /> Upload Secure Documents</>}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs font-mono uppercase tracking-widest shadow-md transition-all mt-4 cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
