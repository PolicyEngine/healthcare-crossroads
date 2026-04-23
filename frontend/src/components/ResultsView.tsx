'use client';

import { BenefitMetric, HealthcareCoverage, SimulationResult } from '@/types';

interface ResultsViewProps {
  result: SimulationResult;
  onReset: () => void;
}

const SUPPORT_METRIC_NAMES = new Set(['premium_tax_credit']);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonthly(value: number): string {
  return formatCurrency(value / 12);
}

function formatMonthlyChange(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatMonthly(value)}`;
}

function getCoverageLabel(type: string | null): string {
  switch (type) {
    case 'ESI':
      return 'Employer Insurance';
    case 'Marketplace':
      return 'ACA Marketplace';
    default:
      return type || '—';
  }
}

function SectionRow({ label }: { label: string }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={4} className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </td>
    </tr>
  );
}

function CoverageRow({
  label,
  beforeCoverage,
  afterCoverage,
  existsBefore,
  existsAfter,
  striped,
}: {
  label: string;
  beforeCoverage: string | null;
  afterCoverage: string | null;
  existsBefore: boolean;
  existsAfter: boolean;
  striped: boolean;
}) {
  const beforeText = existsBefore ? getCoverageLabel(beforeCoverage) : '—';
  const afterText = existsAfter ? getCoverageLabel(afterCoverage) : '—';
  const changed = beforeCoverage !== afterCoverage || existsBefore !== existsAfter;

  return (
    <tr className={striped ? 'bg-gray-50/50' : 'bg-white'}>
      <td className="px-5 py-3 text-sm font-medium text-gray-800 w-40">{label}</td>
      <td className="px-5 py-3 text-sm text-gray-500">{beforeText}</td>
      <td className={`px-5 py-3 text-sm ${changed ? 'font-semibold text-[#2C7A7B]' : 'text-gray-500'}`}>
        {afterText}
      </td>
      <td className="px-5 py-3 text-sm text-gray-400">
        {changed && beforeText !== afterText && (
          <span className="text-[#2C7A7B]">→</span>
        )}
      </td>
    </tr>
  );
}

function FinancialRow({
  label,
  before,
  after,
  striped,
}: {
  label: string;
  before: number;
  after: number;
  striped: boolean;
}) {
  const diff = after - before;
  const tone = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400';

  return (
    <tr className={striped ? 'bg-gray-50/50' : 'bg-white'}>
      <td className="px-5 py-3 text-sm font-medium text-gray-800 w-40">{label}</td>
      <td className="px-5 py-3 text-sm text-gray-500 tabular-nums">{formatMonthly(before)}</td>
      <td className="px-5 py-3 text-sm text-gray-500 tabular-nums">{formatMonthly(after)}</td>
      <td className={`px-5 py-3 text-sm font-semibold tabular-nums ${tone}`}>
        {diff !== 0 ? formatMonthlyChange(diff) : '—'}
      </td>
    </tr>
  );
}

export default function ResultsView({ result, onReset }: ResultsViewProps) {
  if (!result?.before || !result?.after) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">The simulation returned incomplete data. Please try again.</p>
        <button onClick={onReset} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  const metrics = result.before.metrics || [];
  const financialRows = [
    { label: 'Net income', before: result.before.netIncome, after: result.after.netIncome },
    ...metrics
      .filter((m) => SUPPORT_METRIC_NAMES.has(m.name))
      .filter((m) => m.before !== 0 || m.after !== 0)
      .map((m: BenefitMetric) => ({ label: m.label, before: m.before, after: m.after })),
  ];

  const beforeLabels = new Set((result.healthcareBefore?.people || []).map((p) => p.label));
  const afterLabels = new Set((result.healthcareAfter?.people || []).map((p) => p.label));
  const allLabels = Array.from(new Set([...beforeLabels, ...afterLabels]));

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40" />
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Before</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">After</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <SectionRow label="Coverage" />
            {allLabels.map((label, i) => {
              const beforeCoverage = result.healthcareBefore?.people.find((p) => p.label === label)?.coverage ?? null;
              const afterCoverage = result.healthcareAfter?.people.find((p) => p.label === label)?.coverage ?? null;
              return (
                <CoverageRow
                  key={label}
                  label={label}
                  beforeCoverage={beforeCoverage}
                  afterCoverage={afterCoverage}
                  existsBefore={beforeLabels.has(label)}
                  existsAfter={afterLabels.has(label)}
                  striped={i % 2 === 1}
                />
              );
            })}

            <SectionRow label="Financial (per month)" />
            {financialRows.map(({ label, before, after }, i) => (
              <FinancialRow
                key={label}
                label={label}
                before={before}
                after={after}
                striped={i % 2 === 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center pt-2">
        <button onClick={onReset} className="btn btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Scenario
        </button>
      </div>
    </div>
  );
}
