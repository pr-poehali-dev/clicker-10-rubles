import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const transactions = [
  { id: "TXN-20260522-001", userId: "USR-001", type: "income", label: "Начисление (кликер)", amount: 250, date: "22.05.2026 14:32:01", status: "success", bank: "—" },
  { id: "TXN-20260521-008", userId: "USR-001", type: "withdrawal", label: "Вывод на Сбербанк", amount: -1000, date: "21.05.2026 10:15:44", status: "success", bank: "Сбербанк" },
  { id: "TXN-20260520-015", userId: "USR-001", type: "income", label: "Начисление (кликер)", amount: 480, date: "20.05.2026 18:44:22", status: "success", bank: "—" },
  { id: "TXN-20260519-003", userId: "USR-001", type: "withdrawal", label: "Вывод на ВТБ", amount: -500, date: "19.05.2026 09:00:10", status: "pending", bank: "ВТБ" },
  { id: "TXN-20260518-022", userId: "USR-001", type: "income", label: "Начисление (кликер)", amount: 1200, date: "18.05.2026 16:20:55", status: "success", bank: "—" },
  { id: "TXN-20260517-011", userId: "USR-001", type: "withdrawal", label: "Вывод ЮМани", amount: -800, date: "17.05.2026 12:05:33", status: "success", bank: "ЮМани" },
  { id: "TXN-20260516-005", userId: "USR-001", type: "refund", label: "Возврат средств", amount: 300, date: "16.05.2026 08:45:00", status: "success", bank: "Сбербанк" },
  { id: "TXN-20260515-009", userId: "USR-001", type: "cancelled", label: "Отмена операции", amount: -200, date: "15.05.2026 22:10:17", status: "cancelled", bank: "—" },
];

const typeLabels: Record<string, string> = {
  income: "Начисление",
  withdrawal: "Вывод",
  refund: "Возврат",
  cancelled: "Отмена",
};

const typeColors: Record<string, string> = {
  income: "text-emerald-400",
  withdrawal: "text-rose-400",
  refund: "text-blue-400",
  cancelled: "text-slate-500",
};

const statusColors: Record<string, string> = {
  success: "text-emerald-400",
  pending: "text-amber-400",
  cancelled: "text-slate-500",
};

const statusLabels: Record<string, string> = {
  success: "Выполнено",
  pending: "В обработке",
  cancelled: "Отменено",
};

export default function History() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) && !tx.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalOut = Math.abs(transactions.filter(t => t.amount < 0 && t.status !== "cancelled").reduce((a, t) => a + t.amount, 0));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
            <Icon name="ClipboardList" size={20} className="text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-montserrat font-bold text-white">История транзакций</h1>
            <p className="text-slate-500 text-sm">База данных операций · HTTPS шифрование</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "📊", label: "Всего операций", value: String(transactions.length), color: "text-white" },
            { emoji: "📈", label: "Поступило", value: `+${totalIncome.toLocaleString("ru-RU")} ₽`, color: "text-emerald-400" },
            { emoji: "📤", label: "Выведено", value: `-${totalOut.toLocaleString("ru-RU")} ₽`, color: "text-rose-400" },
            { emoji: "⏳", label: "В обработке", value: String(transactions.filter(t => t.status === "pending").length), color: "text-amber-400" },
          ].map((s, i) => (
            <div key={i} className="navy-card rounded-2xl p-4">
              <div className="text-2xl mb-2">{s.emoji}</div>
              <div className={`font-bold font-montserrat text-lg ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ID или описанию..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            style={{ background: "hsl(220,25%,14%)", border: "1px solid hsl(220,20%,22%)" }}
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "income", "withdrawal", "refund", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filter === f ? "text-slate-900 font-semibold" : "text-slate-400 hover:text-white"
                }`}
                style={filter === f ? {
                  background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,45%))"
                } : { background: "hsl(220,25%,14%)", border: "1px solid hsl(220,20%,22%)" }}
              >
                {f === "all" ? "Все" : typeLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="navy-card rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 text-xs uppercase tracking-wider text-slate-500"
            style={{ borderBottom: "1px solid hsl(220,20%,20%)" }}>
            <div className="col-span-3">ID транзакции</div>
            <div className="col-span-3">Описание</div>
            <div className="col-span-2">Тип</div>
            <div className="col-span-2">Сумма</div>
            <div className="col-span-1">Статус</div>
            <div className="col-span-1">Банк</div>
          </div>

          <div className="flex flex-col">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-500">Транзакций не найдено</div>
            )}
            {filtered.map((tx, i) => (
              <div key={tx.id}
                className="grid md:grid-cols-12 gap-2 px-5 py-4 transition-colors hover:bg-white/2"
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                {/* Mobile view */}
                <div className="md:hidden flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">{tx.label}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{tx.id}</div>
                    <div className="text-slate-500 text-xs">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold font-montserrat ${tx.amount > 0 ? "text-emerald-400" : tx.status === "cancelled" ? "text-slate-500" : "text-rose-400"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className={`text-xs ${statusColors[tx.status]}`}>{statusLabels[tx.status]}</div>
                  </div>
                </div>

                {/* Desktop view */}
                <div className="hidden md:flex md:col-span-3 items-center">
                  <span className="font-mono text-xs text-amber-400/80">{tx.id}</span>
                </div>
                <div className="hidden md:flex md:col-span-3 items-center">
                  <div>
                    <div className="text-white text-sm">{tx.label}</div>
                    <div className="text-slate-500 text-xs">{tx.date}</div>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-2 items-center">
                  <span className={`text-xs ${typeColors[tx.type]}`}>{typeLabels[tx.type]}</span>
                </div>
                <div className="hidden md:flex md:col-span-2 items-center">
                  <span className={`font-bold font-montserrat text-sm ${tx.amount > 0 ? "text-emerald-400" : tx.status === "cancelled" ? "text-slate-500" : "text-rose-400"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center">
                  <span className={`text-xs ${statusColors[tx.status]}`}>{statusLabels[tx.status]}</span>
                </div>
                <div className="hidden md:flex md:col-span-1 items-center">
                  <span className="text-slate-500 text-xs">{tx.bank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DB STRUCTURE INFO */}
        <div className="navy-card rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Icon name="Database" size={16} className="text-amber-400" />
            Структура базы данных транзакций
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { field: "transaction_id", type: "VARCHAR(30) PK", desc: "Уникальный идентификатор транзакции" },
              { field: "user_id", type: "VARCHAR(20) FK", desc: "Идентификатор пользователя" },
              { field: "type", type: "ENUM", desc: "Тип: income / withdrawal / refund / cancel" },
              { field: "amount", type: "DECIMAL(15,2)", desc: "Сумма транзакции в рублях" },
              { field: "status", type: "ENUM", desc: "Статус: success / pending / cancelled" },
              { field: "created_at", type: "DATETIME", desc: "Дата и время создания операции" },
            ].map((col, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: "hsl(220,25%,16%)" }}>
                <div className="font-mono text-amber-400 text-xs shrink-0 mt-0.5">{col.field}</div>
                <div>
                  <div className="text-blue-300 text-xs font-mono">{col.type}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{col.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
            <span>🔐</span>
            Все данные передаются по протоколу HTTPS. Хранение в зашифрованной базе данных.
          </div>
        </div>

      </div>
    </Layout>
  );
}
