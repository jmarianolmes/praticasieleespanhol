import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Download, RotateCcw } from "lucide-react";
import { MERCANCIAS_EXAM, MERCANCIAS_EXAM_META } from "@/data/mercanciasExam";

const STORAGE_KEY = "siele-pratica-casa-exam-2026-09-26-mercancias";

type Props = { onExit: () => void };

function loadAnswers(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function MercanciasExam({ onExit }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>(() => loadAnswers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const question = MERCANCIAS_EXAM[currentIndex] ?? MERCANCIAS_EXAM[0];
  const answeredCount = useMemo(() => MERCANCIAS_EXAM.filter((item) => Boolean(answers[item.number])).length, [answers]);
  const scoredAnswered = useMemo(() => MERCANCIAS_EXAM.filter((item) => item.isScored && Boolean(answers[item.number])).length, [answers]);
  const correctCount = useMemo(() => MERCANCIAS_EXAM.filter((item) => item.isScored && answers[item.number] === item.correctOption).length, [answers]);
  const scorePercent = Math.round((correctCount / MERCANCIAS_EXAM_META.scoredQuestions) * 100);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const selectAnswer = (letter: string) => {
    setAnswers((current) => ({ ...current, [question.number]: letter }));
    setSubmitted(false);
  };

  const reset = () => {
    if (!window.confirm("Apagar todas as respostas deste exame e começar novamente?")) return;
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const downloadReport = () => {
    const report = {
      exam: MERCANCIAS_EXAM_META,
      answers,
      scored: { correct: correctCount, total: MERCANCIAS_EXAM_META.scoredQuestions, percent: scorePercent },
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "2026-09-26_MERCANCIAS_respostas.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="min-h-screen bg-[#f1f1f1] text-[#333]" style={{ fontFamily: "Lato, Arial, sans-serif" }}>
    <header className="border-b border-[#263746] bg-[#34404d]"><div className="mx-auto flex min-h-[74px] max-w-[1180px] items-center justify-between gap-4 px-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Exames originais</p><h1 className="mt-1 text-lg font-black text-white">CAP Mercancías</h1></div><button onClick={onExit} className="inline-flex items-center gap-2 rounded border border-white/30 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/10"><ArrowLeft size={14} /> Voltar aos exames</button></div></header>
    <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded border border-[#c9c9c9] bg-white px-4 py-4"><div><p className="text-[11px] font-bold uppercase tracking-wide text-[#6a6a6a]">{MERCANCIAS_EXAM_META.title}</p><p className="mt-1 text-xs text-[#555]">{MERCANCIAS_EXAM_META.subtitle} · {MERCANCIAS_EXAM_META.totalQuestions} perguntas</p></div><div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded bg-[#e8f3ee] px-3 py-2 text-[#28755e]">{answeredCount}/103 respondidas</span><span className="rounded bg-[#fffaf0] px-3 py-2 text-[#7a5d16]">1–100 pontuadas</span><span className="rounded bg-[#f3eeee] px-3 py-2 text-[#8b4a4a]">101–103 reservas</span></div></div>
      <section className="border border-[#c8c8c8] bg-white shadow-sm"><div className="border-b-4 border-[#b08b2c] bg-[#292929] px-5 py-3 text-sm font-bold text-white">Questão {question.number} de 103 {question.isReserve ? "· reserva" : "· entra na avaliação"}</div><div className="p-5 sm:p-9"><div className="mb-5 border-l-4 border-[#b08b2c] bg-[#fffaf0] p-4 text-sm leading-6"><span className="mr-3 font-bold text-[#9a781f]">{String(question.number).padStart(3, "0")}</span>{question.prompt}</div><div className="space-y-2">{question.options.map((option, index) => { const letter = "ABCD"[index]; const selected = answers[question.number] === letter; return <label key={letter} className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-sm leading-6 transition ${selected ? "border-[#34404d] bg-[#edf2f5] font-bold" : "border-[#e2e2e2] hover:bg-[#fafafa]"}`}><input type="radio" name={`mercancias-${question.number}`} checked={selected} onChange={() => selectAnswer(letter)} className="mt-1" /><span className="font-bold text-[#9a781f]">{letter})</span><span>{option}</span></label>; })}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#d0d0d0] pt-5"><button disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} className="rounded border border-[#bbb] px-4 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40">← Anterior</button><span className="text-xs text-[#666]">{currentIndex + 1} / 103</span><button disabled={currentIndex === MERCANCIAS_EXAM.length - 1} onClick={() => setCurrentIndex((index) => Math.min(MERCANCIAS_EXAM.length - 1, index + 1))} className="rounded bg-[#34404d] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Próxima →</button></div></div></section>
      <section className="mt-5 border border-[#c9c9c9] bg-white p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wide text-[#666]">Navegação por numeração original</p><p className="mt-1 text-xs text-[#666]">As três reservas ficam visíveis, mas não entram no fechamento.</p></div><div className="flex gap-2"><button onClick={reset} className="inline-flex items-center gap-1 rounded border border-[#bbb] px-3 py-2 text-xs font-bold"><RotateCcw size={13} /> Recomeçar</button><button onClick={() => setSubmitted(true)} className="inline-flex items-center gap-1 rounded bg-[#a50046] px-3 py-2 text-xs font-bold text-white"><Check size={13} /> Fechar avaliação</button></div></div><div className="mt-5 grid grid-cols-8 gap-2 sm:grid-cols-13">{MERCANCIAS_EXAM.map((item, index) => <button key={item.number} onClick={() => setCurrentIndex(index)} className={`relative rounded border px-1 py-2 text-[10px] font-bold transition ${index === currentIndex ? "border-[#34404d] bg-[#34404d] text-white" : answers[item.number] ? "border-[#a8c9bd] bg-[#e8f3ee] text-[#28755e]" : "border-[#ccc] bg-[#fafafa] text-[#555] hover:border-[#b08b2c]"}`}>{item.number}{item.isReserve ? <span className="absolute -right-1 -top-2 text-[8px] text-[#a50046]">R</span> : null}</button>)}</div>{submitted && <div className="mt-6 border border-[#a8c9bd] bg-[#e8f3ee] p-5"><p className="text-[11px] font-bold uppercase tracking-wide text-[#28755e]">Resultado orientativo</p><p className="mt-2 text-2xl font-black text-[#34404d]">{correctCount}/{MERCANCIAS_EXAM_META.scoredQuestions} · {scorePercent}%</p><p className="mt-2 text-xs leading-5 text-[#555]">Cálculo feito somente com as questões 1–100. As questões 101–103 são reservas e foram excluídas.</p><button onClick={downloadReport} className="mt-4 inline-flex items-center gap-2 rounded bg-[#28755e] px-4 py-2 text-xs font-bold text-white"><Download size={14} /> Baixar respostas JSON</button></div>}</section>
    </main><footer className="mt-10 bg-[#34404d] px-5 py-5 text-center text-xs text-white/80">Material de prática · gabarito da plantilla recebida · não é uma nota oficial</footer>
  </div>;
}
