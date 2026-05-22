import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/ui/icon";

const faqs = [
  {
    q: "Как вывести деньги на карту?",
    a: "Перейдите в раздел «Вывод средств», выберите банк, укажите номер карты или СБП, введите сумму (минимум 1 000 ₽) и нажмите «Подтвердить транзакцию». Вы получите SMS-уведомление о статусе операции."
  },
  {
    q: "Каков минимальный размер вывода?",
    a: "Минимальная сумма вывода — 1 000 рублей. Это требование установлено для физических лиц согласно условиям работы с платёжными системами."
  },
  {
    q: "Как работает защита PCI DSS?",
    a: "Стандарт PCI DSS (Payment Card Industry Data Security Standard) обеспечивает безопасную обработку данных платёжных карт. Все транзакции шифруются по протоколу SSL/TLS, а 3D Secure добавляет дополнительный уровень подтверждения."
  },
  {
    q: "Что такое P2P-транзакции?",
    a: "P2P (Peer-to-Peer) — это прямые переводы между физическими лицами без посредников. Система автоматически обрабатывает платёж через интегрированный шлюз Prodamus с подтверждением по SMS."
  },
  {
    q: "Сколько времени занимает вывод средств?",
    a: "Вывод на карты Сбербанк и ВТБ обрабатывается в течение 1-24 часов. Переводы через СБП — мгновенно. ЮМани — до 3 рабочих дней."
  },
  {
    q: "Что делать если транзакция завершилась с ошибкой?",
    a: "Проверьте корректность введённых данных и наличие достаточного баланса. Если проблема сохраняется — обратитесь в службу поддержки через чат ниже или по email."
  },
  {
    q: "Как настроить SMS-уведомления?",
    a: "Перейдите в раздел «Настройки», найдите «SMS-уведомления» и включите переключатель. Уведомления будут приходить на номер телефона, указанный в профиле."
  },
  {
    q: "Можно ли изменить данные профиля?",
    a: "Да, в разделе «Профиль» нажмите «Редактировать», внесите изменения и сохраните. Данные защищаются по стандарту SSL/TLS и хранятся в зашифрованном виде."
  },
];

const channels = [
  { emoji: "💬", title: "Онлайн-чат", desc: "Среднее время ответа: 2 мин", status: "Доступен 24/7", color: "text-emerald-400" },
  { emoji: "📧", title: "Email поддержка", desc: "support@example.ru", status: "Ответ за 4 часа", color: "text-blue-400" },
  { emoji: "📞", title: "Телефон", desc: "8-800-000-00-00 (бесплатно)", status: "Пн–Вс 8:00–22:00", color: "text-amber-400" },
  { emoji: "📱", title: "Telegram-бот", desc: "@SupportBot", status: "Автоответ + оператор", color: "text-purple-400" },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Здравствуйте! Я ваш помощник 24/7. Чем могу помочь?" },
  ]);
  const [sending, setSending] = useState(false);

  const now = new Date();

  const sendMessage = () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setChatMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setMessage("");
    setSending(true);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ваш запрос принят. Специалист свяжется с вами в течение нескольких минут. Номер обращения: TKT-" + Math.floor(Math.random() * 90000 + 10000) }
      ]);
      setSending(false);
    }, 1200);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))" }}>
              <Icon name="Headphones" size={20} className="text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-montserrat font-bold text-white">Служба поддержки</h1>
              <p className="text-slate-500 text-sm">Онлайн 24/7 · Поможем с любым вопросом</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Операторы онлайн</span>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3"
          style={{
            background: "linear-gradient(135deg, hsl(220,40%,14%), hsl(225,45%,16%))",
            border: "1px solid rgba(251,191,36,0.2)"
          }}>
          <div className="text-slate-300 text-sm">
            🕐 Текущее время: <span className="text-amber-400 font-semibold font-montserrat">
              {String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")} МСК
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>✓ Чат активен</span>
            <span>✓ Email работает</span>
            <span>✓ База знаний обновлена</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LIVE CHAT */}
          <div className="navy-card rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
            <div className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "hsl(220,30%,13%)" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">Онлайн-чат с поддержкой</span>
              <span className="ml-auto text-slate-500 text-xs">24/7</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: 280 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                    style={msg.from === "user" ? {
                      background: "linear-gradient(135deg, hsl(43,90%,50%), hsl(38,80%,40%))",
                      color: "hsl(220,30%,8%)"
                    } : {
                      background: "hsl(220,25%,18%)",
                      color: "#e2e8f0"
                    }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 text-sm text-slate-400"
                    style={{ background: "hsl(220,25%,18%)" }}>
                    Оператор печатает...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                style={{ background: "hsl(220,25%,18%)", border: "1px solid hsl(220,20%,25%)" }}
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover-scale"
                style={{ background: "linear-gradient(135deg, hsl(43,90%,55%), hsl(38,80%,42%))" }}>
                <Icon name="Send" size={16} className="text-slate-900" />
              </button>
            </div>
          </div>

          {/* CHANNELS */}
          <div className="flex flex-col gap-3">
            {channels.map((ch, i) => (
              <div key={i} className="navy-card rounded-2xl p-4 flex items-center gap-4 hover-scale cursor-pointer transition-all">
                <div className="text-3xl">{ch.emoji}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{ch.title}</div>
                  <div className="text-slate-400 text-xs">{ch.desc}</div>
                </div>
                <div className={`text-xs font-medium ${ch.color}`}>{ch.status}</div>
              </div>
            ))}

            {/* SLA */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
              <div className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <span>⚡</span> Инструменты поддержки
              </div>
              <div className="text-slate-400 text-xs space-y-1">
                <div>✓ Тикетная система обращений</div>
                <div>✓ База знаний с поиском</div>
                <div>✓ Мониторинг в реальном времени</div>
                <div>✓ SLA: ответ менее 15 минут</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="navy-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Icon name="HelpCircle" size={18} className="text-amber-400" />
            <span className="text-white font-semibold">Часто задаваемые вопросы (FAQ)</span>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/2 transition-colors">
                  <span className="text-white text-sm font-medium pr-4">{faq.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-slate-500 flex-shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 animate-fade-in">
                    <div className="text-slate-400 text-sm leading-relaxed rounded-xl px-4 py-3"
                      style={{ background: "hsl(220,25%,16%)", borderLeft: "3px solid hsl(43,90%,50%)" }}>
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "⭐", label: "Оценка поддержки", value: "4.9 / 5" },
            { emoji: "⚡", label: "Среднее время", value: "< 2 мин" },
            { emoji: "✅", label: "Решено сегодня", value: "124" },
            { emoji: "👥", label: "Операторов онлайн", value: "8" },
          ].map((s, i) => (
            <div key={i} className="navy-card rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-white font-bold font-montserrat">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
