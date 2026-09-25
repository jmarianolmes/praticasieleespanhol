import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, ClipboardPaste, Eye, Plus, Save, Trash2 } from "lucide-react";

export type ReadingQuestion = {
  id: string;
  task: number;
  number: number;
  type: "radio" | "select" | "fragment" | "word";
  sourceText: string;
  prompt: string;
  options: string[];
};

export type ReadingAttemptAnswer = ReadingQuestion & {
  answer: string;
};

type ReadingExamProps = {
  mode: "setup" | "take";
  initialQuestions: ReadingQuestion[];
  onBack: () => void;
  onStart: (questions: ReadingQuestion[]) => void;
  onComplete: (answers: ReadingAttemptAnswer[]) => void;
};

const taskInfo = [
  { task: 1, title: "Textos breves", description: "5 perguntas com três alternativas", type: "radio" as const },
  { task: 2, title: "Um e-mail", description: "5 perguntas com três alternativas", type: "radio" as const },
  { task: 3, title: "Três textos", description: "8 perguntas com lista suspensa", type: "select" as const },
  { task: 4, title: "Fragmentos", description: "8 lacunas com fragmentos", type: "fragment" as const },
  { task: 5, title: "Palavras", description: "12 lacunas com palavras", type: "word" as const },
];

const makeQuestion = (task: number, number: number): ReadingQuestion => ({
  id: `cl-${task}-${number}`,
  task,
  number,
  type: taskInfo[task - 1].type,
  sourceText: "",
  prompt: "",
  options: [],
});

const defaultQuestions = (): ReadingQuestion[] => taskInfo.flatMap(({ task }) => {
  const total = [5, 5, 8, 8, 12][task - 1];
  return Array.from({ length: total }, (_, index) => makeQuestion(task, index + 1));
});

const splitLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

export default function ReadingExam({ mode, initialQuestions, onBack, onStart, onComplete }: ReadingExamProps) {
  const [questions, setQuestions] = useState<ReadingQuestion[]>(initialQuestions.length ? initialQuestions : defaultQuestions());
  const [activeTask, setActiveTask] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const activeQuestions = useMemo(() => questions.filter((question) => question.task === activeTask), [questions, activeTask]);
  const currentQuestion = activeQuestions[currentIndex] ?? activeQuestions[0];
  const completedCount = Object.values(answers).filter(Boolean).length;

  const updateQuestion = (id: string, patch: Partial<ReadingQuestion>) => {
    setQuestions((current) => current.map((question) => (question.id === id ? { ...question, ...patch } : question)));
  };

  const addQuestion = (task: number) => {
    const taskQuestions = questions.filter((question) => question.task === task);
    setQuestions((current) => [...current, makeQuestion(task, taskQuestions.length + 1)]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id));
    setAnswers((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const begin = () => onStart(questions.filter((question) => question.sourceText.trim() || question.prompt.trim() || question.options.length));

  const finish = () => {
    const ordered = questions.filter((question) => question.sourceText.trim() || question.prompt.trim() || question.options.length).map((question) => ({ ...question, answer: answers[question.id] ?? "" }));
    onComplete(ordered);
  };

  if (mode === "setup") {
    return <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[26px] bg-[#1e2528] p-6 text-[#f9f7f1] sm:p-8">
        <button onClick={onBack} className="flex w-fit items-center gap-2 text-[11px] text-[#c9d5d0] hover:text-white"><ArrowLeft size={14} /> Voltar ao registro</button>
        <p className="font-mono text-[9px] uppercase tracking-[0.19em] text-[#b8cec8]">Preparar prova · leitura</p>
        <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-none tracking-[-0.055em]">Monte a tela<br /><span className="font-editorial font-normal text-[#f2c29f]">como no exame.</span></h2>
        <p className="max-w-[680px] text-[13px] leading-6 text-[#b8c0bb]">Cole o conteúdo do simulador nos lugares correspondentes. Depois, clique em Fazer prova para a pessoa responder apenas clicando nas opções, como na prova real.</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="h-fit rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-5 sm:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Estrutura da prova</p>
          <div className="mt-5 space-y-2">{taskInfo.map((item) => <button key={item.task} onClick={() => setActiveTask(item.task)} className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${activeTask === item.task ? "border-[#1e2528] bg-[#1e2528] text-white" : "border-[#e4ded5] bg-[#faf8f3] text-[#59625e] hover:border-[#9eaaa4]"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] ${activeTask === item.task ? "bg-[#f2c29f] text-[#1e2528]" : "bg-[#f2eee6] text-[#b35f41]"}`}>{item.task}</span><span><strong className="block text-[12px]">{item.title}</strong><span className={`mt-1 block text-[10px] ${activeTask === item.task ? "text-[#c8d3ce]" : "text-[#858a84]"}`}>{item.description}</span></span></button>)}</div>
          <div className="mt-6 rounded-2xl bg-[#e7f2ef] p-4 text-[11px] leading-5 text-[#3f6d64]"><ClipboardPaste size={15} className="mb-2" /><strong>Como preencher:</strong> use uma linha para cada opção. O texto-base fica separado das opções para que o relatório seja legível.</div>
          <button onClick={begin} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b35f41] px-4 py-3 text-[11px] font-bold text-white hover:bg-[#944a31]"><Eye size={15} /> Fazer prova com este conteúdo</button>
        </div>
        <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-5 sm:p-7">
          <div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Tarefa {activeTask}</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em]">{taskInfo[activeTask - 1].title}</h3></div><button onClick={() => addQuestion(activeTask)} className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d0c1] px-3 py-2 text-[10px] font-semibold text-[#59625e] hover:border-[#1e2528]"><Plus size={13} /> Adicionar questão</button></div>
          <div className="mt-6 space-y-5">{questions.filter((question) => question.task === activeTask).map((question, index) => <div key={question.id} className="rounded-2xl border border-[#e4ded5] bg-[#faf8f3] p-4 sm:p-5"><div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#b35f41]">Questão {index + 1}</span><button onClick={() => removeQuestion(question.id)} className="text-[#a49b90] hover:text-[#b35f41]" title="Remover questão"><Trash2 size={14} /></button></div><div className="mt-4 grid gap-3"><label className="block"><span className="field-label">Texto-base</span><textarea value={question.sourceText} onChange={(event) => updateQuestion(question.id, { sourceText: event.target.value })} className="control min-h-[110px] resize-y" placeholder="Cole aqui o texto, e-mail, anúncio ou texto com lacunas…" /></label><label className="block"><span className="field-label">Pergunta / instrução</span><textarea value={question.prompt} onChange={(event) => updateQuestion(question.id, { prompt: event.target.value })} className="control min-h-[64px] resize-y" placeholder="Cole o enunciado desta questão…" /></label><label className="block"><span className="field-label">Opções do rádio, dropdown ou lacuna (uma por linha)</span><textarea value={question.options.join("\n")} onChange={(event) => updateQuestion(question.id, { options: splitLines(event.target.value) })} className="control min-h-[90px] resize-y" placeholder="Opção 1\nOpção 2\nOpção 3" /></label></div></div>)}</div>
        </div>
      </div>
    </div>;
  }

  if (!currentQuestion) return <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-8"><p className="text-sm text-[#59625e]">Nenhuma questão foi preparada.</p><button onClick={onBack} className="mt-4 rounded-full bg-[#1e2528] px-4 py-2 text-xs text-white">Voltar</button></div>;

  const taskDone = activeQuestions.every((question) => answers[question.id]);
  const answer = answers[currentQuestion.id] ?? "";
  const selectAnswer = (value: string) => setAnswers((current) => ({ ...current, [currentQuestion.id]: value }));
  const next = () => {
    if (currentIndex < activeQuestions.length - 1) setCurrentIndex((current) => current + 1);
    else if (activeTask < 5) { setActiveTask((current) => current + 1); setCurrentIndex(0); }
    else finish();
  };

  return <div className="mx-auto max-w-[980px] space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d9d0c1] bg-[#faf8f3] px-4 py-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#9b978f]">Prova 1 · Comprensión de lectura</p><p className="mt-1 text-[12px] font-semibold text-[#394240]">Tarea {activeTask} · questão {currentIndex + 1} de {activeQuestions.length}</p></div><span className="rounded-full bg-[#e7f2ef] px-3 py-1.5 font-mono text-[10px] text-[#21675e]">{completedCount} resposta(s) registrada(s)</span></div>
    <div className="overflow-hidden border border-[#c9c9c9] bg-white shadow-[0_12px_30px_rgba(30,37,40,0.08)]">
      <div className="border-b-[4px] border-[#b08b2c] bg-[#252525] px-4 py-3 text-[12px] font-semibold text-white">Comprensión de lectura</div>
      <div className="border-b border-[#ddd] px-5 py-3"><div className="flex flex-wrap gap-1">{taskInfo.map((item) => <button key={item.task} onClick={() => { if (item.task <= activeTask) { setActiveTask(item.task); setCurrentIndex(0); } }} className={`border px-3 py-1 text-[10px] ${item.task === activeTask ? "border-[#9b7a22] bg-[#b08b2c] text-white" : item.task < activeTask ? "border-[#b08b2c] bg-[#eee8d3] text-[#5c4b19]" : "border-[#ccc] bg-white text-[#999]"}`}>Tarea {item.task}</button>)}</div></div>
      <div className="p-5 sm:p-8"><p className="mb-5 text-[13px] leading-6 text-[#3f3f3f]">{taskInfo[activeTask - 1].description}. Responda conforme ao conteúdo apresentado.</p><div className="rounded-xl bg-[#e4e5e6] p-5 text-[13px] leading-6 text-[#262626] whitespace-pre-wrap">{currentQuestion.sourceText || "Texto-base ainda não preenchido."}</div><div className="mt-5 border-t border-[#ddd] bg-[#ededed] px-4 py-3 text-[13px] font-semibold text-[#333]">{currentQuestion.number}. {currentQuestion.prompt || "Enunciado ainda não preenchido."}</div><div className="space-y-2 py-4">{currentQuestion.options.map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 px-2 py-2 text-[13px] leading-5 text-[#333] hover:bg-[#f4f4f4]"><input type={currentQuestion.type === "radio" ? "radio" : "radio"} name={currentQuestion.id} checked={answer === option} onChange={() => selectAnswer(option)} className="mt-1" /><span>{option}</span></label>)}</div>{currentQuestion.options.length === 0 && <textarea value={answer} onChange={(event) => selectAnswer(event.target.value)} className="control min-h-[100px]" placeholder="Resposta desta questão…" />}<div className="mt-6 flex items-center justify-between border-t border-[#ddd] pt-5"><span className="font-mono text-[11px] text-[#7b7b7b]">{currentIndex + 1} / {activeQuestions.length}</span><button disabled={!answer.trim()} onClick={next} className="inline-flex items-center gap-2 bg-[#a50046] px-6 py-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{currentIndex === activeQuestions.length - 1 && activeTask === 5 ? <><Save size={14} /> Finalizar prova</> : <><ChevronRight size={14} /> Próxima</>}</button></div></div>
    </div><div className="flex items-center justify-between"><button onClick={onBack} className="inline-flex items-center gap-2 text-[11px] text-[#6b706c] hover:text-[#1e2528]"><ArrowLeft size={14} /> Sair sem finalizar</button><span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#7b817b]"><Check size={12} className="text-[#2c8b7d]" /> respostas ficam nesta sessão</span></div>
  </div>;
}
