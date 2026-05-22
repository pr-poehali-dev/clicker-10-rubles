import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const initialProfile = {
  firstName: "Иван",
  lastName: "Петров",
  middleName: "Сергеевич",
  phone: "+7 (999) 123-45-67",
  email: "ivan.petrov@example.com",
  city: "Москва",
  avatar: "",
};

const mockHistory = [
  { id: "TXN-001", type: "Начисление", amount: "+250 ₽", date: "22.05.2026 14:32", status: "success" },
  { id: "TXN-002", type: "Вывод на Сбербанк", amount: "-1 000 ₽", date: "21.05.2026 10:15", status: "success" },
  { id: "TXN-003", type: "Начисление", amount: "+480 ₽", date: "20.05.2026 18:44", status: "success" },
  { id: "TXN-004", type: "Вывод на ВТБ", amount: "-500 ₽", date: "19.05.2026 09:00", status: "pending" },
];

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setProfile((p) => ({ ...p, avatar: result }));
      setDraft((p) => ({ ...p, avatar: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const balance = parseFloat(localStorage.getItem("clickerBalance") || "0");
  const clicks = parseInt(localStorage.getItem("clickerClicks") || "0");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
            <Icon name="User" size={20} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-white">Профиль пользователя</h1>
            <p className="text-slate-500 text-sm">Персональные данные и статистика</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* LEFT — AVATAR + SECURITY */}
          <div className="flex flex-col gap-4">
            {/* Avatar */}
            <div className="navy-card rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl relative"
                style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:brightness-125 transition-all"
                  style={{ background: "hsl(220,30%,20%)", border: "2px solid hsl(220,30%,12%)" }}
                  title="Сменить фото">
                  <Icon name="Camera" size={14} className="text-amber-400" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{profile.lastName} {profile.firstName}</div>
                <div className="text-slate-500 text-sm">{profile.email}</div>
              </div>
              <div className="w-full pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">ID пользователя</div>
                <div className="font-mono text-amber-400 text-sm bg-slate-800/50 rounded-lg px-3 py-2">
                  USR-20260522-0001
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="navy-card rounded-2xl p-5">
              <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon name="ShieldCheck" size={16} className="text-emerald-400" />
                Безопасность
              </div>
              {[
                { label: "SSL/TLS шифрование", ok: true },
                { label: "PCI DSS стандарт", ok: true },
                { label: "3D Secure", ok: true },
                { label: "SMS-уведомления", ok: false },
                { label: "Двухфакторная защита", ok: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2"
                  style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span className="text-slate-400 text-xs">{item.label}</span>
                  <span className={`text-xs font-medium ${item.ok ? "text-emerald-400" : "text-slate-500"}`}>
                    {item.ok ? "✓ Активно" : "Выкл."}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — FORM + STATS */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Personal data */}
            <div className="navy-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-base font-semibold text-white">Персональные данные</div>
                {!editing ? (
                  <button onClick={() => { setDraft(profile); setEditing(true); }}
                    className="flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300 transition-colors">
                    <Icon name="Pencil" size={14} />
                    Редактировать
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)}
                      className="text-slate-500 text-sm hover:text-slate-300 transition-colors px-3 py-1 rounded-lg border border-slate-600">
                      Отмена
                    </button>
                    <button onClick={handleSave}
                      className="text-sm px-4 py-1 rounded-lg font-medium transition-colors"
                      style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))", color: "hsl(220,30%,8%)" }}>
                      Сохранить
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="mb-4 px-4 py-2 rounded-xl text-emerald-400 text-sm flex items-center gap-2"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  <Icon name="CheckCircle" size={16} />
                  Данные успешно сохранены
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "lastName", label: "Фамилия" },
                  { key: "firstName", label: "Имя" },
                  { key: "middleName", label: "Отчество" },
                  { key: "city", label: "Город" },
                  { key: "phone", label: "Телефон" },
                  { key: "email", label: "Email" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
                    {editing ? (
                      <input
                        value={draft[key as keyof typeof draft]}
                        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                        className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                        style={{
                          background: "hsl(220,25%,18%)",
                          border: "1px solid rgba(251,191,36,0.3)",
                        }}
                      />
                    ) : (
                      <div className="text-white text-sm px-4 py-2.5 rounded-xl"
                        style={{ background: "hsl(220,20%,16%)", border: "1px solid hsl(220,20%,22%)" }}>
                        {profile[key as keyof typeof profile] || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 px-4 py-3 rounded-xl text-xs text-slate-500 flex items-start gap-2"
                style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.1)" }}>
                <Icon name="Lock" size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                Персональные данные защищены по протоколу SSL/TLS и шифруются согласно стандартам PCI DSS. Передача данных осуществляется по защищённому каналу HTTPS.
              </div>
            </div>

            {/* Stats */}
            <div className="navy-card rounded-2xl p-6">
              <div className="text-base font-semibold text-white mb-4">Статистика аккаунта</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { emoji: "💰", label: "Баланс", value: `${new Intl.NumberFormat("ru-RU",{minimumFractionDigits:2}).format(balance)} ₽`, color: "text-amber-400" },
                  { emoji: "🖱️", label: "Кликов", value: clicks.toLocaleString("ru-RU"), color: "text-blue-400" },
                  { emoji: "📤", label: "Выведено", value: "1 500 ₽", color: "text-emerald-400" },
                  { emoji: "📅", label: "Дней активности", value: "3", color: "text-purple-400" },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3 text-center"
                    style={{ background: "hsl(220,25%,18%)" }}>
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className={`font-bold font-montserrat text-sm ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent history */}
            <div className="navy-card rounded-2xl p-6">
              <div className="text-base font-semibold text-white mb-4">Последние операции</div>
              <div className="flex flex-col gap-2">
                {mockHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                    style={{ background: "hsl(220,25%,18%)" }}>
                    <div>
                      <div className="text-sm text-white font-medium">{tx.type}</div>
                      <div className="text-xs text-slate-500">{tx.date} · {tx.id}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold font-montserrat text-sm ${tx.amount.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                        {tx.amount}
                      </div>
                      <div className={`text-xs ${tx.status === "success" ? "text-emerald-500" : "text-amber-500"}`}>
                        {tx.status === "success" ? "Выполнено" : "В обработке"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}