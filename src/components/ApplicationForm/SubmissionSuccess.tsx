import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
} from 'lucide-react';
import { ApplicationFormData } from '../../types/application';

interface SubmissionSuccessProps {
  referenceCode: string;
  formData: ApplicationFormData;
  isLiveSupabase: boolean;
  onOpenStatusCheck: (code: string) => void;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  referenceCode,
  formData,
  isLiveSupabase,
  onOpenStatusCheck,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const content = `STAFF RECRUITMENT APPLICATION RECEIPT
=========================================
Reference Code:      ${referenceCode}
Target Position:     ${formData.position?.toUpperCase()}
Display Name:        ${formData.applicantInfo.displayName}
Platform Handle:     ${formData.applicantInfo.platformUsername}
Contact Method:      ${formData.applicantInfo.contactMethod}
Weekly Availability: ${formData.applicantInfo.weeklyAvailability}
Submission Date:     ${new Date().toUTCString()}
Database Storage:    ${isLiveSupabase ? 'Supabase PostgreSQL (Live)' : 'Local Secure Sandbox'}
=========================================

IMPORTANT INSTRUCTIONS:
1. Please save your Reference Code: ${referenceCode}
2. You can check your application review status at any time using this reference code.
3. Review turnarounds generally take 48-72 hours. If your application advances to the interview stage, recruitment coordinators will reach out via your specified contact method.

Thank you for your dedication to community safety and leadership!
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `application-receipt-${referenceCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0E121B] border border-slate-800 rounded-xl p-6 sm:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Icon & Title */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Application Submitted Successfully
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your staff application has been validated and recorded. A permanent reference token has been generated for your submission.
        </p>
      </div>

      {/* Reference Code Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 text-center space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
          Your Official Tracking Reference
        </span>
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-widest text-indigo-400 select-all">
          {referenceCode}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt (.txt)</span>
          </button>
        </div>
      </div>

      {/* Submission Metadata */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs font-mono">
        <div>
          <span className="text-slate-500 block">Target Role</span>
          <span className="text-white capitalize">{formData.position}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Candidate Name</span>
          <span className="text-white">{formData.applicantInfo.displayName}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Submission Time</span>
          <span className="text-slate-300">{new Date().toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Storage Engine</span>
          <span className="text-indigo-300">
            {isLiveSupabase ? 'Supabase PostgreSQL' : 'Local Sandbox Queue'}
          </span>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
          What happens next:
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">48–72 Hour Review Window:</strong> Our senior review team examines all answers against our standard grading rubric.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Confidential Evaluation:</strong> Your answers are isolated from public view and only accessible to verified review staff.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Interview Outreach:</strong> If your scenario responses qualify, you will receive an invitation via <span className="text-slate-300">{formData.applicantInfo.contactMethod}</span>.
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => onOpenStatusCheck(referenceCode)}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Test Status Lookup Now</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
        >
          Return to Portal Home
        </button>
      </div>
    </div>
  );
};
