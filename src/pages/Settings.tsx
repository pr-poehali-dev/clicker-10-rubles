import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

export default function Settings() {
  const [smsNotif, setSmsNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [autoWithdraw, setAutoWithdraw] = useState(false);
  const [withdrawLimit, setWithdrawLimit] = useState("50000");
  const [sources, setSources] = useState({ direct: true, sbp: true, card: true, wallet: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
      style={{ background: value ? "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,40%))" : "hsl(220,20%,25%)" }}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow ${value ? "left-5" : "left-0.5"}`} />
    </button>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
            <Icon name="Settings" size={20} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-white">Настройки</h1>
            <p className="text-slate-500 text-sm">Безопасность, уведомления, платёжные лимиты</p>
          </div>
        </div>

        {/* SECURITY */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="ShieldCheck" size={18} className="text-emerald-400" />
            <span className="text-base font-semibold text-white">Безопасность аккаунта</span>
          </div>

          {/* Security standards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "PCI DSS", status: "Активно", icon: "🔐", color: "text-emerald-400" },
              { label: "3D Secure", status: "Активно", icon: "🛡️", color: "text-emerald-400" },
              { label: "SSL/TLS", status: "Активно", icon: "🔒", color: "text-emerald-400" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)" }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-white text-xs font-semibold">{s.label}</div>
                <div className={`text-xs mt-0.5 ${s.color}`}>{s.status}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                icon: "Smartphone", label: "SMS-уведомления",
                desc: "Получать SMS при каждой транзакции",
                value: smsNotif, onChange: setSmsNotif
              },
              {
                icon: "Mail", label: "Email-уведомления",
                desc: "Уведомления о входе и операциях на email",
                value: emailNotif, onChange: setEmailNotif
              },
              {
                icon: "KeyRound", label: "Двухфакторная аутентификация",
                desc: "Подтверждение входа по SMS",
                value: twoFactor, onChange: setTwoFactor
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "hsl(220,25%,16%)", border: "1px solid hsl(220,20%,22%)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(220,25%,20%)" }}>
                    <Icon name={item.icon} size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{item.label}</div>
                    <div className="text-slate-500 text-xs">{item.desc}</div>
                  </div>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT SETTINGS */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="CreditCard" size={18} className="text-amber-400" />
            <span className="text-base font-semibold text-white">Платёжные настройки</span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">
                Дневной лимит вывода (₽)
              </label>
              <input
                value={withdrawLimit}
                onChange={(e) => setWithdrawLimit(e.target.value)}
                type="number"
                className="w-full rounded-xl px-4 py-3 text-white outline-none text-sm"
                style={{ background: "hsl(220,25%,18%)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              <div className="text-slate-500 text-xs mt-1">
                Максимальная сумма вывода в сутки. Лимит устанавливается согласно политике безопасности.
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: "hsl(220,25%,16%)", border: "1px solid hsl(220,20%,22%)" }}>
              <div>
                <div className="text-white text-sm font-medium">Автоматический вывод</div>
                <div className="text-slate-500 text-xs">Выводить при достижении минимальной суммы</div>
              </div>
              <Toggle value={autoWithdraw} onChange={setAutoWithdraw} />
            </div>
          </div>
        </div>

        {/* SOURCE CONTROL */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="Globe" size={18} className="text-blue-400" />
            <span className="text-base font-semibold text-white">Контроль источников загрузки</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { key: "direct", label: "Прямые транзакции", desc: "Банковские переводы напрямую" },
              { key: "sbp", label: "СБП (Система быстрых платежей)", desc: "Переводы по номеру телефона" },
              { key: "card", label: "Карточные операции", desc: "Visa, Mastercard, МИР" },
              { key: "wallet", label: "Электронные кошельки", desc: "ЮМани и другие кошельки" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "hsl(220,25%,16%)", border: "1px solid hsl(220,20%,22%)" }}>
                <div>
                  <div className="text-white text-sm font-medium">{item.label}</div>
                  <div className="text-slate-500 text-xs">{item.desc}</div>
                </div>
                <Toggle
                  value={sources[item.key as keyof typeof sources]}
                  onChange={(v) => setSources({ ...sources, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="navy-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Icon name="Lock" size={18} className="text-amber-400" />
            <span className="text-base font-semibold text-white">Смена пароля</span>
          </div>
          <div className="grid gap-3">
            {["Текущий пароль", "Новый пароль", "Подтвердите пароль"].map((label, i) => (
              <div key={i}>
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                  style={{ background: "hsl(220,25%,18%)", border: "1px solid hsl(220,20%,25%)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all hover-scale"
          style={saved ? {
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.3)",
            color: "#34d399"
          } : {
            background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))",
            color: "hsl(220,30%,8%)"
          }}>
          {saved ? "✅ Настройки сохранены автоматически!" : "Сохранить настройки"}
        </button>

      </div>
    </Layout>
  );
}
