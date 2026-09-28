import React, { useState } from 'react';
import { HelpCircle, CheckSquare, Printer, Copy, Check } from 'lucide-react';
import { DiagnosticAnalysis } from '../types/diagnostic';

interface DoctorQuestionsProps {
  questions: string[];
  checklist: string[];
  analysis: DiagnosticAnalysis;
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({
  questions,
  checklist,
  analysis,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyQuestions = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Targeted Physician Consultation Questions */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Questions for Your Specialist</span>
            </h4>
            <button
              onClick={handleCopyQuestions}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy questions to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Evidence-based clinical questions to discuss during your initial evaluation:
          </p>

          <ol className="space-y-2.5">
            {questions.map((q, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="font-mono text-teal-700 font-semibold shrink-0">
                  {idx + 1}.
                </span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Take these questions to your in-person visit
          </span>
          <button
            onClick={handlePrint}
            className="text-xs text-teal-700 font-medium hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Patient Referral Slip</span>
          </button>
        </div>
      </div>

      {/* Patient Preparation Checklist */}
      <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div>
          <div className="pb-3 border-b border-slate-100 mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-600" />
              <span>Facility Visit Checklist</span>
            </h4>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Steps to complete before arriving at the recommended hospital facility:
          </p>

          <ul className="space-y-2.5">
            {checklist.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`chk-${idx}`}
                  defaultChecked={idx === 0}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor={`chk-${idx}`} className="leading-relaxed cursor-pointer">
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Responsible Medical Safety Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <strong className="text-slate-700 font-semibold">Clinical Notice:</strong>{' '}
          {analysis.medicalDisclaimer}
        </div>
      </div>
    </div>
  );
};
