import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Check, Download, Pencil, Play, Save } from "lucide-react";

export type ReadingQuestion = { id: string; task: number; number: number; type: "radio" | "select" | "fragment" | "word"; sourceText: string; prompt: string; options: string[] };
export type ReadingAttemptAnswer = ReadingQuestion & { answer: string };
type Mode = "edit" | "take";
type Props = { initialQuestions: ReadingQuestion[]; onComplete: (answers: ReadingAttemptAnswer[]) => void };

const tasks = [
  [1, "Tarea 1", "Textos breves"], [2, "Tarea 2", "Un correo"], [3, "Tarea 3", "Tres textos"], [4, "Tarea 4", "Fragmentos"], [5, "Tarea 5", "Palabras"],
] as const;

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f1f1f1] text-[#333]" style={{ fontFamily: "Lato, Arial, sans-serif" }}><header className="border-b border-[#263746] bg-[#34404d]"><div className="mx-auto flex min-h-[74px] max-w-[1180px] items-center justify-between px-5"><div className="flex items-center gap-4"><img src="/praticasieleespanhol/img/header.png" className="h-12 w-auto max-w-[310px] object-contain object-left" alt="SIELE" /><div className="hidden text-[10px] font-bold uppercase tracking-wide text-white/80 sm:block">Simulador de práctica · Comprensión de lectura</div></div><div className="text-xs font-bold text-white">ES&nbsp;&nbsp;|&nbsp;&nbsp;PT&nbsp;&nbsp;|&nbsp;&nbsp;EN</div></div></header>{children}<footer className="mt-10 bg-[#34404d] px-5 py-5 text-center text-xs text-white/80">Instituto Cervantes · Universidad de Salamanca · UNAM · UBA · Telefónica</footer></div>;
}

const marker = /\[\[(\d+)-(\d+)\]\]/g;
const lines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

export default function ReadingExam({ initialQuestions, onComplete }: Props) {
  const [mode, setMode] = useState<Mode>("edit");
  const [questions, setQuestions] = useState<ReadingQuestion[]>(() => initialQuestions.map((item) => ({ ...item, options: [...item.options] })));
  const [task, setTask] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [report, setReport] = useState<ReadingAttemptAnswer[] | null>(null);
  const active = useMemo(() => questions.filter((item) => item.task === task), [questions, task]);
  const source = active[0]?.sourceText ?? "";
  const update = (id: string, patch: Partial<ReadingQuestion>) => setQuestions((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  const answer = (id: string, value: string) => setAnswers((current) => ({ ...current, [id]: value }));
  const answered = Object.values(answers).filter(Boolean).length;

  const control = (q: ReadingQuestion) => {
    const value = answers[q.id] ?? "";
    if (q.type === "radio") return <div className="mt-3 space-y-1">{q.options.map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 border-b border-[#e2e2e2] px-3 py-2 text-sm hover:bg-[#fafafa]"><input type="radio" name={q.id} checked={value === option} onChange={() => answer(q.id, option)} className="mt-1" /><span>{option}</span></label>)}</div>;
    return <select value={value} onChange={(event) => answer(q.id, event.target.value)} className="mx-1 rounded border border-[#888] bg-white px-2 py-1 text-xs align-middle"><option value="">--Elija--</option>{q.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
  };

  const inlineSource = () => {
    const output: ReactNode[] = []; let last = 0; let match: RegExpExecArray | null; marker.lastIndex = 0;
    while ((match = marker.exec(source))) { const current = match; if (current.index > last) output.push(<span key={`text-${last}`}>{source.slice(last, current.index)}</span>); const q = active.find((item) => item.id === `cl-${current[1]}-${current[2]}`); if (q) output.push(<span key={q.id} className="whitespace-nowrap">{control(q)}</span>); last = current.index + current[0].length; }
    output.push(<span key="tail">{source.slice(last)}</span>); return output;
  };

  const saveReport = () => {
    const result = questions.map((q) => ({ ...q, answer: answers[q.id] ?? "" })); setReport(result); onComplete(result);
  };
  const downloadReport = () => { if (!report) return; const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "siele-leitura-respostas.json"; link.click(); URL.revokeObjectURL(url); };

  return <Shell><div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded border border-[#c9c9c9] bg-white px-4 py-3"><div><p className="text-[11px] font-bold uppercase tracking-wide text-[#6a6a6a]">Prova 1 · Comprensión de lectura</p><p className="mt-1 text-xs">Modo atual: <strong>{mode === "edit" ? "edição do conteúdo" : "realização da prova"}</strong></p></div><div className="flex gap-2"><button onClick={() => setMode("edit")} className={`inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-bold ${mode === "edit" ? "bg-[#34404d] text-white" : "border border-[#bbb] bg-white"}`}><Pencil size={13} /> Editar</button><button onClick={() => setMode("take")} className={`inline-flex items-center gap-1 rounded px-3 py-2 text-xs font-bold ${mode === "take" ? "bg-[#a50046] text-white" : "border border-[#bbb] bg-white"}`}><Play size={13} /> Fazer prova</button></div></div>
    <div className="border border-[#c8c8c8] bg-white shadow-sm"><div className="border-b-4 border-[#b08b2c] bg-[#292929] px-5 py-3 text-sm font-bold text-white">Comprensión de lectura</div><div className="flex flex-wrap gap-1 border-b border-[#d0d0d0] bg-[#fafafa] px-5 py-3">{tasks.map(([number, label]) => <button key={number} onClick={() => setTask(number)} className={`border px-3 py-2 text-xs ${task === number ? "border-[#9a781f] bg-[#b08b2c] font-bold text-white" : "border-[#c8c8c8] bg-white text-[#555]"}`}>{label}</button>)}</div>
      <div className="p-5 sm:p-9"><div className="mb-5 text-sm leading-6">{task === 1 ? "Usted va a leer cinco textos breves. Elija la opción correcta para cada una de las cinco preguntas." : tasks[task - 1][2]}</div>
        {mode === "edit" ? <div className="space-y-6">{active.map((q) => <article key={q.id} className="border border-[#cfcfcf] bg-[#f7f7f7] p-4"><div className="mb-3 flex items-center justify-between"><strong className="text-sm">Questão {q.number}</strong><span className="text-[11px] text-[#777]">Edite diretamente este bloco</span></div><label className="block text-xs font-bold">Texto principal<textarea value={q.sourceText} onChange={(event) => update(q.id, { sourceText: event.target.value })} className="mt-1 min-h-[110px] w-full border border-[#aaa] bg-white p-3 text-sm leading-6" /></label><label className="mt-3 block text-xs font-bold">Enunciado<textarea value={q.prompt} onChange={(event) => update(q.id, { prompt: event.target.value })} className="mt-1 min-h-[52px] w-full border border-[#aaa] bg-white p-3 text-sm" /></label><label className="mt-3 block text-xs font-bold">Opções — uma por linha<textarea value={q.options.join("\n")} onChange={(event) => update(q.id, { options: lines(event.target.value) })} className="mt-1 min-h-[72px] w-full border border-[#aaa] bg-white p-3 text-sm" /></label></article>)}</div> : <div>{task >= 3 ? <div className="whitespace-pre-wrap border border-[#bcbcbc] bg-[#ededed] p-5 text-sm leading-8">{inlineSource()}</div> : <><div className="whitespace-pre-wrap border border-[#bcbcbc] bg-[#ededed] p-5 text-sm leading-7">{source}</div><div className="mt-5 space-y-5">{active.map((q) => <article key={q.id}><div className="bg-[#d5d5d5] px-3 py-2 text-sm font-bold">{q.prompt}</div>{control(q)}</article>)}</div></>}</div>}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#d0d0d0] pt-5"><span className="text-xs text-[#666]">{mode === "take" ? `${answered} resposta(s) registrada(s)` : "As alterações ficam prontas para o modo prova."}</span>{mode === "edit" ? <button onClick={() => setMode("take")} className="inline-flex items-center gap-2 rounded bg-[#34404d] px-5 py-3 text-xs font-bold text-white"><Play size={14} /> Abrir modo prova</button> : <button onClick={saveReport} className="inline-flex items-center gap-2 rounded bg-[#a50046] px-5 py-3 text-xs font-bold text-white"><Save size={14} /> Finalizar e gerar relatório</button>}</div>
      </div></div>
    {report && <div className="mt-5 flex items-center justify-between border border-[#a8c9bd] bg-[#e8f3ee] p-4 text-sm"><span><Check className="mr-2 inline text-[#28755e]" size={16} />Relatório gerado com {report.length} registros.</span><button onClick={downloadReport} className="inline-flex items-center gap-2 rounded bg-[#28755e] px-4 py-2 text-xs font-bold text-white"><Download size={14} /> Baixar JSON</button></div>}
  </div></Shell>;
}
