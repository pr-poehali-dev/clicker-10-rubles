import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const banks = [
  {
    id: "sber",
    name: "Сбербанк",
    shortName: "SBER",
    tagline: "Крупнейший банк России",
    logo: "🟢",
    color: "#21A038",
    bg: "rgba(33,160,56,0.08)",
    bgHover: "rgba(33,160,56,0.15)",
    border: "rgba(33,160,56,0.35)",
    methods: ["Карта МИР", "Visa", "Mastercard", "СБП"],
    commission: "0%",
    timing: "до 24 ч",
    limit: "до 600 000 ₽/мес",
    rating: 4.9,
  },
  {
    id: "vtb",
    name: "ВТБ",
    shortName: "VTB",
    tagline: "Второй по активам банк",
    logo: "🔵",
    color: "#009FDF",
    bg: "rgba(0,159,223,0.08)",
    bgHover: "rgba(0,159,223,0.15)",
    border: "rgba(0,159,223,0.35)",
    methods: ["Карта МИР", "Mastercard", "СБП"],
    commission: "0%",
    timing: "до 24 ч",
    limit: "до 300 000 ₽/мес",
    rating: 4.7,
  },
  {
    id: "rshb",
    name: "Россельхозбанк",
    shortName: "RSHB",
    tagline: "Агропромышленный банк",
    logo: "🌾",
    color: "#009A44",
    bg: "rgba(0,154,68,0.08)",
    bgHover: "rgba(0,154,68,0.15)",
    border: "rgba(0,154,68,0.35)",
    methods: ["Карта МИР", "Visa", "СБП"],
    commission: "0%",
    timing: "до 3 р.д.",
    limit: "до 150 000 ₽/мес",
    rating: 4.5,
  },
  {
    id: "ymoney",
    name: "ЮМани",
    shortName: "YMN",
    tagline: "Электронный кошелёк",
    logo: "💜",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    bgHover: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.35)",
    methods: ["Кошелёк", "Карта МИР", "Mastercard"],
    commission: "0%",
    timing: "мгновенно",
    limit: "до 60 000 ₽/мес",
    rating: 4.6,
  },
];

type WithdrawMethod = "card" | "sbp" | "wallet";
type Step = 1 | 2 | 3;

export default function Withdraw() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [method, setMethod] = useState<WithdrawMethod>("card");
  const [amount, setAmount] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [phone, setPhone] = useState("");
  const [walletNum, setWalletNum] = useState("");
  const [step, setStep] = useState<Step>(1);
  const [txStatus, setTxStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [txId, setTxId] = useState("");
  const [processingStep, setProcessingStep] = useState(0);

  const [balance, setBalance] = useState(() => parseFloat(localStorage.getItem("clickerBalance") || "0"));
  const fmt = (v: number) => new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(v);

  const bank = banks.find((b) => b.id === selectedBank);
  const amountNum = parseFloat(amount) || 0;
  const canWithdraw = balance >= 1000;

  const processingSteps = [
    "Подключение к платёжному шлюзу...",
    "Авторизация в " + (bank?.name || "банке") + "...",
    "Проверка реквизитов...",
    "Шифрование данных SSL/TLS...",
    "Отправка транзакции...",
    "Подтверждение банком...",
  ];

  const handleConfirm = () => {
    if (amountNum < 1000 || amountNum > balance) return;
    setTxStatus("processing");
    setProcessingStep(0);
    const newId = "TXN-" + Date.now().toString().slice(-10);
    setTxId(newId);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessingStep(step);
      if (step >= processingSteps.length) {
        clearInterval(interval);
        const newBalance = balance - amountNum;
        setBalance(newBalance);
        localStorage.setItem("clickerBalance", String(newBalance));
        setTxStatus("success");
      }
    }, 500);
  };

  const handleReset = () => {
    setTxStatus("idle");
    setStep(1);
    setSelectedBank(null);
    setAmount("");
    setCardNum("");
    setCardHolder("");
    setPhone("");
    setWalletNum("");
    setProcessingStep(0);
  };

  const quickAmounts = [1000, 2000, 5000, 10000];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20 md:pb-6 flex flex-col gap-7 animate-fade-in">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(43,90%,52%), hsl(38,80%,40%))" }}>
              <Icon name="ArrowUpFromLine" size={20} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-montserrat font-bold text-white">Вывод средств</h1>
              <p className="text-slate-500 text-sm">P2P-транзакции · Физические лица · HTTPS</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Платёжный шлюз активен</span>
          </div>
        </div>

        {/* ── STEPS ── */}
        <div className="flex items-center gap-0">
          {[
            { n: 1, label: "Банк" },
            { n: 2, label: "Реквизиты" },
            { n: 3, label: "Подтверждение" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${step >= s.n ? "" : "opacity-40"}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={step > s.n
                    ? { background: "rgba(52,211,153,0.2)", border: "1px solid #34d399", color: "#34d399" }
                    : step === s.n
                    ? { background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,45%))", color: "hsl(220,30%,8%)" }
                    : { background: "hsl(220,25%,18%)", border: "1px solid hsl(220,20%,25%)", color: "#64748b" }
                  }>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-sm hidden md:block font-medium ${step === s.n ? "text-amber-400" : step > s.n ? "text-emerald-400" : "text-slate-500"}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px mx-3"
                  style={{ background: step > s.n ? "rgba(52,211,153,0.4)" : "hsl(220,20%,22%)" }} />
              )}
            </div>
          ))}
        </div>

        {/* ── BALANCE PANEL ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220,40%,13%) 0%, hsl(225,45%,15%) 100%)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <div className="p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-[0.15em] mb-1">Доступно к выводу</div>
              <div className="text-4xl font-montserrat font-bold gold-text leading-none">{fmt(balance)} ₽</div>
              <div className="text-slate-500 text-xs mt-1.5">Мин. сумма: 1 000 ₽ · Комиссия: 0%</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${canWithdraw ? "text-emerald-400" : "text-rose-400"}`}
                style={canWithdraw
                  ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }
                  : { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Icon name={canWithdraw ? "CheckCircle" : "XCircle"} size={15} />
                {canWithdraw ? "Вывод доступен" : "Недостаточно средств"}
              </div>
              <div className="text-slate-500 text-xs">PCI DSS · SSL/TLS · 3D Secure</div>
            </div>
          </div>
          {/* Progress */}
          <div className="px-5 pb-4">
            <div className="h-1.5 rounded-full overflow-hidden bg-slate-700/60">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, balance / 1000 * 100)}%`,
                  background: "linear-gradient(90deg, hsl(43,90%,40%), hsl(43,90%,60%))"
                }} />
            </div>
          </div>
        </div>

        {/* ── STEP 1: BANK SELECTION ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-slate-400 text-xs uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <Icon name="Building2" size={14} />
              Шаг 1 — Выберите банк-получатель
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBank(b.id); setStep(2); }}
                  className="text-left rounded-2xl p-5 transition-all duration-250 hover-scale group"
                  style={selectedBank === b.id
                    ? { background: b.bgHover, border: `1px solid ${b.border}`, boxShadow: `0 4px 24px ${b.bg}` }
                    : { background: "hsl(220,28%,12%)", border: "1px solid hsl(220,20%,20%)" }
                  }>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{b.logo}</div>
                      <div>
                        <div className="font-bold text-white font-montserrat">{b.name}</div>
                        <div className="text-slate-500 text-xs">{b.tagline}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      ★ {b.rating}
                    </div>
                  </div>

                  {/* Methods */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {b.methods.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-2 pt-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {[
                      { icon: "Percent", label: "Комиссия", val: b.commission },
                      { icon: "Clock", label: "Срок", val: b.timing },
                      { icon: "TrendingUp", label: "Лимит", val: b.limit },
                    ].map((d) => (
                      <div key={d.label} className="text-center">
                        <div className="text-white text-xs font-semibold">{d.val}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">{d.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                    <Icon name="ArrowRight" size={14} />
                    Выбрать {b.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: REQUISITES ── */}
        {step === 2 && bank && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
                <Icon name="CreditCard" size={14} />
                Шаг 2 — Реквизиты и сумма
              </div>
              <button onClick={() => setStep(1)}
                className="text-slate-500 text-xs hover:text-slate-300 flex items-center gap-1 transition-colors">
                <Icon name="ChevronLeft" size={14} />
                Сменить банк
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-5">
              {/* Bank info sidebar */}
              <div className="md:col-span-2 rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: bank.bgHover, border: `1px solid ${bank.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{bank.logo}</div>
                  <div>
                    <div className="font-bold text-white font-montserrat text-lg">{bank.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: bank.color }}>{bank.tagline}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Комиссия", value: bank.commission },
                    { label: "Зачисление", value: bank.timing },
                    { label: "Лимит/мес", value: bank.limit },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between py-2 text-sm"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-slate-400">{r.label}</span>
                      <span className="text-white font-medium">{r.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2"
                  style={{ background: "rgba(0,0,0,0.2)" }}>
                  <span>🔒</span>
                  <span>Данные шифруются по SSL/TLS. PCI DSS. 3D Secure на каждой операции.</span>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-3 navy-card rounded-2xl p-5 flex flex-col gap-4">
                {/* Method tabs */}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Способ вывода</div>
                  <div className="flex gap-2 p-1 rounded-xl" style={{ background: "hsl(220,25%,17%)" }}>
                    {[
                      { key: "card", label: "Карта", icon: "CreditCard" },
                      { key: "sbp", label: "СБП", icon: "Zap" },
                      { key: "wallet", label: "Кошелёк", icon: "Wallet" },
                    ].map((m) => (
                      <button key={m.key}
                        onClick={() => setMethod(m.key as WithdrawMethod)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${method === m.key ? "text-slate-900" : "text-slate-400 hover:text-white"}`}
                        style={method === m.key ? { background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,45%))" } : {}}>
                        <Icon name={m.icon} size={13} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                {method === "card" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Номер карты</label>
                      <input value={cardNum} onChange={(e) => setCardNum(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm font-mono tracking-widest"
                        style={{ background: "hsl(220,25%,17%)", border: "1px solid rgba(251,191,36,0.2)" }} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Имя держателя карты</label>
                      <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="IVAN PETROV"
                        className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm uppercase tracking-wider"
                        style={{ background: "hsl(220,25%,17%)", border: "1px solid rgba(251,191,36,0.2)" }} />
                    </div>
                  </>
                )}
                {method === "sbp" && (
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Номер телефона (СБП)</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm"
                      style={{ background: "hsl(220,25%,17%)", border: "1px solid rgba(251,191,36,0.2)" }} />
                    <div className="text-xs text-slate-500 mt-1">Перевод через Систему быстрых платежей — мгновенно</div>
                  </div>
                )}
                {method === "wallet" && (
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Номер кошелька</label>
                    <input value={walletNum} onChange={(e) => setWalletNum(e.target.value)}
                      placeholder="4100 0000 0000"
                      className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm font-mono"
                      style={{ background: "hsl(220,25%,17%)", border: "1px solid rgba(251,191,36,0.2)" }} />
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Сумма вывода</label>
                  <div className="relative">
                    <input value={amount} onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      type="number" min="1000"
                      className="w-full rounded-xl px-4 py-3 pr-10 text-white outline-none text-lg font-montserrat font-bold"
                      style={{ background: "hsl(220,25%,17%)", border: "1px solid rgba(251,191,36,0.25)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 font-bold">₽</span>
                  </div>
                  {/* Quick amounts */}
                  <div className="flex gap-2 mt-2">
                    {quickAmounts.map((q) => (
                      <button key={q} onClick={() => setAmount(String(q))}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${amount === String(q) ? "text-slate-900" : "text-slate-400 hover:text-white"}`}
                        style={amount === String(q)
                          ? { background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,45%))" }
                          : { background: "hsl(220,25%,20%)" }}>
                        {q.toLocaleString("ru-RU")} ₽
                      </button>
                    ))}
                  </div>
                  {amountNum > 0 && (
                    <div className="text-xs text-slate-500 mt-1.5 flex justify-between">
                      <span>К зачислению: <span className="text-emerald-400 font-semibold">{fmt(amountNum)} ₽</span></span>
                      <span>Комиссия: <span className="text-emerald-400">0 ₽</span></span>
                    </div>
                  )}
                </div>

                <button onClick={() => setStep(3)}
                  disabled={!amount || amountNum < 1000}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover-scale flex items-center justify-center gap-2"
                  style={{ background: "hsl(220,25%,20%)", border: "1px solid hsl(220,20%,28%)", color: "white" }}>
                  <Icon name="ArrowRight" size={16} />
                  Перейти к подтверждению
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIRM ── */}
        {step === 3 && bank && txStatus === "idle" && (
          <div className="animate-fade-in max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} />
                Шаг 3 — Подтверждение вывода
              </div>
              <button onClick={() => setStep(2)}
                className="text-slate-500 text-xs hover:text-slate-300 flex items-center gap-1 transition-colors">
                <Icon name="ChevronLeft" size={14} />
                Назад
              </button>
            </div>

            <div className="navy-card rounded-2xl p-6 flex flex-col gap-5">
              {/* Bank badge */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: bank.bgHover, border: `1px solid ${bank.border}` }}>
                <span className="text-2xl">{bank.logo}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{bank.name}</div>
                  <div className="text-xs" style={{ color: bank.color }}>{bank.tagline}</div>
                </div>
                <div className="ml-auto text-xs font-semibold" style={{ color: bank.color }}>
                  {method === "card" ? "Карта" : method === "sbp" ? "СБП" : "Кошелёк"}
                </div>
              </div>

              {/* Amount hero */}
              <div className="rounded-2xl p-6 text-center"
                style={{ background: "hsl(220,25%,15%)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Сумма к выводу</div>
                <div className="text-5xl font-montserrat font-black gold-text">{fmt(amountNum)} ₽</div>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                  <span>Комиссия: <span className="text-emerald-400 font-semibold">0 ₽</span></span>
                  <span>·</span>
                  <span>К зачислению: <span className="text-emerald-400 font-semibold">{fmt(amountNum)} ₽</span></span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-0 rounded-xl overflow-hidden"
                style={{ border: "1px solid hsl(220,20%,22%)" }}>
                {[
                  { label: "Получатель", value: method === "card" ? (cardNum || "—") : method === "sbp" ? (phone || "—") : (walletNum || "—"), highlight: false },
                  { label: "Держатель", value: cardHolder || "—", highlight: false },
                  { label: "Банк", value: bank.name, highlight: false },
                  { label: "Платёжная система", value: "Prodamus.pay · CMS модуль", highlight: false },
                  { label: "Срок зачисления", value: bank.timing, highlight: false },
                  { label: "Баланс после вывода", value: `${fmt(balance - amountNum)} ₽`, highlight: true },
                ].filter(r => !(r.label === "Держатель" && method !== "card")).map((r, i, arr) => (
                  <div key={r.label} className="flex justify-between items-center px-4 py-3"
                    style={{ background: i % 2 === 0 ? "hsl(220,25%,16%)" : "hsl(220,25%,14%)", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.highlight ? "text-amber-400" : "text-white"}`}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Prodamus gateway badge */}
              <div className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <div className="text-2xl">💳</div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">Платёжный шлюз Prodamus</div>
                  <div className="text-slate-500 text-xs">P2P-транзакция · Физическое лицо · HTTPS</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <Icon name="Wifi" size={10} />Онлайн
                  </div>
                  <div className="text-[10px] text-slate-500">Шлюз активен</div>
                </div>
              </div>

              {/* Security row */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { icon: "🔒", label: "SSL/TLS" },
                  { icon: "🛡️", label: "PCI DSS" },
                  { icon: "👆", label: "3D Secure" },
                  { icon: "✅", label: "HTTPS" },
                ].map((s) => (
                  <div key={s.label} className="py-2 rounded-xl text-xs text-slate-500 flex flex-col items-center gap-1"
                    style={{ background: "hsl(220,25%,16%)" }}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={amountNum < 1000 || amountNum > balance}
                className="w-full py-4 rounded-xl font-black text-base transition-all hover-scale disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg, hsl(43,90%,58%), hsl(38,82%,44%))", color: "hsl(220,30%,8%)", boxShadow: "0 6px 24px rgba(251,191,36,0.3)" }}>
                <Icon name="SendHorizonal" size={20} />
                ПОДТВЕРДИТЬ И ВЫВЕСТИ {fmt(amountNum)} ₽
              </button>

              {amountNum < 1000 && (
                <div className="text-center text-xs text-rose-400">Минимальная сумма вывода — 1 000 ₽</div>
              )}
              {amountNum > balance && balance > 0 && (
                <div className="text-center text-xs text-rose-400">Недостаточно средств на балансе</div>
              )}
            </div>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === 3 && txStatus === "processing" && (
          <div className="animate-scale-in max-w-lg mx-auto w-full">
            <div className="navy-card rounded-2xl p-8 flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(220,25%,20%)" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(43,90%,55%)" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="140" strokeDashoffset="70" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">💳</div>
              </div>

              <div className="text-center">
                <div className="text-white font-montserrat font-bold text-lg mb-1">Обработка транзакции</div>
                <div className="text-amber-400 text-sm animate-pulse">
                  {processingSteps[Math.min(processingStep, processingSteps.length - 1)]}
                </div>
              </div>

              <div className="w-full flex flex-col gap-2">
                {processingSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 ${
                      i < processingStep ? "bg-emerald-500 text-white" :
                      i === processingStep ? "bg-amber-400 text-slate-900" :
                      "bg-slate-700 text-slate-500"
                    }`}>
                      {i < processingStep ? "✓" : i + 1}
                    </div>
                    <div className={`text-sm transition-all ${i < processingStep ? "text-emerald-400" : i === processingStep ? "text-white" : "text-slate-600"}`}>
                      {s}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full h-2 rounded-full overflow-hidden bg-slate-700">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(processingStep / processingSteps.length) * 100}%`,
                    background: "linear-gradient(90deg, hsl(43,90%,45%), hsl(43,90%,60%))"
                  }} />
              </div>
              <div className="text-slate-500 text-xs">Не закрывайте страницу во время обработки</div>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {txStatus === "success" && (
          <div className="animate-scale-in max-w-lg mx-auto w-full">
            <div className="navy-card rounded-2xl p-8 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)" }}>
                ✅
              </div>
              <div>
                <div className="text-2xl font-montserrat font-black text-emerald-400 mb-1">Транзакция выполнена!</div>
                <div className="text-slate-400 text-sm">Средства успешно отправлены на счёт</div>
              </div>

              <div className="w-full rounded-2xl p-5"
                style={{ background: "hsl(220,25%,15%)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="text-slate-400 text-xs mb-3 uppercase tracking-wider">Детали транзакции</div>
                {[
                  { label: "Сумма", value: `${fmt(amountNum)} ₽`, color: "text-emerald-400" },
                  { label: "Банк", value: bank?.name || "—", color: "text-white" },
                  { label: "Получатель", value: method === "card" ? cardNum : method === "sbp" ? phone : walletNum || "—", color: "text-white" },
                  { label: "ID транзакции", value: txId, color: "text-amber-400" },
                  { label: "Статус", value: "Выполнено", color: "text-emerald-400" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-slate-500 text-sm">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-slate-500 text-xs">Новый баланс: <span className="text-amber-400 font-semibold">{fmt(balance)} ₽</span></div>

              <button onClick={handleReset}
                className="w-full py-3.5 rounded-xl font-bold text-sm hover-scale"
                style={{ background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))", color: "hsl(220,30%,8%)" }}>
                Сделать ещё один вывод
              </button>
            </div>
          </div>
        )}

        {/* ── INFO BLOCK ── */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "Shield", title: "Полная безопасность", desc: "SSL/TLS, PCI DSS, 3D Secure на каждой операции. Данные зашифрованы.", color: "text-emerald-400" },
            { icon: "Zap", title: "Быстрое зачисление", desc: "СБП — мгновенно. Карты Сбербанк и ВТБ — до 24 часов.", color: "text-amber-400" },
            { icon: "Phone", title: "SMS при каждой операции", desc: "Уведомление о статусе транзакции придёт сразу после обработки.", color: "text-blue-400" },
          ].map((item, i) => (
            <div key={i} className="navy-card rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(220,25%,18%)" }}>
                <Icon name={item.icon} size={18} className={item.color} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}