import { useState } from "react";

type CalcTab = "sip" | "emi" | "ci" | "retirement";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<CalcTab>("sip");

  // SIP State
  const [sipAmount, setSipAmount]   = useState(10000);
  const [sipRate, setSipRate]       = useState(12);
  const [sipYears, setSipYears]     = useState(15);

  // EMI State
  const [emiPrincipal, setEmiPrincipal] = useState(2000000);
  const [emiRate, setEmiRate]           = useState(8.5);
  const [emiMonths, setEmiMonths]       = useState(240);

  // CI State
  const [ciPrincipal, setCiPrincipal] = useState(100000);
  const [ciRate, setCiRate]           = useState(10);
  const [ciYears, setCiYears]         = useState(10);

  // Retirement State
  const [retAge, setRetAge]     = useState(28);
  const [retSaving, setRetSaving] = useState(20000);
  const [retRate, setRetRate]   = useState(11);

  // ── Formulas ──────────────────────────────────────────
  const calcSIP = () => {
    const r = sipRate / 100 / 12;
    const n = sipYears * 12;
    const total = r > 0
      ? sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
      : sipAmount * n;
    const invested = sipAmount * n;
    return { total, invested, gains: total - invested };
  };

  const calcEMI = () => {
    const r = emiRate / 100 / 12;
    const n = emiMonths;
    const emi = r > 0
      ? (emiPrincipal * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1)
      : emiPrincipal / n;
    const totalPay = emi * n;
    return { emi, totalPay, interest: totalPay - emiPrincipal };
  };

  const calcCI = () => {
    const amount = ciPrincipal * Math.pow(1 + ciRate / 100, ciYears);
    return { amount, interest: amount - ciPrincipal };
  };

  const calcRetirement = () => {
    const r = retRate / 100 / 12;
    const n = Math.max(0, (60 - retAge)) * 12;
    const corpus = r > 0
      ? retSaving * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
      : retSaving * n;
    return { corpus };
  };

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  };

  const sip = calcSIP();
  const emi = calcEMI();
  const ci  = calcCI();
  const ret = calcRetirement();

  const tabs: { key: CalcTab; label: string; icon: string }[] = [
    { key: "sip",        label: "SIP",              icon: "📈" },
    { key: "emi",        label: "EMI",              icon: "🏠" },
    { key: "ci",         label: "Compound Interest", icon: "💰" },
    { key: "retirement", label: "Retirement",        icon: "🎯" },
  ];

  const InputField = ({
    label, value, onChange, min, max, step = 1, prefix = "", suffix = ""
  }: {
    label: string; value: number; onChange: (v: number) => void;
    min: number; max: number; step?: number;
    prefix?: string; suffix?: string;
  }) => (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </label>
        <span className="text-sm font-semibold text-blue-600">
          {prefix}{value.toLocaleString("en-IN")}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg
          appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );

  const ResultCard = ({
    label, value, highlight = false
  }: {
    label: string; value: string; highlight?: boolean
  }) => (
    <div className={`rounded-xl p-4 text-center ${
      highlight
        ? "bg-blue-600 text-white"
        : "bg-gray-50 dark:bg-gray-700"
    }`}>
      <div className={`text-xs mb-1 ${
        highlight ? "text-blue-100" : "text-gray-400"
      }`}>
        {label}
      </div>
      <div className={`text-lg font-bold ${
        highlight ? "text-white" : "text-gray-800 dark:text-white"
      }`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Financial Calculators
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          SIP · EMI · Compound Interest · Retirement Planning
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm
              font-medium transition ${
              activeTab === t.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border
        border-gray-200 dark:border-gray-700 p-6">

        {/* SIP Calculator */}
        {activeTab === "sip" && (
          <>
            <h2 className="text-base font-semibold text-gray-800
              dark:text-white mb-5">
              SIP Calculator
            </h2>
            <InputField
              label="Monthly SIP Amount"
              value={sipAmount} onChange={setSipAmount}
              min={500} max={100000} step={500} prefix="₹"
            />
            <InputField
              label="Expected Annual Return"
              value={sipRate} onChange={setSipRate}
              min={1} max={30} step={0.5} suffix="%"
            />
            <InputField
              label="Investment Duration"
              value={sipYears} onChange={setSipYears}
              min={1} max={40} suffix=" yrs"
            />
            <div className="grid grid-cols-3 gap-3 mt-6">
              <ResultCard label="Total Invested"
                value={fmt(sip.invested)} />
              <ResultCard label="Est. Returns"
                value={fmt(sip.gains)} />
              <ResultCard label="Maturity Value"
                value={fmt(sip.total)} highlight />
            </div>
          </>
        )}

        {/* EMI Calculator */}
        {activeTab === "emi" && (
          <>
            <h2 className="text-base font-semibold text-gray-800
              dark:text-white mb-5">
              EMI Calculator
            </h2>
            <InputField
              label="Loan Amount"
              value={emiPrincipal} onChange={setEmiPrincipal}
              min={100000} max={10000000} step={100000} prefix="₹"
            />
            <InputField
              label="Annual Interest Rate"
              value={emiRate} onChange={setEmiRate}
              min={1} max={20} step={0.25} suffix="%"
            />
            <InputField
              label="Loan Tenure"
              value={emiMonths} onChange={setEmiMonths}
              min={12} max={360} step={12} suffix=" mo"
            />
            <div className="grid grid-cols-3 gap-3 mt-6">
              <ResultCard label="Principal"
                value={fmt(emiPrincipal)} />
              <ResultCard label="Total Interest"
                value={fmt(emi.interest)} />
              <ResultCard label="Monthly EMI"
                value={fmt(emi.emi)} highlight />
            </div>
          </>
        )}

        {/* Compound Interest */}
        {activeTab === "ci" && (
          <>
            <h2 className="text-base font-semibold text-gray-800
              dark:text-white mb-5">
              Compound Interest Calculator
            </h2>
            <InputField
              label="Principal Amount"
              value={ciPrincipal} onChange={setCiPrincipal}
              min={1000} max={1000000} step={1000} prefix="₹"
            />
            <InputField
              label="Annual Interest Rate"
              value={ciRate} onChange={setCiRate}
              min={1} max={30} step={0.5} suffix="%"
            />
            <InputField
              label="Time Period"
              value={ciYears} onChange={setCiYears}
              min={1} max={40} suffix=" yrs"
            />
            <div className="grid grid-cols-3 gap-3 mt-6">
              <ResultCard label="Principal"
                value={fmt(ciPrincipal)} />
              <ResultCard label="Interest Earned"
                value={fmt(ci.interest)} />
              <ResultCard label="Maturity Value"
                value={fmt(ci.amount)} highlight />
            </div>
          </>
        )}

        {/* Retirement */}
        {activeTab === "retirement" && (
          <>
            <h2 className="text-base font-semibold text-gray-800
              dark:text-white mb-5">
              Retirement Planner
            </h2>
            <InputField
              label="Current Age"
              value={retAge} onChange={setRetAge}
              min={18} max={55} suffix=" yrs"
            />
            <InputField
              label="Monthly Savings"
              value={retSaving} onChange={setRetSaving}
              min={1000} max={200000} step={1000} prefix="₹"
            />
            <InputField
              label="Expected Annual Return"
              value={retRate} onChange={setRetRate}
              min={1} max={25} step={0.5} suffix="%"
            />
            <div className="grid grid-cols-1 gap-3 mt-6">
              <ResultCard
                label={`Retirement Corpus at Age 60 (${60 - retAge} years away)`}
                value={fmt(ret.corpus)}
                highlight
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl
              text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              💡 Assuming you invest ₹{retSaving.toLocaleString("en-IN")}/month
              for {60 - retAge} years at {retRate}% annual return,
              you will accumulate <strong>{fmt(ret.corpus)}</strong> by
              age 60.
            </div>
          </>
        )}
      </div>
    </div>
  );
}