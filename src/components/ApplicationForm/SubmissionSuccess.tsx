import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  Search,
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
    const contactMethodStr = formData.applicantInfo.contactMethod === 'Gmail' && formData.applicantInfo.contactEmail
      ? `Gmail (${formData.applicantInfo.contactEmail})`
      : formData.applicantInfo.contactMethod;

    const content = `ASPIDA STAFF RECRUITMENT APPLICATION RECEIPT
=========================================
Reference Code:      ${referenceCode}
Target Position:     ${formData.position?.toUpperCase()}
Full Name:           ${formData.applicantInfo.displayName}
Discord Username:    ${formData.applicantInfo.platformUsername}
Country:             ${formData.applicantInfo.country || formData.applicantInfo.timeZone}
Contact Method:      ${contactMethodStr}
Weekly Availability: ${formData.applicantInfo.weeklyAvailability}
Submission Date:     ${new Date().toUTCString()}
Status:              Received & Logged
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
    link.download = `aspida-application-${referenceCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#090B12] border border-amber-500/30 rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200 shadow-2xl">
      {/* Icon & Title */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
          Application Received
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Your application has been logged into the review queue. Save your tracking reference code below.
        </p>
      </div>

      {/* Reference Code Box with Gold Highlights */}
      <div className="bg-[#05060A] border border-amber-500/30 rounded-xl p-6 text-center space-y-3 shadow-inner">
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80 block">
          Official Reference Code
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-widest text-amber-300 select-all">
          {referenceCode}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="Btn gap-2 shrink-0 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Reference</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt (.txt)</span>
          </button>
        </div>
      </div>

      {/* Submission Metadata */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-[#06070B] border border-white/5 rounded-lg text-xs font-mono">
        <div>
          <span className="text-slate-500 block">Position Track</span>
          <span className="text-amber-300 capitalize">{formData.position}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Candidate</span>
          <span className="text-white">{formData.applicantInfo.displayName}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Date Submitted</span>
          <span className="text-slate-300">{new Date().toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Verification Status</span>
          <span className="text-emerald-400">Queue Confirmed</span>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <h4 className="text-xs font-semibold text-amber-300/90 tracking-wide uppercase">
          Review Process Timeline:
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">48–72 Hour Evaluation:</strong> Senior staff review your situational answers against standard scoring rubrics.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Strict Confidentiality:</strong> Your responses remain secure and are only visible to authorized review team members.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Next Communication:</strong> If selected for interview, staff will reach out via <span className="text-amber-300">{formData.applicantInfo.contactMethod}</span>.
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
        <button
          onClick={() => onOpenStatusCheck(referenceCode)}
          className="Btn gap-2 shrink-0 shadow-md shadow-amber-500/20 w-full sm:w-auto"
        >
          <Search className="w-3.5 h-3.5 text-[#ffd277]" />
          <span>Check Status Now</span>
        </button>

        <button
          onClick={onReset}
          className="Btn gap-2 shrink-0 w-full sm:w-auto"
        >
          <span>Return to Portal</span>
        </button>
      </div>
    </div>
  );
};
