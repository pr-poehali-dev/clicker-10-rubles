import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/Layout";

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
}

export default function Index() {
  const [balance, setBalance] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [bouncing, setBouncing] = useState(false);
  const [now, setNow] = useState(new Date());
  const [bonus, setBonus] = useState(false);
  const [bonusTimer, setBonusTimer] = useState(0);
  const coinId = useRef(0);
  const clickStreakRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bonusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isClickingRef = useRef(false);
  const clickStartRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("clickerBalance");
    const savedClicks = localStorage.getItem("clickerClicks");
    if (saved) setBalance(parseFloat(saved));
    if (savedClicks) setClicks(parseInt(savedClicks));
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const formatDateTime = () => {
    const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    const days = ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];
    return {
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      date: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} г.`,
      day: days[now.getDay()],
    };
  };

  const { time, date, day } = formatDateTime();

  const triggerBonus = useCallback((currentBalance: number, currentClicks: number) => {
    const bonusAmount = 5000000;
    const newBalance = currentBalance + bonusAmount;
    const newClicks = currentClicks;
    setBalance(newBalance);
    localStorage.setItem("clickerBalance", String(newBalance));
    setBonus(true);
    isClickingRef.current = false;
    if (bonusIntervalRef.current) clearInterval(bonusIntervalRef.current);
    setBonusTimer(0);
    setTimeout(() => setBonus(false), 3000);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const newBalance = balance + 10;
    const newClicks = clicks + 1;
    setBalance(newBalance);
    setClicks(newClicks);
    localStorage.setItem("clickerBalance", String(newBalance));
    localStorage.setItem("clickerClicks", String(newClicks));

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++coinId.current;
    setFloatingCoins((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setFloatingCoins((prev) => prev.filter((c) => c.id !== id)), 800);

    setBouncing(true);
    setTimeout(() => setBouncing(false), 200);

    if (!isClickingRef.current) {
      isClickingRef.current = true;
      clickStartRef.current = Date.now();
      setBonusTimer(10);

      bonusIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - clickStartRef.current) / 1000);
        const remaining = 10 - elapsed;
        if (remaining <= 0) {
          if (bonusIntervalRef.current) clearInterval(bonusIntervalRef.current);
          setBalance((prev) => {
            const nb = prev + 5000000;
            localStorage.setItem("clickerBalance", String(nb));
            return nb;
          });
          setBonus(true);
          isClickingRef.current = false;
          setBonusTimer(0);
          setTimeout(() => setBonus(false), 3000);
        } else {
          setBonusTimer(remaining);
        }
      }, 1000);
    }

    if (clickStreakRef.current) clearTimeout(clickStreakRef.current);
    clickStreakRef.current = setTimeout(() => {
      isClickingRef.current = false;
      if (bonusIntervalRef.current) clearInterval(bonusIntervalRef.current);
      setBonusTimer(0);
    }, 2000);
  }, [balance, clicks, triggerBonus]);

  const formatBalance = (val: number) =>
    new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] pb-20 md:pb-6 flex flex-col gap-6 animate-fade-in">

        {/* DATETIME + STATUS */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="navy-card rounded-2xl px-5 py-4">
            <div className="text-3xl font-montserrat font-bold tracking-widest gold-text tabular-nums">
              {time}
            </div>
            <div className="text-slate-300 text-sm mt-1 font-medium">{date}</div>
            <div className="text-slate-500 text-xs mt-0.5 capitalize">{day}</div>
          </div>

          <div className="navy-card rounded-2xl px-5 py-4 text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Статус системы</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-semibold">Онлайн</span>
            </div>
            <div className="text-slate-500 text-xs mt-1">Защита SSL активна 🔒</div>
          </div>
        </div>

        {/* BALANCE CARD */}
        <div className="rounded-3xl p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(220,40%,14%) 0%, hsl(225,45%,16%) 50%, hsl(220,40%,13%) 100%)",
            border: "1px solid rgba(251,191,36,0.25)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,191,36,0.1)"
          }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-5 pointer-events-none"
            style={{ background: "radial-gradient(circle, #fbbf24, transparent)", transform: "translate(-30%, 30%)" }} />

          <div className="relative">
            <div className="text-slate-400 text-sm uppercase tracking-[0.2em] font-medium mb-3">
              Текущий баланс
            </div>
            <div className={`font-montserrat font-bold text-5xl md:text-6xl gold-text leading-tight ${bouncing ? "animate-scale-in" : ""}`}>
              {formatBalance(balance)} ₽
            </div>
            <div className="text-slate-500 text-sm mt-2">
              ≈ {new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance / 92)} USD
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { label: "Кликов", value: clicks.toLocaleString("ru-RU") },
              { label: "За клик", value: "10 ₽" },
              { label: "Мин. вывод", value: "1 000 ₽" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl font-bold text-white font-montserrat">{s.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CLICKER BUTTON */}
        <div className="flex flex-col items-center gap-4">

          {/* Bonus notification */}
          {bonus && (
            <div className="animate-scale-in px-6 py-3 rounded-2xl text-center"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)" }}>
              <div className="text-emerald-400 font-montserrat font-black text-xl">🎉 +5 000 000 ₽</div>
              <div className="text-emerald-500 text-xs mt-0.5">Бонус за 10 секунд непрерывных кликов!</div>
            </div>
          )}

          {/* Timer ring */}
          {bonusTimer > 0 && !bonus && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-amber-400 font-montserrat font-bold text-sm animate-pulse">
                ⚡ Бонус через {bonusTimer} сек
              </div>
              <div className="w-48 h-2 rounded-full overflow-hidden bg-slate-700">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${((10 - bonusTimer) / 10) * 100}%`,
                    background: "linear-gradient(90deg, hsl(43,90%,45%), hsl(43,90%,65%))"
                  }} />
              </div>
              <div className="text-slate-500 text-xs">+5 000 000 ₽ за непрерывные клики</div>
            </div>
          )}

          <div className="relative">
            {/* SVG progress ring around button */}
            {bonusTimer > 0 && !bonus && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 196 196">
                <circle cx="98" cy="98" r="92" fill="none" stroke="rgba(251,191,36,0.15)" strokeWidth="4" />
                <circle cx="98" cy="98" r="92" fill="none" stroke="hsl(43,90%,55%)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 92}`}
                  strokeDashoffset={`${2 * Math.PI * 92 * (bonusTimer / 10)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }} />
              </svg>
            )}
            <button
              onClick={handleClick}
              className="relative w-44 h-44 rounded-full cursor-pointer select-none active:scale-95 transition-transform duration-75 click-ring flex items-center justify-center"
              style={{
                background: bonusTimer > 0 && !bonus
                  ? "linear-gradient(145deg, hsl(43,95%,62%) 0%, hsl(38,85%,50%) 60%, hsl(33,90%,44%) 100%)"
                  : "linear-gradient(145deg, hsl(43,90%,58%) 0%, hsl(38,80%,45%) 60%, hsl(33,85%,40%) 100%)",
                boxShadow: bonusTimer > 0 && !bonus
                  ? "0 8px 40px rgba(251,191,36,0.6), 0 2px 8px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.2)"
                  : "0 8px 32px rgba(251,191,36,0.35), 0 2px 8px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.2)",
              }}
            >
              <div className="flex flex-col items-center gap-1 select-none">
                <span className="text-5xl">💰</span>
                <span className="text-slate-900 font-montserrat font-black text-lg leading-none tracking-tight">+10 ₽</span>
              </div>

              {floatingCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="absolute pointer-events-none animate-coin-float font-bold text-amber-300 text-lg font-montserrat"
                  style={{ left: coin.x - 20, top: coin.y - 20, zIndex: 10 }}
                >
                  +10₽
                </div>
              ))}
            </button>
          </div>
          <p className="text-slate-500 text-sm text-center">
            Нажмите — каждый клик приносит <span className="text-amber-400 font-semibold">10 ₽</span>
            {" · "}
            <span className="text-emerald-400 font-semibold">10 сек = +5 000 000 ₽</span>
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="navy-card rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-300 text-sm font-medium">До минимального вывода (1 000 ₽)</span>
            <span className="text-amber-400 font-semibold text-sm font-montserrat">
              {Math.min(100, (balance / 1000 * 100)).toFixed(1)}%
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden bg-slate-700">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (balance / 1000 * 100))}%`,
                background: "linear-gradient(90deg, hsl(43,90%,40%) 0%, hsl(43,90%,60%) 100%)"
              }}
            />
          </div>
          <div className="text-slate-500 text-xs mt-2">
            {balance >= 1000
              ? "✅ Минимальная сумма достигнута — можно выводить средства!"
              : `Ещё ${formatBalance(1000 - balance)} ₽ до минимальной суммы вывода`}
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "📈", label: "Заработано", value: `${formatBalance(balance)} ₽`, color: "text-emerald-400" },
            { emoji: "🖱️", label: "Всего кликов", value: clicks.toLocaleString("ru-RU"), color: "text-blue-400" },
            { emoji: "⚡", label: "Курс", value: "10 ₽/клик", color: "text-amber-400" },
            { emoji: "🏦", label: "Доступно к выводу", value: balance >= 1000 ? `${formatBalance(balance)} ₽` : "Нет", color: balance >= 1000 ? "text-emerald-400" : "text-slate-500" },
          ].map((stat, i) => (
            <div key={i} className="navy-card rounded-2xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className={`font-bold font-montserrat text-base ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}