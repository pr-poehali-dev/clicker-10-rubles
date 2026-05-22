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
  const [showGateway, setShowGateway] = useState(false);
  const [actionType, setActionType] = useState<"pay" | "topup">("pay");
  const [txSuccess, setTxSuccess] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const [balance] = useState(() => parseFloat(localStorage.getItem("clickerBalance") || "0"));
  const fmt = (v: number) => new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(v);

  const bank = banks.find((b) => b.id === selectedBank);
  const amountNum = parseFloat(amount) || 0;
  const canWithdraw = balance >= 1000;

  const handleSendCode = () => {
    setCodeSent(true);
  };

  const handleConfirm = () => {
    if (!codeSent) return;
    setTxSuccess(true);
    setTimeout(() => {
      setShowGateway(false);
      setTxSuccess(false);
      setStep(1);
      setSelectedBank(null);
      setAmount("");
      setCardNum("");
      setCardHolder("");
      setPhone("");
      setWalletNum("");
      setSmsCode("");
      setCodeSent(false);
    }, 3500);
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

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button onClick={() => { setActionType("pay"); setShowGateway(true); }}
                    className="py-3 rounded-xl font-bold text-sm transition-all hover-scale flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))", color: "hsl(220,30%,8%)" }}>
                    <Icon name="CreditCard" size={15} />
                    ОПЛАТИТЬ
                  </button>
                  <button onClick={() => { setActionType("topup"); setShowGateway(true); }}
                    className="py-3 rounded-xl font-bold text-sm border transition-all hover-scale flex items-center justify-center gap-2 text-amber-400"
                    style={{ border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.07)" }}>
                    <Icon name="ArrowDownToLine" size={15} />
                    ПОПОЛНИТЬ
                  </button>
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
        {step === 3 && bank && (
          <div className="animate-fade-in max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-400 text-xs uppercase tracking-[0.15em] flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} />
                Шаг 3 — Подтверждение
              </div>
              <button onClick={() => setStep(2)}
                className="text-slate-500 text-xs hover:text-slate-300 flex items-center gap-1 transition-colors">
                <Icon name="ChevronLeft" size={14} />
                Назад
              </button>
            </div>

            <div className="navy-card rounded-2xl p-6 flex flex-col gap-5">
              {/* Summary */}
              <div className="rounded-2xl p-5 text-center"
                style={{ background: "hsl(220,25%,16%)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Сумма транзакции</div>
                <div className="text-4xl font-montserrat font-bold gold-text">{fmt(amountNum)} ₽</div>
                <div className="text-slate-500 text-sm mt-1">{bank.name} · {method === "card" ? "Карта" : method === "sbp" ? "СБП" : "Кошелёк"}</div>
              </div>

              {/* Details list */}
              <div className="flex flex-col gap-2">
                {[
                  { label: "Получатель", value: method === "card" ? (cardNum || "—") : method === "sbp" ? (phone || "—") : (walletNum || "—") },
                  { label: "Банк", value: bank.name },
                  { label: "Способ", value: method === "card" ? "Карта" : method === "sbp" ? "СБП" : "Кошелёк" },
                  { label: "Комиссия", value: "0 ₽" },
                  { label: "К зачислению", value: `${fmt(amountNum)} ₽` },
                  { label: "Срок зачисления", value: bank.timing },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className={`text-sm font-semibold ${r.label === "К зачислению" ? "text-emerald-400" : r.label === "Комиссия" ? "text-emerald-400" : "text-white"}`}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* SMS confirm */}
              <div className="rounded-xl p-4" style={{ background: "hsl(220,25%,15%)", border: "1px solid hsl(220,20%,24%)" }}>
                <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon name="MessageSquare" size={15} className="text-amber-400" />
                  SMS-подтверждение
                </div>
                <div className="flex gap-2">
                  <input value={smsCode} onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="Код из SMS"
                    className="flex-1 rounded-xl px-4 py-2.5 text-white outline-none text-sm font-mono tracking-widest"
                    style={{ background: "hsl(220,25%,18%)", border: "1px solid rgba(251,191,36,0.2)" }} />
                  <button onClick={handleSendCode}
                    className={`px-4 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${codeSent ? "text-emerald-400" : "text-amber-400"}`}
                    style={codeSent
                      ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }
                      : { background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                    {codeSent ? "Отправлено ✓" : "Получить код"}
                  </button>
                </div>
                {codeSent && <div className="text-xs text-slate-500 mt-2">Код отправлен на номер, указанный в профиле</div>}
              </div>

              {/* Security */}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Icon name="Lock" size={11} />SSL/TLS</span>
                <span className="flex items-center gap-1"><Icon name="ShieldCheck" size={11} />PCI DSS</span>
                <span className="flex items-center gap-1"><Icon name="Fingerprint" size={11} />3D Secure</span>
                <span className="flex items-center gap-1"><Icon name="MessageSquare" size={11} />SMS</span>
              </div>

              <button onClick={handleConfirm}
                disabled={!codeSent}
                className="w-full py-4 rounded-xl font-bold text-base transition-all hover-scale disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: codeSent ? "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))" : "hsl(220,25%,18%)", color: codeSent ? "hsl(220,30%,8%)" : "#64748b" }}>
                <Icon name="CheckCircle" size={18} />
                ПОДТВЕРДИТЬ ТРАНЗАКЦИЮ
              </button>
            </div>
          </div>
        )}

        {/* ── GATEWAY MODAL ── */}
        {showGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
            <div className="w-full max-w-md rounded-3xl p-8 animate-scale-in"
              style={{ background: "hsl(220,35%,12%)", border: "1px solid rgba(251,191,36,0.25)", boxShadow: "0 25px 80px rgba(0,0,0,0.7)" }}>

              {!txSuccess ? (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{actionType === "pay" ? "💳" : "📥"}</div>
                    <div className="text-xl font-montserrat font-bold text-white">Платёжный шлюз</div>
                    <div className="text-amber-400 font-semibold mt-0.5">Prodamus.pay</div>
                    <div className="text-slate-500 text-sm mt-1">
                      {actionType === "pay" ? "Оплата через" : "Пополнение через"} {bank?.name}
                    </div>
                  </div>

                  <div className="rounded-2xl p-5 mb-5 text-center"
                    style={{ background: "hsl(220,25%,16%)", border: "1px solid rgba(251,191,36,0.12)" }}>
                    <div className="text-slate-400 text-xs mb-1">Сумма платежа</div>
                    <div className="text-3xl font-montserrat font-bold gold-text">{fmt(amountNum || 0)} ₽</div>
                    <div className="text-slate-500 text-xs mt-1">{bank?.name} · Комиссия: 0 ₽</div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-center text-slate-500">
                      {["🔒 SSL/TLS", "🛡️ PCI DSS", "📱 3D Secure", "✅ HTTPS"].map((s) => (
                        <div key={s} className="py-2 rounded-xl" style={{ background: "hsl(220,25%,17%)" }}>{s}</div>
                      ))}
                    </div>
                    <button
                      onClick={() => { setShowGateway(false); setStep(3); }}
                      className="w-full py-3.5 rounded-xl font-bold text-sm hover-scale"
                      style={{ background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))", color: "hsl(220,30%,8%)" }}>
                      Перейти к оплате →
                    </button>
                    <button onClick={() => setShowGateway(false)}
                      className="text-slate-500 text-sm hover:text-slate-300 transition-colors py-1">
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-xl font-montserrat font-bold text-emerald-400 mb-2">Транзакция выполнена!</div>
                  <div className="text-slate-400 text-sm mb-1">SMS-уведомление отправлено</div>
                  <div className="text-slate-500 text-xs">ID: TXN-{Date.now().toString().slice(-8)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUCCESS TOAST ── */}
        {txSuccess && (
          <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in px-6 py-4 rounded-2xl flex items-center gap-3"
            style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", backdropFilter: "blur(12px)" }}>
            <Icon name="CheckCircle" size={20} className="text-emerald-400" />
            <div>
              <div className="text-emerald-400 font-semibold text-sm">Транзакция подтверждена!</div>
              <div className="text-slate-400 text-xs">SMS-уведомление отправлено на ваш номер</div>
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
