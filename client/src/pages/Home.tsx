import { useState } from "react";
import { BookOpen, ExternalLink, FileText, Play, Pencil, RotateCcw } from "lucide-react";
import ReadingExam, { type ReadingAttemptAnswer } from "@/components/ReadingExam";
import MercanciasExam from "@/components/MercanciasExam";
import readingExamData from "@/data/readingExamData.json";

type Mode = "home" | "reading" | "mercancias";
const STORAGE_KEY = "siele-leitura-editor-v2";

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  const [readingStartMode, setReadingStartMode] = useState<"edit" | "take">("edit");
  const [saved, setSaved] = useState<ReadingAttemptAnswer[] | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw).answers as ReadingAttemptAnswer[]) : null;
    } catch {
      return null;
    }
  });

  const startReading = (startMode: "edit" | "take") => {
    setReadingStartMode(startMode);
    setMode("reading");
  };
  const completeReading = (answers: ReadingAttemptAnswer[]) => {
    setSaved(answers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, finishedAt: new Date().toISOString() }));
  };
  const resetReading = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setMode("home");
  };

  if (mode === "reading") return <ReadingExam initialQuestions={readingExamData as ReadingAttemptAnswer[]} initialMode={readingStartMode} onComplete={completeReading} />;
  if (mode === "mercancias") return <MercanciasExam onExit={() => setMode("home")} />;

  return <div className="min-h-screen bg-[#f1f1f1] text-[#333]" style={{ fontFamily: "Lato, Arial, sans-serif" }}>
    <header className="border-b border-[#263746] bg-[#34404d]"><div className="mx-auto flex min-h-[74px] max-w-[1100px] items-center justify-between px-5"><div><div className="text-4xl font-black tracking-[-0.08em] text-white">SIELE</div><div className="hidden text-[10px] font-bold uppercase tracking-wide text-white/80 sm:block">Prática de exames originais</div></div><span className="text-xs font-bold text-white">ES&nbsp;&nbsp;|&nbsp;&nbsp;PT&nbsp;&nbsp;|&nbsp;&nbsp;EN</span></div></header>
    <main className="mx-auto max-w-[900px] px-5 py-14"><section className="border border-[#c9c9c9] bg-white p-7 shadow-sm sm:p-10"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#b08b2c] text-white"><BookOpen /></div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a781f]">Arquivo de prática</p><h1 className="mt-2 text-3xl font-bold text-[#34404d]">Escolha o exame</h1><p className="mt-3 max-w-[700px] text-sm leading-6 text-[#555]">Os exames ficam separados, com a numeração original preservada. As respostas são salvas localmente no navegador e os resultados são apenas orientativos.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><article className="rounded border border-[#c9c9c9] bg-[#f7f9fa] p-5"><div className="flex items-center gap-2 text-[#34404d]"><BookOpen size={18} /><strong className="text-base">SIELE · Comprensión de lectura</strong></div><p className="mt-3 text-xs leading-5 text-[#66727b]">Prova de leitura com tarefas editáveis, textos, alternativas e modo de execução.</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => startReading("edit")} className="inline-flex items-center gap-1 rounded bg-[#34404d] px-3 py-2 text-xs font-bold text-white"><Pencil size={13} /> Editar prova</button><button onClick={() => startReading("take")} className="inline-flex items-center gap-1 rounded border border-[#34404d] px-3 py-2 text-xs font-bold text-[#34404d]"><Play size={13} /> Fazer prova</button></div></article><article className="rounded border-2 border-[#b08b2c] bg-[#fffaf0] p-5"><div className="flex items-center gap-2 text-[#5b4815]"><FileText size={18} /><strong className="text-base">CAP Mercancías · 26/09/2026</strong></div><p className="mt-3 text-xs leading-5 text-[#6d6040]">Exame completo com 103 perguntas na ordem original. As questões 1–100 são pontuadas; 101–103 são reservas.</p><button onClick={() => setMode("mercancias")} className="mt-5 inline-flex items-center gap-1 rounded bg-[#a50046] px-4 py-2.5 text-xs font-bold text-white"><Play size={13} /> Fazer exame completo</button></article><a href="https://examendemo.siele.org/" target="_blank" rel="noreferrer" className="rounded border border-[#9eabb5] bg-[#f7f9fa] p-5 text-left text-[#34404d] transition hover:border-[#34404d] hover:bg-white sm:col-span-2"><strong className="flex items-center gap-2 text-base">Abrir simulador SIELE oficial <ExternalLink size={16} /></strong><span className="mt-2 block text-xs leading-5 text-[#66727b]">Abrir em uma nova aba para consultar e comparar o formato da prova.</span></a></div>{saved && <div className="mt-6 flex items-center justify-between gap-3 border border-[#a8c9bd] bg-[#e8f3ee] p-4 text-xs"><span>Última tentativa de leitura salva: {saved.length} registros.</span><button onClick={resetReading} className="inline-flex items-center gap-1 font-bold text-[#28755e]"><RotateCcw size={13} /> Limpar</button></div>}</section></main><footer className="mt-10 bg-[#34404d] px-5 py-5 text-center text-xs text-white/80">Ferramenta de prática · não é um produto oficial SIELE ou CAP</footer>
  </div>;
}
