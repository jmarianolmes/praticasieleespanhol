import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronRight, Save } from "lucide-react";

export type ReadingQuestion = { id: string; task: number; number: number; type: "radio" | "select" | "fragment" | "word"; sourceText: string; prompt: string; options: string[] };
export type ReadingAttemptAnswer = ReadingQuestion & { answer: string };
type ReadingExamProps = { mode: "setup" | "take"; initialQuestions: ReadingQuestion[]; onBack: () => void; onStart: (questions: ReadingQuestion[]) => void; onComplete: (answers: ReadingAttemptAnswer[]) => void };

const taskInfo = [
  { task: 1, title: "Tarea 1", description: "Usted va a leer cinco textos breves. Elija la opción correcta para cada una de las cinco preguntas." },
  { task: 2, title: "Tarea 2", description: "Usted va a leer un correo que Isabel ha escrito a su amiga Sara. Elija la opción correcta para cada una de las cinco preguntas." },
  { task: 3, title: "Tarea 3", description: "Usted va a leer tres textos. Elija la opción correcta para cada una de las ocho preguntas." },
  { task: 4, title: "Tarea 4", description: "Usted va a leer dos textos en los que faltan cuatro fragmentos. Elija el fragmento correcto para cada hueco." },
  { task: 5, title: "Tarea 5", description: "Usted va a leer un texto en el que faltan doce palabras. Elija la opción correcta para cada hueco." },
];

function ExamShell({ children }: { children: ReactNode }) {
  return <div className="min-h-[720px] bg-[#e5e5e5] text-[#252525]"><header className="h-[74px] border-b border-[#d4d4d4] bg-white"><div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-5"><div className="flex items-center gap-3"><div className="border-2 border-[#c1121c] px-2 py-1 text-[17px] font-black leading-none tracking-[-0.12em] text-[#c1121c]">siele</div><div className="hidden border-l border-[#d8d8d8] pl-3 text-[8px] font-semibold uppercase leading-3 tracking-[0.07em] text-[#555] sm:block">Servicio Internacional<br />de Evaluación de la Lengua Española</div></div><div className="font-mono text-[9px] text-[#777]">ES&nbsp;&nbsp;|&nbsp;&nbsp;PT&nbsp;&nbsp;|&nbsp;&nbsp;EN</div></div></header><main className="mx-auto max-w-[980px] px-3 py-5 sm:px-6">{children}</main><footer className="mt-8 border-t border-[#343c47] bg-[#34404d] px-5 py-4 text-center text-[9px] text-[#e2e4e5]"><div className="flex flex-wrap justify-center gap-x-8 gap-y-2"><span>Instituto Cervantes</span><span>Universidad de Salamanca</span><span>UNAM</span><span>UBA</span><span>Telefónica · Educación Digital</span></div></footer></div>;
}

const marker = /\[\[(\d+)-(\d+)\]\]/g;

export default function ReadingExam({ initialQuestions, onBack, onComplete }: ReadingExamProps) {
  const questions = initialQuestions;
  const [activeTask, setActiveTask] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const activeQuestions = useMemo(() => questions.filter((q) => q.task === activeTask), [questions, activeTask]);
  const source = activeQuestions[0]?.sourceText ?? "";
  const completedCount = Object.values(answers).filter(Boolean).length;
  const setAnswer = (id: string, value: string) => setAnswers((current) => ({ ...current, [id]: value }));
  const finish = () => onComplete(questions.map((q) => ({ ...q, answer: answers[q.id] ?? "" })));
  const nextTask = () => { if (activeTask < 5) setActiveTask((task) => task + 1); else finish(); };

  const answerControl = (question: ReadingQuestion) => {
    const value = answers[question.id] ?? "";
    if (question.type === "radio") return <div className="space-y-1.5">{question.options.map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 border-b border-[#eee] px-2 py-2 text-[13px] leading-5 hover:bg-[#f5f5f5]"><input type="radio" name={question.id} checked={value === option} onChange={() => setAnswer(question.id, option)} className="mt-1" /><span>{option}</span></label>)}</div>;
    return <select value={value} onChange={(event) => setAnswer(question.id, event.target.value)} className="mx-1 inline-block min-w-[145px] border border-[#777] bg-white px-2 py-1 text-[12px] text-[#444] align-middle"><option value="">--Elija--</option>{question.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
  };

  const inlineText = () => {
    const parts: ReactNode[] = [];
    let last = 0; let match: RegExpExecArray | null; marker.lastIndex = 0;
    while ((match = marker.exec(source))) { if (match.index > last) parts.push(<span key={`t-${last}`}>{source.slice(last, match.index)} </span>); const q = activeQuestions.find((item) => item.id === `cl-${match![1]}-${match![2]}`); if (q) parts.push(<span key={q.id}>{answerControl(q)}</span>); last = match.index + match[0].length; }
    if (last < source.length) parts.push(<span key="end">{source.slice(last)}</span>);
    return parts.length ? parts : source;
  };

  if (!activeQuestions.length) return <ExamShell><div className="p-8">Nenhuma questão foi carregada.</div></ExamShell>;
  const allAnswered = activeQuestions.every((q) => answers[q.id]);
  const isInline = activeTask >= 3;
  return <ExamShell><div className="space-y-5">
    <div className="flex items-center justify-between border border-[#c9c9c9] bg-[#fafafa] px-4 py-2"><span className="font-mono text-[10px] text-[#555]">Prova 1 · Comprensión de lectura</span><span className="border border-[#999] px-3 py-1 font-mono text-[10px]">Tiempo prueba: <strong>00:58:50</strong></span></div>
    <div className="border border-[#c9c9c9] bg-white shadow-sm"><div className="border-b-[5px] border-[#b08b2c] bg-[#292929] px-4 py-2 text-[12px] font-semibold text-white">Comprensión de lectura</div><div className="flex gap-1 border-b border-[#ccc] px-4 py-3">{taskInfo.map((item) => <button key={item.task} onClick={() => item.task <= activeTask && setActiveTask(item.task)} className={`border px-3 py-1 text-[10px] ${item.task === activeTask ? "border-[#9a781f] bg-[#b08b2c] text-white" : item.task < activeTask ? "bg-[#eee8d3] text-[#5c4b19]" : "bg-white text-[#999]"}`}>{item.title}</button>)}</div>
      <div className="p-5 sm:p-8"><p className="mb-5 text-[13px] leading-5">{taskInfo[activeTask - 1].description}</p>{isInline ? <div className="rounded-sm border border-[#bdbdbd] bg-[#f1f1f1] p-5 text-[13px] leading-7 whitespace-pre-wrap">{inlineText()}</div> : <>{activeTask === 1 ? <div className="rounded-sm border border-[#bdbdbd] bg-[#f1f1f1] p-5 text-[13px] leading-6 whitespace-pre-wrap">{activeQuestions[0].sourceText}</div> : <div className="rounded-sm border border-[#bdbdbd] bg-[#f1f1f1] p-5 text-[13px] leading-6 whitespace-pre-wrap">{source}</div>}{activeTask === 1 ? <div className="mt-5"><div className="bg-[#d5d5d5] px-3 py-2 text-[13px] font-semibold">{activeQuestions[0].prompt}</div>{answerControl(activeQuestions[0])}</div> : <div className="mt-5 space-y-4">{activeQuestions.map((q) => <div key={q.id}><div className="bg-[#d5d5d5] px-3 py-2 text-[13px] font-semibold">{q.prompt}</div>{answerControl(q)}</div>)}</div>}</>}
        <div className="mt-7 flex items-center justify-between border-t border-[#ccc] pt-4"><span className="font-mono text-[10px] text-[#666]">{activeTask === 1 ? `${activeQuestions[0].number} / 5` : `${activeQuestions.length} respostas nesta tarefa`} · {completedCount} salvas</span><button disabled={!allAnswered} onClick={nextTask} className="inline-flex items-center gap-2 bg-[#a50046] px-6 py-2.5 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{activeTask === 5 ? <><Save size={14} /> Finalizar</> : <><ChevronRight size={14} /> Siguiente</>}</button></div>
      </div></div><button onClick={onBack} className="inline-flex items-center gap-2 text-[11px] text-[#6b706c]"><ArrowLeft size={14} /> Voltar ao registro</button><span className="float-right inline-flex items-center gap-1.5 font-mono text-[9px] text-[#68736e]"><Check size={12} className="text-[#2c8b7d]" /> resposta salva nesta sessão</span>
  </div></ExamShell>;
}
