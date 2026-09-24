# SIELE Prática em Casa — Contexto do projeto

## 1. Resumo executivo

**SIELE Prática em Casa** é uma ferramenta web privada para apoiar a preparação de uma candidata ao exame **SIELE Global**, especialmente com objetivo de acompanhar a evolução em direção ao nível **B2**.

A ferramenta não substitui o exame oficial, não produz uma nota oficial SIELE e não tenta reproduzir integralmente o simulador. Ela funciona como um **arquivo de prática assistida**: a candidata abre o simulador oficial em outra aba, passa pelas páginas, registra manualmente perguntas e respostas, captura imagens da tela, grava respostas orais e exporta todo o material para correção por um professor ou por uma IA.

O princípio central do projeto é:

> **Registrar o contexto completo da resposta, e não apenas a resposta isolada.**

O projeto é de uso doméstico. Os dados das sessões permanecem no navegador até que a família escolha exportar um PDF, um arquivo JSON ou um pacote ZIP.

## 2. Repositório e publicação

O repositório atual é:

- GitHub: <https://github.com/jmarianolmes/praticasieleespanhol>
- Organização: `jmarianolmes`
- Branch principal: `main`
- Visibilidade atual: privada

O projeto original foi criado com o nome `siele-pratica-casa` e posteriormente o repositório remoto foi renomeado para `praticasieleespanhol`. O remote local `github` deve apontar para:

```text
https://github.com/jmarianolmes/praticasieleespanhol.git
```

O endereço de prévia do ambiente de desenvolvimento é temporário e não deve ser tratado como endereço oficial de produção.

## 3. Contexto do problema

O simulador público do SIELE é útil para compreender o formato das tarefas, mas informa que as respostas não são salvas nem avaliadas como resultado oficial. Por isso, a candidata precisa de uma maneira de preservar o material produzido durante a prática.

O SIELE Global é composto por quatro áreas:

1. **Compreensão de leitura (CL)**.
2. **Compreensão auditiva (CA)**.
3. **Expressão e interação escritas (EIE)**.
4. **Expressão e interação orais (EIO)**.

As provas de leitura e compreensão auditiva possuem questões objetivas. As provas escrita e oral exigem avaliação de produção linguística. Para estas últimas, a ferramenta deve preservar o texto original e o áudio original, sem substituir a produção da candidata por uma versão corrigida.

A avaliação feita pela ferramenta ou por uma IA deve ser descrita como **orientativa**. O resultado não pode ser apresentado como certificado, nota oficial ou conversão oficial do SIELE.

## 4. Objetivo funcional

A aplicação deve permitir que a usuária:

- crie sessões simples de prática;
- escolha o módulo SIELE da tarefa atual;
- informe o número ou identificador da tarefa;
- cole ou transcreva a pergunta apresentada;
- registre a alternativa ou resposta escolhida;
- escreva respostas abertas, preservando o texto original;
- informe opcionalmente um gabarito conhecido;
- adicione observações para o professor ou para a IA;
- capture manualmente a tela atual do simulador;
- faça upload de imagens capturadas anteriormente;
- grave a resposta oral usando o microfone;
- faça upload de áudios gravados anteriormente;
- salve cada tarefa na ordem cronológica da sessão;
- filtre o arquivo por módulo;
- exporte um relatório PDF;
- exporte um pacote ZIP com PDF, JSON, imagens e áudios;
- exporte os dados brutos em JSON.

## 5. O que já foi implementado

### 5.1 Interface e navegação

A interface possui três áreas principais:

- **Visão geral**: painel inicial com métricas, progresso e instruções.
- **Capturar página**: formulário para registrar uma tarefa e seus anexos.
- **Arquivo da sessão**: lista cronológica dos registros e opções de exportação.

A interface usa uma identidade visual editorial com fundo marfim, carvão escuro, terracota e verde teal. A tipografia combina DM Sans para leitura da interface, Cormorant Garamond para destaques editoriais e IBM Plex Mono para metadados.

A aplicação é responsiva e possui navegação lateral em telas grandes e navegação compacta em telas pequenas.

### 5.2 Sessões

Cada sessão possui:

```ts
type PracticeSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tasks: TaskRecord[];
  captures: Capture[];
  audios: AudioRecord[];
};
```

A usuária pode criar uma nova sessão e renomear a sessão ativa. O cadastro é propositalmente simples: não há autenticação, e-mail, conta interna ou banco de dados remoto.

### 5.3 Tarefas

Cada tarefa possui:

```ts
type TaskRecord = {
  id: string;
  module: "CL" | "CA" | "EIE" | "EIO";
  taskNo: string;
  prompt: string;
  answer: string;
  choice: string;
  correctAnswer: string;
  notes: string;
  createdAt: string;
  captureIds: string[];
  audioIds: string[];
};
```

A tarefa só é salva quando a usuária clica em **Salvar tarefa**. Depois de salva, o formulário é limpo para o próximo registro, preservando o módulo selecionado e incrementando o número da tarefa.

### 5.4 Captura manual de tela

O botão **Capturar página / tela** usa:

```js
navigator.mediaDevices.getDisplayMedia()
```

O navegador solicita permissão no momento do clique. A usuária escolhe a aba ou janela do simulador oficial. A imagem é capturada em PNG e associada à tarefa atual.

O fluxo esperado é:

1. abrir o simulador SIELE em outra aba;
2. voltar à aplicação;
3. clicar em **Capturar página / tela**;
4. selecionar a aba ou janela correta no diálogo do navegador;
5. voltar ao formulário;
6. registrar pergunta e resposta;
7. salvar a tarefa.

Também existe upload manual de imagens para casos em que a captura tenha sido feita com a ferramenta nativa do sistema.

A aplicação não tenta ler automaticamente o DOM do simulador. Isso evita problemas de política de mesma origem, fragilidade técnica e possível redistribuição indevida do banco de questões.

### 5.5 Gravação e upload de áudio

O botão **Gravar resposta** usa:

```js
navigator.mediaDevices.getUserMedia({ audio: true })
```

e a API `MediaRecorder`.

A permissão do microfone é solicitada somente após o clique. O áudio é armazenado como Data URL no armazenamento local e normalmente utiliza o formato `audio/webm` com codec Opus quando suportado.

A aplicação também permite anexar áudios existentes. Cada áudio guarda:

```ts
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
```

O áudio deve ser utilizado para avaliar fluência, pronúncia, inteligibilidade, vocabulário, gramática, desenvolvimento das ideias e capacidade de interação. A aplicação atual não transcreve nem corrige automaticamente o áudio.

### 5.6 Armazenamento local

Os dados são salvos em `localStorage` com a chave:

```text
siele-pratica-casa-v1
```

O armazenamento é feito no navegador do dispositivo. Não há backend implementado. Não há sincronização entre dispositivos. Se o navegador for limpo, os dados podem ser perdidos; por isso, as sessões importantes devem ser exportadas regularmente.

Como capturas e áudios podem ser grandes, o armazenamento local pode atingir o limite do navegador. A aplicação mostra um aviso quando não consegue atualizar o armazenamento.

### 5.7 Exportação PDF

O PDF é gerado no navegador com `jsPDF`.

O relatório contém:

- nome da sessão;
- data da sessão;
- quantidade de tarefas, áudios e capturas;
- aviso de que a avaliação não é oficial;
- tarefas na ordem em que foram salvas;
- módulo e número da tarefa;
- pergunta ou instrução;
- resposta registrada;
- gabarito, quando informado;
- observações;
- nomes e durações dos áudios;
- imagens associadas à tarefa.

O PDF é uma organização para correção. Ele não calcula automaticamente o nível B2 e não deve apresentar uma nota como se fosse emitida pelo SIELE.

### 5.8 Exportação ZIP

O botão **ZIP completo** cria um pacote com a seguinte organização:

```text
nome-da-sessao/
  relatorio.pdf
  LEIA-ME.txt
  dados/
    sessao.json
  imagens/
    cl-tarefa-1.png
  audios/
    eio-tarefa-1.webm
```

Esse pacote é o formato preferencial para enviar a um professor, desde que a usuária revise e remova informações pessoais antes do compartilhamento.

### 5.9 Exportação JSON

O JSON contém a estrutura completa da sessão, incluindo respostas e Data URLs dos anexos. Ele é útil para backup técnico ou para uma futura ferramenta de análise, mas pode ficar grande. Não deve ser publicado em um repositório público.

## 6. Arquitetura técnica atual

A aplicação é um projeto estático frontend-only:

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS 4;
- Lucide React para ícones;
- `jsPDF` para PDF;
- `JSZip` para ZIP;
- `localStorage` para persistência;
- `MediaRecorder` para áudio;
- `getDisplayMedia` para captura manual de tela.

Estrutura relevante:

```text
client/
  index.html
  src/
    App.tsx
    index.css
    main.tsx
    pages/
      Home.tsx
    components/
      ui/
  public/

.github/
  workflows/
    deploy-pages.yml

vite.config.ts
package.json
pnpm-lock.yaml
PROJECT_CONTEXT.md
```

O arquivo central da primeira versão é:

```text
client/src/pages/Home.tsx
```

Ele contém as telas, o modelo de dados, o armazenamento local, a captura, a gravação e as exportações. Em uma refatoração futura, a lógica deve ser separada em hooks e módulos de utilidade sem alterar o formato JSON já utilizado.

## 7. GitHub Pages

Existe um workflow em:

```text
.github/workflows/deploy-pages.yml
```

O workflow:

1. faz checkout do repositório;
2. instala pnpm usando a versão definida em `package.json`;
3. instala dependências com `pnpm install --frozen-lockfile`;
4. executa `pnpm run build`;
5. envia `dist/public` como artefato do Pages;
6. usa `actions/deploy-pages` para publicar.

O `vite.config.ts` usa uma base condicional:

```ts
base: process.env.GITHUB_ACTIONS ? "/praticasieleespanhol/" : "/"
```

Isso permite que a aplicação funcione no desenvolvimento local e também no subcaminho do GitHub Pages.

A configuração do Pages ainda precisa estar habilitada no repositório em:

```text
Settings → Pages → Build and deployment → Source: GitHub Actions
```

O workflow já foi corrigido para não declarar a versão do pnpm duas vezes. A versão do pnpm deve continuar sendo definida apenas em `package.json`, em `packageManager`.

Se o GitHub Pages não aceitar a publicação por causa da visibilidade privada do repositório ou das limitações do plano, não tornar o repositório público automaticamente. Nesse caso, avaliar uma hospedagem privada ou solicitar ao proprietário uma decisão explícita sobre a visibilidade.

## 8. Comandos de desenvolvimento

Na máquina de desenvolvimento:

```bash
cd /home/ubuntu/siele-pratica-casa
pnpm install
pnpm check
pnpm build
pnpm dev
```

O comando `pnpm check` valida o TypeScript. O comando `pnpm build` gera a versão de produção em `dist/public` e também executa o empacotamento auxiliar do template.

Antes de enviar mudanças ao GitHub:

```bash
git status
git add .
git commit -m "Descrição curta da alteração"
git push github main
```

## 9. Limitações atuais

As limitações conhecidas são:

1. Não há autenticação.
2. Não há banco de dados remoto.
3. Não há sincronização entre aparelhos.
4. O armazenamento de arquivos grandes em `localStorage` pode atingir o limite do navegador.
5. A captura manual depende do suporte do navegador a `getDisplayMedia`.
6. A gravação depende da permissão de microfone e do suporte a `MediaRecorder`.
7. A aplicação não captura automaticamente todo o áudio reproduzido pelo simulador.
8. A aplicação não acessa automaticamente o texto interno do domínio do SIELE.
9. A aplicação não transcreve áudios.
10. A aplicação não oferece correção oficial ou conversão oficial para B2.
11. O GitHub Pages, quando configurado, hospeda o código da aplicação, mas não deve armazenar as sessões pessoais.
12. O JSON pode incluir Data URLs grandes e não deve ser colocado em repositório público.

## 10. Regras de privacidade e segurança

Qualquer IA que continuar este projeto deve respeitar as seguintes regras:

- não enviar respostas, capturas ou áudios para um servidor sem ação explícita da usuária;
- não incluir arquivos de sessão no GitHub;
- não criar autenticação ou coleta de dados pessoais sem necessidade;
- não publicar perguntas, textos ou áudios do simulador como banco de conteúdo;
- não tentar burlar controles do navegador, CORS ou mecanismos do site SIELE;
- manter claro na interface que o projeto não é oficial do SIELE;
- manter a exportação local como caminho principal;
- permitir apagar sessões e anexos em versões futuras;
- pedir permissões de tela e microfone somente no momento em que a função for acionada.

## 11. Como avaliar B2 sem inventar uma nota oficial

A futura camada de análise deve produzir uma avaliação pedagógica por critérios, não uma falsa nota SIELE. Para escrita, analisar:

- cumprimento da tarefa;
- coerência e coesão;
- organização do texto;
- variedade e precisão lexical;
- controle gramatical;
- adequação ao registro;
- argumentação e desenvolvimento das ideias;
- erros recorrentes.

Para oral, analisar:

- fluência;
- pausas e hesitações;
- pronúncia;
- inteligibilidade;
- vocabulário;
- gramática;
- interação;
- capacidade de explicar, comparar, justificar e narrar.

O resultado ideal de uma IA deve conter:

1. pontos fortes;
2. erros transcritos com correção sugerida;
3. explicação do erro;
4. prioridade de estudo;
5. estimativa de proximidade com B2;
6. incertezas da análise;
7. recomendação de avaliação por professor.

A IA deve diferenciar claramente:

```text
Resultado objetivo de prática ≠ nota oficial SIELE
Estimativa pedagógica ≠ certificado SIELE
```

## 12. Próximas etapas recomendadas

A evolução recomendada é:

### Etapa A — estabilização

- habilitar e testar o GitHub Pages;
- testar captura de tela em Chrome e Firefox;
- testar microfone em uma tarefa oral;
- realizar uma sessão curta e abrir o ZIP gerado;
- testar a recuperação após recarregar a página.

### Etapa B — robustez dos dados

- adicionar botão para apagar uma sessão;
- adicionar confirmação antes de apagar;
- permitir editar uma tarefa salva;
- reduzir o tamanho das capturas antes de salvar;
- migrar anexos grandes para IndexedDB;
- adicionar indicador de espaço e backup recomendado.

### Etapa C — qualidade do material para correção

- gerar um índice de tarefas no PDF;
- incluir miniaturas das capturas;
- criar uma ficha de avaliação B2 para o professor;
- incluir tempo gasto por tarefa;
- incluir transcrição manual ou automática do áudio;
- permitir exportar um pacote sem dados pessoais.

### Etapa D — análise assistida

- adicionar uma tela de revisão antes do envio para IA;
- permitir selecionar quais tarefas serão analisadas;
- transcrever áudio;
- produzir relatório com critérios de escrita e oralidade;
- acompanhar evolução entre sessões;
- manter todos os resultados como estimativas pedagógicas.

## 13. Instruções para qualquer IA que continuar o projeto

Antes de modificar o código:

1. ler este arquivo;
2. verificar o estado do Git e o último commit;
3. preservar o armazenamento local e o formato dos dados, salvo se houver migração planejada;
4. não mover a entrada principal sem atualizar o workflow e a configuração do Vite;
5. executar `pnpm check` e `pnpm build` após alterações relevantes;
6. não adicionar backend ou serviço remoto sem explicar o impacto sobre privacidade;
7. não afirmar que a ferramenta produz nota oficial SIELE;
8. atualizar este documento quando uma funcionalidade importante for concluída;
9. publicar alterações somente na branch `main`, salvo decisão diferente do proprietário;
10. testar pelo menos uma vez a interface e a exportação antes de entregar.

O objetivo do projeto é construir um instrumento doméstico simples, seguro e útil para transformar tentativas do simulador em material organizado para aprendizagem. A prioridade é preservar a autenticidade das respostas da candidata e facilitar uma avaliação humana ou assistida por IA, sem prometer uma certificação que a aplicação não pode emitir.

## Referências

[1]: https://examendemo.siele.org/ "Simulador oficial de prática do SIELE"

[2]: https://siele.org/examen "Página oficial sobre os exames e a estrutura do SIELE"

[3]: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages "Documentação oficial sobre workflows personalizados do GitHub Pages"

[4]: https://github.com/actions/configure-pages "Action oficial configure-pages do GitHub"
