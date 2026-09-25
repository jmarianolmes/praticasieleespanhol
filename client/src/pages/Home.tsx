import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileAudio,
  FileImage,
  FileText,
  FolderArchive,
  Layers3,
  LayoutDashboard,
  ListChecks,
  Mic,
  Mic2,
  MonitorUp,
  MoreHorizontal,
  Plus,
  Radio,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import ReadingExam, { type ReadingAttemptAnswer, type ReadingQuestion } from "@/components/ReadingExam";
import readingExamData from "@/data/readingExamData.json";

type View = "overview" | "capture" | "archive";
type ModuleKey = "CL" | "CA" | "EIE" | "EIO";

type ModuleInfo = {
  key: ModuleKey;
  short: string;
  label: string;
  description: string;
  accent: string;
  icon: typeof BookOpen;
};

type Capture = {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
  module: ModuleKey;
  taskNo: string;
};

type AudioRecord = {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
  durationMs: number;
  createdAt: string;
  module: ModuleKey;
  taskNo: string;
};

type TaskRecord = {
  id: string;
  module: ModuleKey;
  taskNo: string;
  sourceText: string;
  prompt: string;
  options: string;
  answer: string;
  choice: string;
  correctAnswer: string;
  notes: string;
  createdAt: string;
  captureIds: string[];
  audioIds: string[];
};

type PracticeSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tasks: TaskRecord[];
  captures: Capture[];
  audios: AudioRecord[];
};

type Draft = {
  module: ModuleKey;
  taskNo: string;
  sourceText: string;
  prompt: string;
  options: string;
  answer: string;
  choice: string;
  correctAnswer: string;
  notes: string;
  captureIds: string[];
  audioIds: string[];
};

const STORAGE_KEY = "siele-pratica-casa-v1";

const MODULES: ModuleInfo[] = [
  {
    key: "CL",
    short: "Leitura",
    label: "Compreensão de leitura",
    description: "Textos, alternativas e respostas marcadas.",
    accent: "clay",
    icon: BookOpen,
  },
  {
    key: "CA",
    short: "Auditiva",
    label: "Compreensão auditiva",
    description: "Enunciado ouvido e resposta registrada.",
    accent: "teal",
    icon: Volume2,
  },
  {
    key: "EIE",
    short: "Escrita",
    label: "Expressão escrita",
    description: "Produções textuais para avaliação B2.",
    accent: "gold",
    icon: FileText,
  },
  {
    key: "EIO",
    short: "Oral",
    label: "Expressão oral",
    description: "Respostas faladas com áudio anexado.",
    accent: "ink",
    icon: Mic2,
  },
];

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createSession = (title = "Sessão 01"): PracticeSession => ({
  id: makeId("session"),
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tasks: [],
  captures: [],
  audios: [],
});

const emptyDraft = (): Draft => ({
  module: "CL",
  taskNo: "1",
  sourceText: "",
  prompt: "",
  options: "",
  answer: "",
  choice: "",
  correctAnswer: "",
  notes: "",
  captureIds: [],
  audioIds: [],
});

function loadSessions(): PracticeSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createSession()];
    const parsed = JSON.parse(raw) as PracticeSession[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [createSession()];
  } catch {
    return [createSession()];
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatClock(value: number) {
  const total = Math.max(0, Math.floor(value / 1000));
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function moduleInfo(key: ModuleKey) {
  return MODULES.find((item) => item.key === key) ?? MODULES[0];
}

function dataUrlToBlob(dataUrl: string) {
  const [meta, body] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "application/octet-stream";
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function imageDimensions(dataUrl: string) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth || 1200, height: image.naturalHeight || 800 });
    image.onerror = () => resolve({ width: 1200, height: 800 });
    image.src = dataUrl;
  });
}

function safeFileName(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9áéíóúãõçü]+/gi, "-").replace(/^-|-$/g, "") || "sessao";
}

export default function Home() {
  const [sessions, setSessions] = useState<PracticeSession[]>(() => loadSessions());
  const [activeId, setActiveId] = useState("");
  const [view, setView] = useState<View>("overview");
  const [draft, setDraft] = useState<Draft>(() => emptyDraft());
  const [status, setStatus] = useState("Tudo fica neste navegador até você exportar.");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [archiveFilter, setArchiveFilter] = useState<ModuleKey | "ALL">("ALL");
  const [readingMode, setReadingMode] = useState<"setup" | "take" | null>(null);
  const [readingQuestions, setReadingQuestions] = useState<ReadingQuestion[]>(readingExamData as ReadingQuestion[]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingStartedRef = useRef<number | null>(null);
  const captureInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const activeSession = sessions.find((session) => session.id === activeId) ?? sessions[0];
  const activeModule = moduleInfo(draft.module);
  const taskCount = activeSession?.tasks.length ?? 0;
  const captureCount = activeSession?.captures.length ?? 0;
  const audioCount = activeSession?.audios.length ?? 0;
  const oralTasks = activeSession?.tasks.filter((task) => task.module === "EIO").length ?? 0;
  const writtenTasks = activeSession?.tasks.filter((task) => task.module === "EIE").length ?? 0;

  useEffect(() => {
    if (!activeId && sessions[0]) setActiveId(sessions[0].id);
  }, [activeId, sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      setStatus("A sessão ficou grande para o armazenamento local. Exporte agora para não perder os anexos.");
    }
  }, [sessions]);

  useEffect(() => {
    if (!isRecording) return;
    const interval = window.setInterval(() => {
      if (recordingStartedRef.current) setRecordingMs(Date.now() - recordingStartedRef.current);
    }, 250);
    return () => window.clearInterval(interval);
  }, [isRecording]);

  const updateActiveSession = (updater: (session: PracticeSession) => PracticeSession) => {
    if (!activeSession) return;
    setSessions((current) => current.map((session) => (session.id === activeSession.id ? updater(session) : session)));
  };

  const createNewSession = () => {
    if (hasUnsavedDraft() && !window.confirm("Há dados da tarefa atual que ainda não foram salvos. Criar outra sessão vai descartá-los. Continuar?")) return;
    const session = createSession(`Sessão ${String(sessions.length + 1).padStart(2, "0")}`);
    setSessions((current) => [...current, session]);
    setActiveId(session.id);
    setDraft(emptyDraft());
    setView("capture");
    setStatus("Nova sessão criada. Abra o simulador e comece pela página que deseja registrar.");
  };

  const hasUnsavedDraft = () => Boolean(
    draft.sourceText.trim() || draft.prompt.trim() || draft.options.trim() || draft.answer.trim() || draft.choice.trim() || draft.correctAnswer.trim() || draft.notes.trim() ||
    draft.captureIds.length > 0 || draft.audioIds.length > 0,
  );

  const selectSession = (sessionId: string) => {
    if (hasUnsavedDraft() && !window.confirm("Há dados da tarefa atual que ainda não foram salvos. Trocar de sessão vai descartá-los. Continuar?")) return;
    setActiveId(sessionId);
    setDraft(emptyDraft());
  };

  const renameActiveSession = () => {
    if (!activeSession) return;
    const title = window.prompt("Nome simples para esta sessão", activeSession.title);
    if (!title?.trim()) return;
    updateActiveSession((session) => ({ ...session, title: title.trim(), updatedAt: new Date().toISOString() }));
    setStatus("Nome da sessão atualizado.");
  };

  const changeDraftModule = (module: ModuleKey) => {
    if (module === draft.module && module !== "CL") return;
    if (module === "CL" && draft.module === "CL" && !readingMode) {
      setReadingMode("take");
      return;
    }
    if (isRecording) {
      setStatus("Pare a gravação atual antes de mudar de módulo.");
      return;
    }
    if (hasUnsavedDraft() && !window.confirm("Há dados da tarefa atual que ainda não foram salvos. Mudar de módulo vai descartá-los. Continuar?")) return;
    if (module === "CL") {
      setReadingMode("take");
      setDraft(emptyDraft());
      return;
    }
    setDraft({ ...emptyDraft(), module });
  };

  const saveReadingAnswers = (answers: ReadingAttemptAnswer[]) => {
    if (!activeSession) return;
    updateActiveSession((session) => ({
      ...session,
      tasks: [...session.tasks, ...answers.map((item) => ({
        id: makeId("task"), module: "CL" as ModuleKey, taskNo: `${item.task}.${item.number}`,
        sourceText: item.sourceText, prompt: item.prompt, options: item.options.join("\n"),
        answer: item.answer, choice: item.answer, correctAnswer: "", notes: "",
        createdAt: new Date().toISOString(), captureIds: [], audioIds: [],
      }))],
      updatedAt: new Date().toISOString(),
    }));
    setReadingMode(null);
    setView("archive");
    setStatus(`${answers.length} respostas da Prova 1 foram salvas na sessão.`);
  };

  const captureScreen = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setStatus("Este navegador não oferece captura de tela. Use Chrome, Edge, Firefox ou Opera em HTTPS.");
      return;
    }
    try {
      setStatus("Escolha a aba ou janela do simulador na caixa de permissão do navegador.");
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" }, audio: false });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1440;
      canvas.height = video.videoHeight || 900;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach((track) => track.stop());
      const dataUrl = canvas.toDataURL("image/png", 0.92);
      const capture: Capture = {
        id: makeId("capture"),
        name: `${draft.module.toLowerCase()}-tarefa-${draft.taskNo}-${new Date().toISOString().slice(0, 10)}.png`,
        dataUrl,
        createdAt: new Date().toISOString(),
        module: draft.module,
        taskNo: draft.taskNo,
      };
      updateActiveSession((session) => ({ ...session, captures: [...session.captures, capture], updatedAt: new Date().toISOString() }));
      setDraft((current) => ({ ...current, captureIds: [...current.captureIds, capture.id] }));
      setStatus("Captura adicionada à tarefa atual. Você pode continuar passando as páginas do simulador.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") setStatus("A captura foi cancelada. Nenhuma imagem foi adicionada.");
      else setStatus("Não foi possível capturar a tela. Tente novamente e aceite a permissão do navegador.");
    }
  };

  const addImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const captures = await Promise.all(Array.from(files).map(async (file) => ({
      id: makeId("capture"),
      name: file.name,
      dataUrl: await blobToDataUrl(file),
      createdAt: new Date().toISOString(),
      module: draft.module,
      taskNo: draft.taskNo,
    })));
    updateActiveSession((session) => ({ ...session, captures: [...session.captures, ...captures], updatedAt: new Date().toISOString() }));
    setDraft((current) => ({ ...current, captureIds: [...current.captureIds, ...captures.map((capture) => capture.id)] }));
    setStatus(`${captures.length} imagem(ns) anexada(s) à tarefa atual.`);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Este navegador não permite gravação de microfone.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = async () => {
        const durationMs = recordingStartedRef.current ? Date.now() - recordingStartedRef.current : recordingMs;
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const audio: AudioRecord = {
          id: makeId("audio"),
          name: `${draft.module.toLowerCase()}-tarefa-${draft.taskNo}-${new Date().toISOString().slice(0, 10)}.webm`,
          dataUrl: await blobToDataUrl(blob),
          mimeType: blob.type,
          durationMs,
          createdAt: new Date().toISOString(),
          module: draft.module,
          taskNo: draft.taskNo,
        };
        updateActiveSession((session) => ({ ...session, audios: [...session.audios, audio], updatedAt: new Date().toISOString() }));
        setDraft((current) => ({ ...current, audioIds: [...current.audioIds, audio.id] }));
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        recordingStartedRef.current = null;
        setRecordingMs(0);
        setIsRecording(false);
        setStatus("Áudio gravado e anexado à tarefa atual.");
      };
      recorder.start();
      recorderRef.current = recorder;
      recordingStartedRef.current = Date.now();
      setRecordingMs(0);
      setIsRecording(true);
      setStatus("Gravando pelo microfone. Fale como falaria no exame e finalize quando terminar.");
    } catch {
      setStatus("O microfone não foi liberado. Verifique as permissões do navegador e tente novamente.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const addAudioFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const audios = await Promise.all(Array.from(files).map(async (file) => ({
      id: makeId("audio"),
      name: file.name,
      dataUrl: await blobToDataUrl(file),
      mimeType: file.type || "audio/mpeg",
      durationMs: 0,
      createdAt: new Date().toISOString(),
      module: draft.module,
      taskNo: draft.taskNo,
    })));
    updateActiveSession((session) => ({ ...session, audios: [...session.audios, ...audios], updatedAt: new Date().toISOString() }));
    setDraft((current) => ({ ...current, audioIds: [...current.audioIds, ...audios.map((audio) => audio.id)] }));
    setStatus(`${audios.length} áudio(s) anexado(s) à tarefa atual.`);
  };

  const saveTask = () => {
    if (!activeSession) return;
    if (!draft.sourceText.trim() && !draft.prompt.trim() && !draft.options.trim() && !draft.answer.trim() && draft.captureIds.length === 0 && draft.audioIds.length === 0) {
      setStatus("Adicione uma pergunta, resposta ou anexo antes de salvar a tarefa.");
      return;
    }
    const task: TaskRecord = {
      id: makeId("task"),
      module: draft.module,
      taskNo: draft.taskNo || String(activeSession.tasks.length + 1),
      sourceText: draft.sourceText.trim(),
      prompt: draft.prompt.trim(),
      options: draft.options.trim(),
      answer: draft.answer.trim(),
      choice: draft.choice.trim(),
      correctAnswer: draft.correctAnswer.trim(),
      notes: draft.notes.trim(),
      createdAt: new Date().toISOString(),
      captureIds: [...draft.captureIds],
      audioIds: [...draft.audioIds],
    };
    updateActiveSession((session) => ({
      ...session,
      tasks: [...session.tasks, task],
      captures: session.captures.map((capture) => (task.captureIds.includes(capture.id) ? { ...capture } : capture)),
      updatedAt: new Date().toISOString(),
    }));
    setDraft((current) => ({ ...emptyDraft(), module: current.module, taskNo: String(Number(current.taskNo || 0) + 1) }));
    setStatus("Tarefa salva na ordem da sessão. A próxima página já pode ser registrada.");
  };

  const removeTask = (taskId: string) => {
    updateActiveSession((session) => {
      const tasks = session.tasks.filter((task) => task.id !== taskId);
      const usedCaptureIds = new Set(tasks.flatMap((task) => task.captureIds));
      const usedAudioIds = new Set(tasks.flatMap((task) => task.audioIds));
      draft.captureIds.forEach((id) => usedCaptureIds.add(id));
      draft.audioIds.forEach((id) => usedAudioIds.add(id));
      return {
        ...session,
        tasks,
        captures: session.captures.filter((capture) => usedCaptureIds.has(capture.id)),
        audios: session.audios.filter((audio) => usedAudioIds.has(audio.id)),
        updatedAt: new Date().toISOString(),
      };
    });
    setStatus("Registro e anexos vinculados removidos desta sessão.");
  };

  const buildPdf = async () => {
    if (!activeSession) return new Blob();
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 16;
    const pageWidth = 210;
    const contentWidth = pageWidth - margin * 2;
    const addText = (text: string, x: number, y: number, width = contentWidth, size = 10, color = [39, 48, 49] as [number, number, number]) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      const lines = pdf.splitTextToSize(text || "—", width);
      pdf.text(lines, x, y);
      return y + lines.length * (size * 0.45 + 1.8);
    };
    pdf.setFillColor(30, 37, 40);
    pdf.rect(0, 0, pageWidth, 34, "F");
    pdf.setTextColor(248, 245, 238);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("SIELE / prática em casa", margin, 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Relatório de captura assistida — material para professor ou IA", margin, 25);
    let y = 47;
    y = addText(activeSession.title, margin, y, contentWidth, 16, [30, 37, 40]);
    y = addText(`Criada em ${formatDate(activeSession.createdAt)} · ${activeSession.tasks.length} tarefa(s) · ${activeSession.audios.length} áudio(s) · ${activeSession.captures.length} captura(s)`, margin, y + 2, contentWidth, 9, [94, 103, 101]);
    y += 8;
    y = addText("Nota de uso: este material organiza a prática e não representa uma pontuação oficial do SIELE.", margin, y, contentWidth, 9, [145, 76, 55]);
    for (let index = 0; index < activeSession.tasks.length; index += 1) {
      const task = activeSession.tasks[index];
      if (y > 246) {
        pdf.addPage();
        y = 18;
      }
      const info = moduleInfo(task.module);
      pdf.setFillColor(237, 232, 222);
      pdf.roundedRect(margin, y - 5, contentWidth, 13, 2, 2, "F");
      pdf.setTextColor(30, 37, 40);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(`${String(index + 1).padStart(2, "0")}  ${info.label} · tarefa ${task.taskNo}`, margin + 4, y + 3);
      y += 17;
      if (task.sourceText) {
        y = addText("Texto-base / contexto", margin, y, contentWidth, 8, [94, 103, 101]);
        y = addText(task.sourceText, margin, y + 1, contentWidth, 10);
        y += 3;
      }
      y = addText("Pergunta / instrução", margin, y, contentWidth, 8, [94, 103, 101]);
      y = addText(task.prompt, margin, y + 1, contentWidth, 10);
      y += 3;
      if (task.options) {
        y = addText("Opções apresentadas", margin, y, contentWidth, 8, [94, 103, 101]);
        y = addText(task.options, margin, y + 1, contentWidth, 10);
        y += 3;
      }
      y = addText("Resposta registrada", margin, y, contentWidth, 8, [94, 103, 101]);
      y = addText(task.answer || task.choice, margin, y + 1, contentWidth, 10);
      if (task.correctAnswer) y = addText(`Gabarito informado: ${task.correctAnswer}`, margin, y + 2, contentWidth, 9, [30, 108, 95]);
      if (task.notes) y = addText(`Observações: ${task.notes}`, margin, y + 2, contentWidth, 9, [94, 103, 101]);
      const taskAudios = activeSession.audios.filter((audio) => task.audioIds.includes(audio.id));
      const taskCaptures = activeSession.captures.filter((capture) => task.captureIds.includes(capture.id));
      y = addText(`Anexos: ${taskCaptures.length} imagem(ns) · ${taskAudios.length} áudio(s)${taskAudios.length ? ` (${taskAudios.map((audio) => `${audio.name}${audio.durationMs ? `, ${formatClock(audio.durationMs)}` : ""}`).join("; ")})` : ""}`, margin, y + 4, contentWidth, 8, [94, 103, 101]);
      for (const capture of taskCaptures) {
        const size = await imageDimensions(capture.dataUrl);
        const maxHeight = 76;
        const maxWidth = contentWidth;
        const ratio = Math.min(maxWidth / size.width, maxHeight / size.height);
        const width = size.width * ratio;
        const height = size.height * ratio;
        if (y + height > 280) {
          pdf.addPage();
          y = 18;
        }
        pdf.addImage(capture.dataUrl, "PNG", margin, y, width, height, undefined, "FAST");
        y += height + 8;
      }
      y += 6;
    }
    if (activeSession.tasks.length === 0) {
      addText("Nenhuma tarefa foi salva ainda. Use a aba Capturar para montar o primeiro registro.", margin, y + 5, contentWidth, 11);
    }
    return pdf.output("blob");
  };

  const exportPdf = async () => {
    setExporting(true);
    setStatus("Montando o PDF cronológico…");
    try {
      const blob = await buildPdf();
      downloadBlob(blob, `${safeFileName(activeSession?.title ?? "sessao")}-relatorio.pdf`);
      setStatus("PDF exportado. Os áudios continuam separados no pacote completo.");
    } catch {
      setStatus("Não foi possível gerar o PDF. Exporte o JSON para preservar os dados e tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const exportZip = async () => {
    if (!activeSession) return;
    setExporting(true);
    setStatus("Compactando relatório, imagens, áudios e dados…");
    try {
      const zip = new JSZip();
      const folderName = safeFileName(activeSession.title);
      const folder = zip.folder(folderName);
      if (!folder) throw new Error("folder");
      folder.file("relatorio.pdf", await buildPdf());
      folder.file("dados/sessao.json", JSON.stringify(activeSession, null, 2));
      folder.file("LEIA-ME.txt", "Sessão de prática SIELE organizada para correção. A pontuação, se preenchida, é apenas orientativa e não oficial.\n");
      const images = folder.folder("imagens");
      activeSession.captures.forEach((capture) => images?.file(capture.name, dataUrlToBlob(capture.dataUrl)));
      const audios = folder.folder("audios");
      activeSession.audios.forEach((audio) => audios?.file(audio.name, dataUrlToBlob(audio.dataUrl)));
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      downloadBlob(blob, `${folderName}-pacote.zip`);
      setStatus("Pacote ZIP exportado com PDF, JSON, imagens e áudios separados.");
    } catch {
      setStatus("Não foi possível compactar a sessão. Tente primeiro exportar o PDF ou o JSON.");
    } finally {
      setExporting(false);
    }
  };

  const exportJson = () => {
    if (!activeSession) return;
    const blob = new Blob([JSON.stringify(activeSession, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${safeFileName(activeSession.title)}-dados.json`);
    setStatus("Dados JSON exportados.");
  };

  const filteredTasks = useMemo(() => {
    if (!activeSession) return [];
    return archiveFilter === "ALL" ? activeSession.tasks : activeSession.tasks.filter((task) => task.module === archiveFilter);
  }, [activeSession, archiveFilter]);

  return (
    <div className="min-h-screen bg-[#f5f1e9] text-[#1e2528] selection:bg-[#eec8a8] selection:text-[#1e2528]">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="w-full border-b border-[#d9d0c1] bg-[#f9f7f1] px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[250px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
          <div className="flex items-center justify-between lg:block">
            <button className="group flex items-center gap-3 text-left" onClick={() => setView("overview")} aria-label="Ir para visão geral">
              <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#1e2528] text-[#f9f7f1] shadow-[0_8px_18px_rgba(30,37,40,0.18)] transition-transform duration-200 group-hover:-rotate-3">
                <Layers3 size={19} strokeWidth={1.8} />
              </span>
              <span>
                <span className="block font-display text-[17px] font-semibold leading-none tracking-[-0.03em]">SIELE / casa</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.16em] text-[#6b706c]">arquivo de prática</span>
              </span>
            </button>
            <button className="rounded-full border border-[#d9d0c1] p-2 text-[#6b706c] transition hover:border-[#1e2528] hover:text-[#1e2528] lg:hidden" onClick={createNewSession} aria-label="Criar nova sessão"><Plus size={17} /></button>
          </div>

          <div className="mt-10 hidden lg:block">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.19em] text-[#9b978f]">Navegação</p>
            <nav className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Visão geral" active={view === "overview"} onClick={() => setView("overview")} />
              <SidebarItem icon={MonitorUp} label="Registrar tarefa" active={view === "capture"} onClick={() => setView("capture")} />
              <SidebarItem icon={Archive} label="Arquivo da sessão" active={view === "archive"} count={taskCount} onClick={() => setView("archive")} />
            </nav>
          </div>

          <div className="mt-7 hidden rounded-[20px] border border-[#ded6ca] bg-[#f2eee6] p-4 lg:block">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d9ece7] text-[#21675e]"><ShieldCheck size={16} /></span>
              <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#21675e]">local-first</span>
            </div>
            <p className="mt-5 text-[12px] font-medium leading-5 text-[#3c4444]">Nada sai deste navegador até você escolher exportar e compartilhar.</p>
          </div>

          <div className="mt-auto hidden pt-10 lg:block">
            <a href="https://examendemo.siele.org/" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 text-[12px] font-medium text-[#5b625e] transition hover:border-[#ded6ca] hover:bg-white">
              <span className="flex items-center gap-2"><ArrowUpRight size={14} /> Abrir simulador SIELE</span>
              <span className="font-mono text-[9px] text-[#9b978f]">nova aba</span>
            </a>
            <p className="px-3 pt-4 font-mono text-[9px] leading-4 text-[#9b978f]">Ferramenta doméstica de apoio.<br />Não é um produto oficial SIELE.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 pb-12 pt-5 sm:px-8 lg:px-12 lg:pb-16 lg:pt-8">
          <header className="flex flex-col gap-4 border-b border-[#ded6ca] pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#d27652] shadow-[0_0_0_5px_rgba(210,118,82,0.13)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b706c]">ambiente privado · {formatDate(new Date().toISOString())}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="session-select">Selecionar sessão</label>
              <div className="relative">
              <select id="session-select" value={activeSession?.id ?? ""} onChange={(event) => selectSession(event.target.value)} className="h-9 max-w-[220px] appearance-none rounded-full border border-[#d9d0c1] bg-[#faf8f3] py-0 pl-3 pr-8 text-[11px] font-semibold text-[#394240] outline-none transition focus:border-[#1e2528]">
                  {sessions.map((session) => <option key={session.id} value={session.id}>{session.title}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 text-[#6b706c]" size={14} />
              </div>
              <button onClick={renameActiveSession} className="grid h-9 w-9 place-items-center rounded-full border border-[#d9d0c1] text-[#6b706c] transition hover:border-[#1e2528] hover:text-[#1e2528]" title="Renomear sessão"><MoreHorizontal size={16} /></button>
              <button onClick={createNewSession} className="hidden h-9 items-center gap-1.5 rounded-full bg-[#1e2528] px-3.5 text-[11px] font-semibold text-[#f9f7f1] transition hover:bg-[#374448] sm:flex"><Plus size={14} /> Nova sessão</button>
            </div>
          </header>

          <div className="mt-7 flex gap-2 overflow-x-auto lg:hidden">
            <MobileNavItem label="Visão geral" active={view === "overview"} onClick={() => setView("overview")} />
            <MobileNavItem label="Registrar" active={view === "capture"} onClick={() => setView("capture")} />
            <MobileNavItem label={`Arquivo ${taskCount ? `· ${taskCount}` : ""}`} active={view === "archive"} onClick={() => setView("archive")} />
          </div>

          <section className="mt-7 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-[760px]">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#b35f41]">{view === "overview" ? "Painel de preparação" : view === "capture" ? "Registro guiado" : "Material cronológico"}</p>
              <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-[#1e2528]">{view === "overview" ? <>Prática que<br /><em className="font-editorial font-normal text-[#b35f41]">deixa rastro.</em></> : view === "capture" ? <>Prepare a tarefa.<br /><em className="font-editorial font-normal text-[#b35f41]">Salve o rastro.</em></> : <>Tudo em ordem.<br /><em className="font-editorial font-normal text-[#b35f41]">Pronto para corrigir.</em></>}</h1>
              <p className="mt-5 max-w-[620px] text-[14px] leading-6 text-[#65706b]">{view === "overview" ? "Passe pelas páginas do simulador oficial em outra aba e monte um arquivo fiel da tentativa: pergunta, resposta, captura e voz — sem depender de uma nota automática." : view === "capture" ? "Cada captura ou gravação fica anexada à tarefa atual. Salve este registro antes de passar para a próxima pergunta do simulador." : "Revise a sessão como um professor verá: por módulo, na ordem em que as tarefas foram registradas, com os anexos identificados."}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full border border-[#d9d0c1] bg-[#faf8f3] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6b706c]">B2 · acompanhamento</span>
              <span className="rounded-full border border-[#b9d9d1] bg-[#e7f2ef] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#21675e]">offline por padrão</span>
            </div>
          </section>

          <div className="mt-10">{readingMode ? <ReadingExam mode={readingMode} initialQuestions={readingQuestions} onBack={() => setReadingMode(null)} onStart={(questions) => { setReadingQuestions(questions); setReadingMode("take"); }} onComplete={saveReadingAnswers} /> : view === "overview" ? <Overview activeSession={activeSession} taskCount={taskCount} captureCount={captureCount} audioCount={audioCount} oralTasks={oralTasks} writtenTasks={writtenTasks} onStart={() => setView("capture")} onNew={createNewSession} /> : view === "capture" ? <CaptureView draft={draft} setDraft={setDraft} activeModule={activeModule} taskCount={taskCount} captureCount={captureCount} audioCount={audioCount} isRecording={isRecording} recordingMs={recordingMs} captureScreen={captureScreen} startRecording={startRecording} stopRecording={stopRecording} saveTask={saveTask} addImageFiles={addImageFiles} addAudioFiles={addAudioFiles} captureInputRef={captureInputRef} audioInputRef={audioInputRef} status={status} changeDraftModule={changeDraftModule} /> : <ArchiveView activeSession={activeSession} filteredTasks={filteredTasks} filter={archiveFilter} setFilter={setArchiveFilter} removeTask={removeTask} exporting={exporting} exportPdf={exportPdf} exportZip={exportZip} exportJson={exportJson} onCapture={() => setView("capture")} />}</div>

          {view !== "overview" && <div className="mt-8 flex items-center gap-2 border-t border-[#ded6ca] pt-4 text-[11px] text-[#7b817b]"><Radio size={13} className="text-[#b35f41]" /><span>{status}</span></div>}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, count, onClick }: { icon: typeof LayoutDashboard; label: string; active: boolean; count?: number; onClick: () => void }) {
  return <button onClick={onClick} className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] transition ${active ? "bg-[#1e2528] text-[#f9f7f1] shadow-[0_8px_18px_rgba(30,37,40,0.13)]" : "text-[#67716d] hover:bg-[#eeebe3] hover:text-[#1e2528]"}`}><span className="flex items-center gap-3"><Icon size={15} strokeWidth={1.8} /><span className="font-medium">{label}</span></span>{count ? <span className={`font-mono text-[10px] ${active ? "text-[#d8e8e3]" : "text-[#9b978f]"}`}>{String(count).padStart(2, "0")}</span> : null}</button>;
}

function MobileNavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-semibold transition ${active ? "border-[#1e2528] bg-[#1e2528] text-[#f9f7f1]" : "border-[#d9d0c1] bg-[#faf8f3] text-[#67716d]"}`}>{label}</button>;
}

function Overview({ activeSession, taskCount, captureCount, audioCount, oralTasks, writtenTasks, onStart, onNew }: { activeSession: PracticeSession; taskCount: number; captureCount: number; audioCount: number; oralTasks: number; writtenTasks: number; onStart: () => void; onNew: () => void }) {
  const progress = Math.min(100, Math.round((taskCount / 12) * 100));
  return <div className="space-y-8">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Tarefas salvas" value={taskCount} detail="nesta sessão" icon={ListChecks} accent="clay" />
      <MetricCard label="Capturas" value={captureCount} detail="páginas visuais" icon={FileImage} accent="teal" />
      <MetricCard label="Áudios" value={audioCount} detail="respostas orais" icon={FileAudio} accent="gold" />
      <MetricCard label="Progresso" value={`${progress}%`} detail="rastro construído" icon={Sparkles} accent="ink" />
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="relative overflow-hidden rounded-[26px] bg-[#1e2528] p-6 text-[#f9f7f1] shadow-[0_18px_40px_rgba(30,37,40,0.14)] sm:p-8">
        <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border border-[#6c827d]/25" /><div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-[#6c827d]/20" />
        <div className="relative max-w-[600px]">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.19em] text-[#b8cec8]"><span className="h-1.5 w-1.5 rounded-full bg-[#d27652]" /> Próximo passo recomendado</div>
          <h2 className="mt-7 font-display text-[clamp(1.7rem,3vw,2.55rem)] font-semibold leading-[1.03] tracking-[-0.045em]">Abra o simulador,<br /><span className="font-editorial font-normal text-[#d8a078]">capture sem pressa.</span></h2>
          <p className="mt-4 max-w-[490px] text-[13px] leading-6 text-[#b8c0bb]">A captura manual é intencional: você escolhe a aba do SIELE e decide o que merece entrar no arquivo. Depois, o ZIP reúne tudo para uma correção mais justa.</p>
          <div className="mt-7 flex flex-wrap gap-2"><button onClick={onStart} className="inline-flex items-center gap-2 rounded-full bg-[#f2c29f] px-4 py-2.5 text-[11px] font-bold text-[#1e2528] transition hover:bg-[#f8d5b9]"><MonitorUp size={14} /> Registrar tarefa</button><a href="https://examendemo.siele.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#5b6967] px-4 py-2.5 text-[11px] font-semibold text-[#e5ece8] transition hover:border-[#c2d5cf]"><ArrowUpRight size={14} /> Abrir SIELE</a></div>
        </div>
      </div>
      <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-6 sm:p-7">
        <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Sessão ativa</p><h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em]">{activeSession.title}</h2></div><button onClick={onNew} className="grid h-9 w-9 place-items-center rounded-full border border-[#ded6ca] text-[#6b706c] transition hover:border-[#1e2528] hover:text-[#1e2528]" title="Nova sessão"><Plus size={15} /></button></div>
        <p className="mt-2 text-[12px] text-[#7a817b]">Atualizada em {formatDate(activeSession.updatedAt)}.</p>
        <div className="mt-8 space-y-4"><ProgressLine label="Oral anexado" value={oralTasks} total={5} color="#1e2528" /><ProgressLine label="Escrita anexada" value={writtenTasks} total={2} color="#d27652" /><ProgressLine label="Material reunido" value={taskCount} total={12} color="#2c8b7d" /></div>
      </div>
    </div>

    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-6 sm:p-7"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f5e4d7] text-[#b35f41]"><CircleHelp size={16} /></span><h2 className="font-display text-xl font-semibold tracking-[-0.04em]">Permissões, sem surpresa</h2></div><p className="mt-5 text-[13px] leading-6 text-[#69716c]">A página só pede acesso quando você clica em <strong className="font-semibold text-[#394240]">Capturar tela</strong> ou <strong className="font-semibold text-[#394240]">Gravar resposta</strong>. A escolha da aba, janela e microfone aparece no diálogo do navegador.</p><div className="mt-6 flex flex-wrap gap-2"><span className="rounded-full bg-[#e7f2ef] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#21675e]">microfone sob demanda</span><span className="rounded-full bg-[#f2eee6] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6b706c]">sem servidor</span></div></div>
      <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-6 sm:p-7"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Fluxo de trabalho</p><h2 className="mt-3 font-display text-xl font-semibold tracking-[-0.04em]">Um registro por página, uma visão melhor do B2.</h2></div><span className="hidden font-editorial text-3xl text-[#d27652] sm:block">03</span></div><div className="mt-7 grid gap-5 sm:grid-cols-3"><Step number="01" title="Passe" text="Abra a página oficial e escolha a fonte na captura." /><Step number="02" title="Anote" text="Cole a pergunta, registre a resposta e acrescente contexto." /><Step number="03" title="Exporte" text="Envie o PDF e os áudios para correção humana ou IA." /></div></div>
    </div>
  </div>;
}

function MetricCard({ label, value, detail, icon: Icon, accent }: { label: string; value: string | number; detail: string; icon: typeof ListChecks; accent: string }) {
  const styles: Record<string, string> = { clay: "bg-[#f5e4d7] text-[#a95538]", teal: "bg-[#e1f0ec] text-[#21675e]", gold: "bg-[#f2ead0] text-[#91712a]", ink: "bg-[#e6e9e7] text-[#1e4e49]" };
  return <div className="rounded-[22px] border border-[#ded6ca] bg-[#fbfaf6] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(72,67,58,0.08)]"><div className="flex items-start justify-between"><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8b8c85]">{label}</span><span className={`grid h-8 w-8 place-items-center rounded-xl ${styles[accent]}`}><Icon size={15} /></span></div><p className="mt-7 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.06em]">{value}</p><p className="mt-2 text-[11px] text-[#858a84]">{detail}</p></div>;
}

function ProgressLine({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percent = Math.min(100, Math.round((value / total) * 100));
  return <div><div className="flex items-center justify-between text-[11px]"><span className="font-medium text-[#59625e]">{label}</span><span className="font-mono text-[10px] text-[#9b978f]">{value}/{total}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9e5dc]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} /></div></div>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div><span className="font-mono text-[10px] text-[#b35f41]">{number}</span><h3 className="mt-3 text-[13px] font-semibold">{title}</h3><p className="mt-1.5 text-[11px] leading-5 text-[#7a817b]">{text}</p></div>;
}

function CaptureView({ draft, setDraft, activeModule, taskCount, captureCount, audioCount, isRecording, recordingMs, captureScreen, startRecording, stopRecording, saveTask, addImageFiles, addAudioFiles, captureInputRef, audioInputRef, status, changeDraftModule }: { draft: Draft; setDraft: React.Dispatch<React.SetStateAction<Draft>>; activeModule: ModuleInfo; taskCount: number; captureCount: number; audioCount: number; isRecording: boolean; recordingMs: number; captureScreen: () => void; startRecording: () => void; stopRecording: () => void; saveTask: () => void; addImageFiles: (files: FileList | null) => void; addAudioFiles: (files: FileList | null) => void; captureInputRef: React.MutableRefObject<HTMLInputElement | null>; audioInputRef: React.MutableRefObject<HTMLInputElement | null>; status: string; changeDraftModule: (module: ModuleKey) => void }) {
  return <div className="space-y-6">
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-5 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-[#e6e0d7] pb-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Tarefa em elaboração</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em]">Prepare o registro.</h2></div><div className="rounded-full bg-[#f2eee6] px-3 py-2 font-mono text-[10px] text-[#6b706c]">{String(taskCount + 1).padStart(2, "0")}º registro da sessão</div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">{MODULES.map((item) => { const Icon = item.icon; const active = item.key === draft.module; return <button key={item.key} onClick={() => changeDraftModule(item.key)} className={`rounded-2xl border p-3 text-left transition ${active ? "border-[#1e2528] bg-[#1e2528] text-[#f9f7f1] shadow-[0_8px_16px_rgba(30,37,40,0.12)]" : "border-[#e4ded5] bg-[#faf8f3] text-[#6b706c] hover:border-[#a9aaa2]"}`}><Icon size={16} className={active ? "text-[#f2c29f]" : "text-[#b35f41]"} /><span className="mt-3 block text-[11px] font-semibold">{item.short}</span><span className={`mt-1 block text-[10px] leading-4 ${active ? "text-[#b9c7c2]" : "text-[#90948d]"}`}>{item.key}</span></button>; })}</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-[115px_1fr]
        ">
          <Field label="Tarefa / item"><input value={draft.taskNo} onChange={(event) => setDraft((current) => ({ ...current, taskNo: event.target.value }))} className="control" placeholder="1" /></Field>
          <Field label="Texto-base apresentado"><textarea value={draft.sourceText} onChange={(event) => setDraft((current) => ({ ...current, sourceText: event.target.value }))} className="control min-h-[110px] resize-y" placeholder="Cole aqui o texto, anúncio, e-mail ou trecho com lacunas…" /><div className="mt-2 text-right font-mono text-[9px] text-[#9b978f]">conteúdo de apoio da questão</div></Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Pergunta ou instrução"><textarea value={draft.prompt} onChange={(event) => setDraft((current) => ({ ...current, prompt: event.target.value }))} className="control min-h-[94px] resize-y" placeholder="Ex.: Pedro dice que… / Elija el fragmento correcto…" /></Field><Field label="Opções ou alternativas"><textarea value={draft.options} onChange={(event) => setDraft((current) => ({ ...current, options: event.target.value }))} className="control min-h-[94px] resize-y" placeholder="Cole uma opção por linha, incluindo as opções do menu suspenso…" /><div className="mt-2 text-right font-mono text-[9px] text-[#9b978f]">uma opção por linha</div></Field></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label={draft.module === "EIE" ? "Resposta escrita" : "Resposta selecionada ou preenchida"}><textarea value={draft.answer} onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))} className="control min-h-[128px] resize-y" placeholder={draft.module === "EIE" ? "Escreva aqui a resposta original, sem corrigir…" : "Registre a alternativa marcada ou a palavra/frase escolhida…"} /><div className="mt-2 flex items-center justify-between font-mono text-[9px] text-[#9b978f]"><span>{draft.answer.trim() ? `${draft.answer.trim().split(/\s+/).length} palavra(s)` : "contador de palavras"}</span><span>{draft.module === "EIE" ? "preservar original" : "registro manual"}</span></div></Field><Field label="Observações para o corretor"><textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} className="control min-h-[128px] resize-y" placeholder="Dúvida, tempo usado, dificuldade, contexto ou hipótese…" /><div className="mt-2 text-right font-mono text-[9px] text-[#9b978f]">campo opcional</div></Field></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Gabarito conhecido (opcional)"><input value={draft.correctAnswer} onChange={(event) => setDraft((current) => ({ ...current, correctAnswer: event.target.value }))} className="control" placeholder="Ex.: B / ainda não sei" /></Field><Field label="Status do registro"><div className="flex h-[43px] items-center gap-2 rounded-xl border border-[#ded6ca] bg-[#f5f2eb] px-3 text-[11px] text-[#6b706c]"><Check size={14} className="text-[#2c8b7d]" /> pronto para anexar evidências</div></Field></div>
        <div className="mt-7 flex flex-col gap-3 border-t border-[#e6e0d7] pt-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#e7f2ef] px-3 py-1.5 font-mono text-[9px] text-[#21675e]">{draft.captureIds.length} imagem(ns)</span><span className="rounded-full bg-[#f5e4d7] px-3 py-1.5 font-mono text-[9px] text-[#a95538]">{draft.audioIds.length} áudio(s)</span></div><p className="mt-2 text-[10px] text-[#858a84]">Ao salvar, o formulário avança para a próxima tarefa.</p></div><button onClick={saveTask} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#b35f41] px-5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(179,95,65,0.19)] transition hover:bg-[#944a31]"><Save size={15} /> Salvar e começar próxima</button></div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[26px] bg-[#e7f2ef] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#397b70]">Evidência visual</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[#1e4e49]">Capture a tela atual.</h2></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#cde6df] text-[#21675e]"><MonitorUp size={17} /></span></div><p className="mt-4 text-[12px] leading-5 text-[#4f726b]">Clique e escolha a aba do SIELE na janela do navegador. A captura entra na tarefa atual e fica só neste dispositivo.</p><button onClick={captureScreen} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#21675e] px-4 py-3 text-[11px] font-bold text-white transition hover:bg-[#164e47]"><MonitorUp size={15} /> Capturar página / tela</button><button onClick={() => captureInputRef.current?.click()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#a9d3c9] px-4 py-3 text-[11px] font-semibold text-[#21675e] transition hover:bg-[#d9eee9]"><Upload size={14} /> Anexar imagem existente</button><input ref={captureInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => { addImageFiles(event.target.files); event.currentTarget.value = ""; }} /><p className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#568a81]"><ShieldCheck size={12} /> {captureCount} captura(s) na sessão</p></div>
        <div className="rounded-[26px] bg-[#f5e4d7] p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#a95538]">Evidência oral</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[#5c3022]">Grave a sua resposta.</h2></div><span className={`grid h-9 w-9 place-items-center rounded-xl ${isRecording ? "bg-[#b35f41] text-white" : "bg-[#efd0bb] text-[#a95538]"}`}>{isRecording ? <Radio size={17} className="animate-pulse" /> : <Mic size={17} />}</span></div><p className="mt-4 text-[12px] leading-5 text-[#805b4c]">A permissão do microfone só aparece ao iniciar. Use este áudio para a resposta oral ou anexe um arquivo já gravado.</p><div className="mt-6 flex items-center gap-2"><button onClick={isRecording ? stopRecording : startRecording} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[11px] font-bold transition ${isRecording ? "bg-[#1e2528] text-white hover:bg-[#374448]" : "bg-[#b35f41] text-white hover:bg-[#944a31]"}`}>{isRecording ? <><Square size={13} fill="currentColor" /> Parar · {formatClock(recordingMs)}</> : <><Mic size={15} /> Gravar resposta</>}</button><button onClick={() => audioInputRef.current?.click()} className="grid h-11 w-11 place-items-center rounded-xl border border-[#deb49c] text-[#a95538] transition hover:bg-[#efd0bb]" title="Anexar áudio existente"><Upload size={15} /></button></div><input ref={audioInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={(event) => { addAudioFiles(event.target.files); event.currentTarget.value = ""; }} /><p className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a95538]"><FileAudio size={12} /> {audioCount} áudio(s) na sessão</p></div>
        <div className="rounded-[26px] border border-[#ded6ca] bg-[#fbfaf6] p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9b978f]">Como usar</p><h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.04em]">Faça em outra aba.</h2></div><span className="font-editorial text-3xl text-[#d27652]">↗</span></div><ol className="mt-5 space-y-3 text-[11px] leading-5 text-[#707771]"><li className="flex gap-3"><span className="font-mono text-[#b35f41]">01</span><span>Abra o simulador oficial pelo botão da barra lateral.</span></li><li className="flex gap-3"><span className="font-mono text-[#b35f41]">02</span><span>Passe a página e volte aqui para capturar a tela.</span></li><li className="flex gap-3"><span className="font-mono text-[#b35f41]">03</span><span>Salve a tarefa antes de seguir para a próxima.</span></li></ol><div className="mt-5 rounded-xl bg-[#f2eee6] p-3 text-[10px] leading-4 text-[#7b817b]">Dica: não feche esta aba durante a sessão. O arquivo é salvo no armazenamento local do navegador.</div></div>
      </div>
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.13em] text-[#858a84]">{label}</span>{children}</label>; }

function ArchiveView({ activeSession, filteredTasks, filter, setFilter, removeTask, exporting, exportPdf, exportZip, exportJson, onCapture }: { activeSession: PracticeSession; filteredTasks: TaskRecord[]; filter: ModuleKey | "ALL"; setFilter: (value: ModuleKey | "ALL") => void; removeTask: (id: string) => void; exporting: boolean; exportPdf: () => void; exportZip: () => void; exportJson: () => void; onCapture: () => void }) {
  return <div className="space-y-6">
    <div className="rounded-[26px] bg-[#1e2528] p-5 text-[#f9f7f1] sm:p-7"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b8cec8]">Exportação segura</p><h2 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-semibold tracking-[-0.055em]">Entregue o contexto,<br /><span className="font-editorial font-normal text-[#f2c29f]">não só a resposta.</span></h2><p className="mt-3 max-w-[550px] text-[12px] leading-5 text-[#b8c0bb]">O PDF organiza perguntas e respostas. O pacote ZIP acrescenta imagens, áudios e o JSON bruto para que nada se perca na correção.</p></div><div className="flex flex-wrap gap-2"><button disabled={exporting} onClick={exportPdf} className="inline-flex items-center gap-2 rounded-full bg-[#f2c29f] px-4 py-2.5 text-[11px] font-bold text-[#1e2528] transition hover:bg-[#f8d5b9] disabled:cursor-wait disabled:opacity-60"><FileText size={14} /> PDF</button><button disabled={exporting} onClick={exportZip} className="inline-flex items-center gap-2 rounded-full border border-[#6c827d] px-4 py-2.5 text-[11px] font-semibold text-[#eff5f1] transition hover:border-[#c2d5cf] disabled:cursor-wait disabled:opacity-60"><FolderArchive size={14} /> ZIP completo</button><button disabled={exporting} onClick={exportJson} className="inline-flex items-center gap-2 rounded-full border border-[#485a59] px-4 py-2.5 text-[11px] font-semibold text-[#cdd9d4] transition hover:border-[#a7bdb6] disabled:cursor-wait disabled:opacity-60"><FileText size={14} /> JSON</button></div></div></div>
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2"><FilterButton label="Tudo" active={filter === "ALL"} onClick={() => setFilter("ALL")} />{MODULES.map((item) => <FilterButton key={item.key} label={item.short} active={filter === item.key} onClick={() => setFilter(item.key)} />)}</div><button onClick={onCapture} className="inline-flex items-center gap-2 rounded-full border border-[#d9d0c1] bg-[#fbfaf6] px-3.5 py-2 text-[11px] font-semibold text-[#59625e] transition hover:border-[#1e2528] hover:text-[#1e2528]"><Plus size={14} /> Adicionar registro</button></div>
    {filteredTasks.length === 0 ? <div className="rounded-[26px] border border-dashed border-[#cfc6b8] bg-[#fbfaf6] px-6 py-16 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f2eee6] text-[#b35f41]"><Archive size={20} /></span><h2 className="mt-5 font-display text-xl font-semibold tracking-[-0.04em]">O arquivo ainda está vazio.</h2><p className="mx-auto mt-2 max-w-[390px] text-[12px] leading-5 text-[#7b817b]">Comece pela captura assistida e salve cada tarefa na ordem do simulador.</p><button onClick={onCapture} className="mt-6 rounded-full bg-[#1e2528] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#374448]">Ir para captura</button></div> : <div className="space-y-3">{filteredTasks.map((task, index) => <TaskRow key={task.id} task={task} index={index} activeSession={activeSession} onRemove={() => removeTask(task.id)} />)}</div>}
  </div>;
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) { return <button onClick={onClick} className={`rounded-full border px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition ${active ? "border-[#1e2528] bg-[#1e2528] text-[#f9f7f1]" : "border-[#d9d0c1] bg-[#fbfaf6] text-[#7b817b] hover:border-[#1e2528]"}`}>{label}</button>; }

function TaskRow({ task, index, activeSession, onRemove }: { task: TaskRecord; index: number; activeSession: PracticeSession; onRemove: () => void }) {
  const info = moduleInfo(task.module);
  const captures = activeSession.captures.filter((capture) => task.captureIds.includes(capture.id));
  const audios = activeSession.audios.filter((audio) => task.audioIds.includes(audio.id));
  return <article className="rounded-[22px] border border-[#ded6ca] bg-[#fbfaf6] p-5 transition hover:shadow-[0_12px_28px_rgba(72,67,58,0.07)] sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start"><div className="flex items-start gap-3"><span className="font-mono text-[10px] text-[#b35f41]">{String(index + 1).padStart(2, "0")}</span><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f2eee6] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#6b706c]">{info.short}</span><span className="font-mono text-[9px] text-[#9b978f]">tarefa {task.taskNo}</span></div>{task.sourceText && <div className="mt-3 rounded-xl bg-[#eef3f0] p-3 text-[12px] leading-5 text-[#52645e]"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7a938a]">Texto-base</span><p className="mt-1 whitespace-pre-wrap">{task.sourceText}</p></div>}<p className="mt-3 max-w-[720px] whitespace-pre-wrap text-[13px] leading-6 text-[#394240]">{task.prompt || "Sem pergunta transcrita — consulte a captura anexada."}</p>{task.options && <div className="mt-3 rounded-xl bg-[#f7f1e6] p-3 text-[12px] leading-5 text-[#6b665d]"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9b978f]">Opções</span><p className="mt-1 whitespace-pre-wrap">{task.options}</p></div>}<div className="mt-3 rounded-xl bg-[#f4f0e9] p-3 text-[12px] leading-5 text-[#66706a]"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9b978f]">Resposta</span><p className="mt-1 whitespace-pre-wrap">{task.answer || task.choice || "Sem texto; ver áudio ou imagem."}</p></div>{task.notes && <p className="mt-3 text-[11px] italic leading-5 text-[#858a84]">“{task.notes}”</p>}</div></div><div className="flex shrink-0 items-center gap-2 sm:ml-auto"><span className="flex items-center gap-1.5 rounded-full bg-[#e7f2ef] px-2.5 py-1.5 font-mono text-[9px] text-[#21675e]"><FileImage size={11} /> {captures.length}</span><span className="flex items-center gap-1.5 rounded-full bg-[#f5e4d7] px-2.5 py-1.5 font-mono text-[9px] text-[#a95538]"><FileAudio size={11} /> {audios.length}</span><button onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-full border border-[#eadfd5] text-[#a49b90] transition hover:border-[#b35f41] hover:text-[#b35f41]" title="Remover registro"><Trash2 size={13} /></button></div></div></article>;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function MetricPlaceholder() { return null; }

export { MetricPlaceholder };
