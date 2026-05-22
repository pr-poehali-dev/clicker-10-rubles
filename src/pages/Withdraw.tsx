import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const banks = [
  {
    id: "sber",
    name: "Сбербанк",
    logo: "🟢",
    color: "#21A038",
    bg: "rgba(33,160,56,0.1)",
    border: "rgba(33,160,56,0.3)",
    desc: "Карты Visa, Mastercard, МИР",
  },
  {
    id: "vtb",
    name: "ВТБ",
    logo: "🔵",
    color: "#009FDF",
    bg: "rgba(0,159,223,0.1)",
    border: "rgba(0,159,223,0.3)",
    desc: "Карты МИР, Mastercard",
  },
  {
    id: "rshb",
    name: "Россельхозбанк",
    logo: "🌾",
    color: "#009A44",
    bg: "rgba(0,154,68,0.1)",
    border: "rgba(0,154,68,0.3)",
    desc: "Карты МИР, Visa",
  },
  {
    id: "ymoney",
    name: "ЮМани",
    logo: "💜",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.3)",
    desc: "Кошелёк, карты",
  },
];

type WithdrawMethod = "card" | "sbp" | "wallet";

export default function Withdraw() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [method, setMethod] = useState<WithdrawMethod>("card");
  const [amount, setAmount] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [phone, setPhone] = useState("");
  const [walletNum, setWalletNum] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [actionType, setActionType] = useState<"pay" | "topup">("pay");

  const balance = parseFloat(localStorage.getItem("clickerBalance") || "0");
  const formatBalance = (v: number) => new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2 }).format(v);

  const bank = banks.find((b) => b.id === selectedBank);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  };

  const handleGateway = (type: "pay" | "topup") => {
    setActionType(type);
    setShowGateway(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
            <Icon name="CreditCard" size={20} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-white">Вывод средств</h1>
            <p className="text-slate-500 text-sm">P2P-транзакции · Физические лица</p>
          </div>
        </div>

        {/* BALANCE */}
        <div className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, hsl(220,40%,14%), hsl(225,45%,16%))",
            border: "1px solid rgba(251,191,36,0.2)"
          }}>
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Доступно к выводу</div>
            <div className="text-3xl font-montserrat font-bold gold-text">{formatBalance(balance)} ₽</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Мин. сумма вывода</div>
            <div className="text-white font-semibold">1 000 ₽</div>
            <div className={`text-xs mt-1 ${balance >= 1000 ? "text-emerald-400" : "text-rose-400"}`}>
              {balance >= 1000 ? "✓ Доступно" : "✗ Недостаточно"}
            </div>
          </div>
        </div>

        {/* BANK SELECT */}
        <div>
          <div className="text-slate-400 text-sm uppercase tracking-wider mb-3">Выберите банк</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {banks.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBank(b.id)}
                className="navy-card rounded-2xl p-4 text-left transition-all duration-200 hover-scale"
                style={selectedBank === b.id ? {
                  background: b.bg,
                  border: `1px solid ${b.border}`,
                  boxShadow: `0 0 20px ${b.bg}`
                } : {}}
              >
                <div className="text-3xl mb-2">{b.logo}</div>
                <div className="font-semibold text-white text-sm">{b.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{b.desc}</div>
                {selectedBank === b.id && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                      Выбран
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* METHOD + FORM */}
        {selectedBank && (
          <div className="navy-card rounded-2xl p-6 animate-fade-in">
            <div className="text-base font-semibold text-white mb-4">
              Способ вывода — {bank?.name}
            </div>

            {/* Method tabs */}
            <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: "hsl(220,25%,18%)" }}>
              {[
                { key: "card", label: "По номеру карты", icon: "CreditCard" },
                { key: "sbp", label: "СБП", icon: "Smartphone" },
                { key: "wallet", label: "Кошелёк", icon: "Wallet" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key as WithdrawMethod)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    method === m.key
                      ? "text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                  style={method === m.key ? {
                    background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,45%))"
                  } : {}}
                >
                  <Icon name={m.icon} size={14} />
                  <span className="hidden md:inline">{m.label}</span>
                  <span className="md:hidden">{m.label.split(" ").pop()}</span>
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">
                  {method === "card" ? "Номер карты" : method === "sbp" ? "Номер телефона (СБП)" : "Номер кошелька"}
                </label>
                <input
                  value={method === "card" ? cardNum : method === "sbp" ? phone : walletNum}
                  onChange={(e) => method === "card" ? setCardNum(e.target.value) : method === "sbp" ? setPhone(e.target.value) : setWalletNum(e.target.value)}
                  placeholder={method === "card" ? "0000 0000 0000 0000" : method === "sbp" ? "+7 (999) 000-00-00" : "4100 0000 0000"}
                  className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm"
                  style={{ background: "hsl(220,25%,18%)", border: "1px solid rgba(251,191,36,0.2)" }}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Сумма вывода (₽)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Введите сумму"
                  type="number"
                  min="1000"
                  className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm"
                  style={{ background: "hsl(220,25%,18%)", border: "1px solid rgba(251,191,36,0.2)" }}
                />
              </div>

              {/* SSL notice */}
              <div className="px-4 py-3 rounded-xl text-xs text-slate-500 flex items-start gap-2"
                style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)" }}>
                <span>🔒</span>
                <span>Транзакция защищена по протоколам SSL/TLS и 3D Secure. Данные карты шифруются по стандарту PCI DSS. SMS-подтверждение будет отправлено на ваш номер.</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => handleGateway("pay")}
                  className="py-3 rounded-xl font-semibold text-sm transition-all hover-scale"
                  style={{
                    background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))",
                    color: "hsl(220,30%,8%)"
                  }}>
                  💳 ОПЛАТИТЬ
                </button>
                <button
                  onClick={() => handleGateway("topup")}
                  className="py-3 rounded-xl font-semibold text-sm border transition-all hover-scale text-amber-400"
                  style={{ border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.07)" }}>
                  📥 ПОПОЛНИТЬ
                </button>
              </div>

              <button
                onClick={handleConfirm}
                className="py-3.5 rounded-xl font-bold text-sm w-full transition-all hover-scale"
                style={{
                  background: confirmed ? "rgba(52,211,153,0.2)" : "hsl(220,25%,20%)",
                  border: confirmed ? "1px solid rgba(52,211,153,0.4)" : "1px solid hsl(220,20%,28%)",
                  color: confirmed ? "#34d399" : "white"
                }}>
                {confirmed ? "✅ Транзакция подтверждена! SMS отправлено." : "✔ ПОДТВЕРДИТЬ ТРАНЗАКЦИЮ"}
              </button>
            </div>
          </div>
        )}

        {/* GATEWAY MODAL */}
        {showGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
            <div className="w-full max-w-md rounded-3xl p-8 animate-scale-in"
              style={{
                background: "hsl(220,35%,13%)",
                border: "1px solid rgba(251,191,36,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
              }}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{actionType === "pay" ? "💳" : "📥"}</div>
                <div className="text-xl font-montserrat font-bold text-white mb-1">
                  Платёжный шлюз Prodamus
                </div>
                <div className="text-slate-400 text-sm">
                  {actionType === "pay" ? "Оплата через" : "Пополнение через"} {bank?.name}
                </div>
              </div>

              <div className="rounded-xl p-4 mb-4 text-center"
                style={{ background: "hsl(220,25%,18%)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <div className="text-slate-400 text-xs mb-1">Сумма</div>
                <div className="text-2xl font-montserrat font-bold gold-text">{amount || "0"} ₽</div>
                <div className="text-slate-500 text-xs mt-1">{bank?.name} · {method === "card" ? "По карте" : method === "sbp" ? "СБП" : "Кошелёк"}</div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="text-xs text-center text-slate-500 flex items-center justify-center gap-2">
                  <span>🔒</span>
                  Защита SSL/TLS · PCI DSS · 3D Secure
                </div>
                <button
                  onClick={() => setShowGateway(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))",
                    color: "hsl(220,30%,8%)"
                  }}>
                  Подтвердить и перейти к оплате →
                </button>
                <button
                  onClick={() => setShowGateway(false)}
                  className="w-full py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* P2P INFO */}
        <div className="navy-card rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Icon name="Info" size={16} className="text-amber-400" />
            P2P-транзакции для физических лиц
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: "🔐", title: "HTTPS протокол", desc: "Все транзакции передаются по защищённому каналу HTTPS" },
              { icon: "📱", title: "SMS-уведомления", desc: "Мгновенное уведомление о каждой операции на ваш телефон" },
              { icon: "🏦", title: "Интеграция банков", desc: "Прямая интеграция с банками через модуль CMS Prodamus" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "hsl(220,25%,18%)" }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white text-sm font-medium mb-1">{item.title}</div>
                <div className="text-slate-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
