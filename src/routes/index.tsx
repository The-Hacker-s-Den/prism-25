import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileSearch,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  NotebookPen,
  Radio,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prismFinale from "@/assets/prism-finale.png";
import prismMoth from "@/assets/prism-moth.png";
import prismWarehouse from "@/assets/prism-warehouse.png";
import prismWeb from "@/assets/prism-web.png";
import {
  CASE_FILES,
  getCaseScore,
  getInvestigatorRank,
  isAnswerCorrect,
  normalizeAnswer,
} from "@/lib/prism-game";
import type { CaseFile } from "@/lib/prism-game";

const CASE_ART = [prismWeb, prismWarehouse, prismMoth, prismFinale] as const;

type Screen = "briefing" | "investigation" | "case-complete" | "review" | "report";

type CaseProgress = {
  explored: string[];
  incorrectAnswers: number;
  hintsUsed: number;
  solved: boolean;
  score: number;
  codeSaved: boolean | null;
  computerUnlocked: boolean;
};

function freshProgress(): CaseProgress[] {
  return CASE_FILES.map(() => ({
    explored: [],
    incorrectAnswers: 0,
    hintsUsed: 0,
    solved: false,
    score: 0,
    codeSaved: null,
    computerUnlocked: false,
  }));
}

function isCaseComplete(progress: CaseProgress, caseIndex: number) {
  return progress.solved && (caseIndex !== 1 || progress.codeSaved !== null);
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PRISM-25 — A Cipher Mystery" },
      {
        name: "description",
        content:
          "Investigate four connected cases, gather evidence, and crack the ciphers behind PRISM-25.",
      },
      { property: "og:title", content: "PRISM-25 — A Cipher Mystery" },
      {
        property: "og:description",
        content:
          "A four-chapter detective mystery. Follow the evidence, decode the messages, and uncover who is behind PRISM-25.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrismGame,
});

function PrismGame() {
  const [screen, setScreen] = useState<Screen>("briefing");
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState<CaseProgress[]>(freshProgress);
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackTone, setFeedbackTone] = useState<"error" | "success" | "">("");
  const [visibleHint, setVisibleHint] = useState("");

  const activeCase = CASE_FILES.at(activeIndex);
  const activeArt = CASE_ART.at(activeIndex);
  const activeProgress = progress.at(activeIndex);

  const updateProgress = (index: number, update: (current: CaseProgress) => CaseProgress) => {
    setProgress((current) => current.map((record, recordIndex) => (recordIndex === index ? update(record) : record)));
  };

  if (!activeCase || !activeArt || !activeProgress) return null;

  const completedCount = progress.filter((item, index) => isCaseComplete(item, index)).length;
  const totalScore = progress.reduce((total, item) => total + item.score, 0);
  const notebookCodeSaved = progress.at(1)?.codeSaved === true;
  const puzzleUnlocked = activeProgress.explored.includes(activeCase.unlockFinding);
  const isAccessCode = activeIndex === 3 && !activeProgress.computerUnlocked;
  const selectedFindingData = activeCase.findings.find((finding) => finding.id === selectedFinding);
  const nextOpenIndex = progress.findIndex((item, index) => !isCaseComplete(item, index));

  const resetTransientState = () => {
    setAnswer("");
    setFeedback("");
    setFeedbackTone("");
    setVisibleHint("");
    setSelectedFinding(null);
  };

  const updateActiveProgress = (update: (current: CaseProgress) => CaseProgress) => {
    updateProgress(activeIndex, update);
  };

  const openCase = (index: number) => {
    const selectedProgress = progress.at(index);
    if (!selectedProgress) return;
    setActiveIndex(index);
    setScreen(isCaseComplete(selectedProgress, index) ? "review" : "briefing");
    resetTransientState();
  };

  const exploreFinding = (findingId: string) => {
    setSelectedFinding(findingId);
    updateActiveProgress((current) => ({
      ...current,
      explored: current.explored.includes(findingId)
        ? current.explored
        : [...current.explored, findingId],
    }));
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!answer.trim()) return;

    if (isAccessCode) {
      if (normalizeAnswer(answer) === "8492") {
        updateActiveProgress((current) => ({ ...current, computerUnlocked: true }));
        setAnswer("");
        setFeedback("Access granted. The encrypted evidence file is open.");
        setFeedbackTone("success");
      } else {
        updateActiveProgress((current) => ({ ...current, incorrectAnswers: current.incorrectAnswers + 1 }));
        setAnswer("");
        setFeedback("Access denied. Check the supplier entry in your notes.");
        setFeedbackTone("error");
      }
      return;
    }

    if (isAnswerCorrect(activeIndex, answer)) {
      updateActiveProgress((current) => ({
        ...current,
        solved: true,
        score: getCaseScore(current.incorrectAnswers, current.hintsUsed),
      }));
      setAnswer("");
      setFeedback("");
      setFeedbackTone("");
      if (activeIndex !== 1) setScreen("case-complete");
    } else {
      updateActiveProgress((current) => ({ ...current, incorrectAnswers: current.incorrectAnswers + 1 }));
      setAnswer("");
      setFeedback("That message doesn't fit the evidence. Try another reading.");
      setFeedbackTone("error");
    }
  };

  const revealHint = () => {
    const hint = activeCase.hints[Math.min(activeProgress.hintsUsed, activeCase.hints.length - 1)];
    if (!hint) return;
    setVisibleHint(hint);
    if (activeProgress.hintsUsed < activeCase.hints.length) {
      updateActiveProgress((current) => ({ ...current, hintsUsed: current.hintsUsed + 1 }));
    }
  };

  const chooseNotebook = (save: boolean) => {
    updateActiveProgress((current) => ({ ...current, codeSaved: save }));
    setScreen("case-complete");
  };

  const continueCase = () => {
    if (activeIndex === CASE_FILES.length - 1) {
      setScreen("report");
      return;
    }
    const nextIndex = activeIndex + 1;
    setActiveIndex(nextIndex);
    setScreen("briefing");
    resetTransientState();
  };

  const resumeOpenCase = () => {
    if (nextOpenIndex < 0) {
      setScreen("report");
      return;
    }
    setActiveIndex(nextOpenIndex);
    setScreen("briefing");
    resetTransientState();
  };

  const startNewInvestigation = () => {
    setProgress(freshProgress());
    setActiveIndex(0);
    setScreen("briefing");
    resetTransientState();
  };

  const caseProgressLabel = isCaseComplete(activeProgress, activeIndex)
    ? "CASE CLOSED"
    : screen === "briefing"
      ? activeCase.status
      : "ACTIVE INVESTIGATION";

  return (
    <div className="prism-shell">
      <header className="prism-topbar">
        <div className="prism-brand-lockup">
          <div className="prism-brand-mark" aria-hidden="true">
            <Fingerprint />
          </div>
          <div>
            <div className="prism-brand-name">PRISM<span>25</span></div>
            <div className="prism-brand-caption">MAJOR CASES UNIT</div>
          </div>
        </div>
        <div className="prism-top-status">
          <span className="status-light" aria-hidden="true" />
          <span>CASE ARCHIVE</span>
          <span className="status-divider" />
          <span>{completedCount} / 4 CLOSED</span>
        </div>
        <div className="prism-score-summary">
          <span>FIELD SCORE</span>
          <strong>{totalScore}<span> / 400</span></strong>
        </div>
      </header>

      <div className="prism-layout">
        <aside className="case-rail" aria-label="Case files">
          <div className="rail-heading">
            <span className="micro-label">INVESTIGATION</span>
            <h2>Case files</h2>
          </div>
          <div className="case-list">
            {CASE_FILES.map((caseFile, index) => {
              const record = progress.at(index);
              if (!record) return null;
              const previous = index === 0 ? undefined : progress.at(index - 1);
              const unlocked = index === 0 || (previous !== undefined && isCaseComplete(previous, index - 1));
              const complete = isCaseComplete(record, index);
              const active = index === activeIndex && screen !== "report";

              return (
                <Button
                  key={caseFile.number}
                  type="button"
                  variant="ghost"
                  disabled={!unlocked}
                  onClick={() => openCase(index)}
                  className={`case-nav-item${active ? " is-active" : ""}${complete ? " is-complete" : ""}`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="case-nav-number">{caseFile.number}</span>
                  <span className="case-nav-copy">
                    <strong>{caseFile.title}</strong>
                    <span>{complete ? `FILED · ${record.score} PTS` : unlocked ? caseFile.location : "SEALED FILE"}</span>
                  </span>
                  <span className="case-nav-mark" aria-hidden="true">
                    {complete ? <CheckCircle2 /> : unlocked ? <CircleDot /> : <LockKeyhole />}
                  </span>
                </Button>
              );
            })}
          </div>

          <div className="rail-bottom">
            <div className="rail-seal"><ShieldCheck /><span>OFFICIAL<br />CASE RECORD</span></div>
            <div className="rail-total">
              <span className="micro-label">INVESTIGATOR RANK</span>
              <strong>{getInvestigatorRank(totalScore)}</strong>
            </div>
          </div>
        </aside>

        <main className="case-main">
          {screen === "report" ? (
            <FinalReport
              progress={progress}
              totalScore={totalScore}
              onRestart={startNewInvestigation}
              onReview={(index) => openCase(index)}
            />
          ) : (
            <>
              <section className="case-stage" aria-label={`${activeCase.title} scene`}>
                <img className="case-stage-image" src={activeArt} alt={`${activeCase.location}, the current investigation scene`} />
                <div className="case-stage-shade" aria-hidden="true" />
                <div className="case-stage-topline">
                  <span><Radio /> {caseProgressLabel}</span>
                  <span>FILE {activeCase.number} <i> / </i> 04</span>
                </div>
                <div className="case-stage-copy">
                  <p className="case-kicker">{activeCase.location.toUpperCase()}</p>
                  <h1>{activeCase.title}</h1>
                  <p className="case-stage-subtitle">{activeCase.subtitle}</p>
                </div>
                <div className="case-stage-index" aria-hidden="true">{activeCase.number}<span> / 04</span></div>
              </section>

              <div className="case-main-content">
                {screen === "briefing" && (
                  <section className="briefing-panel">
                    <div className="briefing-heading">
                      <div className="briefing-icon"><FileSearch /></div>
                      <div>
                        <p className="micro-label">{activeCase.chapter}</p>
                        <h2>Initial report</h2>
                      </div>
                    </div>
                    <p className="briefing-copy">{activeCase.opening}</p>
                    <Button type="button" onClick={() => setScreen("investigation")} className="case-primary-button">
                      Enter the scene <ArrowRight />
                    </Button>
                  </section>
                )}

                {screen === "investigation" && (!activeProgress.solved || (activeIndex === 1 && activeProgress.codeSaved === null)) && (
                  <>
                    <section className="findings-section">
                      <div className="section-heading-row">
                        <div>
                          <p className="micro-label">SCENE WORK</p>
                          <h2>Examine the evidence</h2>
                        </div>
                        <span className="section-count">{activeProgress.explored.length} / {activeCase.findings.length} REVIEWED</span>
                      </div>
                      <div className="finding-list">
                        {activeCase.findings.map((finding, index) => {
                          const found = activeProgress.explored.includes(finding.id);
                          const selected = selectedFinding === finding.id;
                          return (
                            <Button
                              key={finding.id}
                              type="button"
                              variant="ghost"
                              onClick={() => exploreFinding(finding.id)}
                              className={`finding-item${selected ? " is-selected" : ""}${found ? " is-found" : ""}`}
                              aria-pressed={selected}
                            >
                              <span className="finding-index">0{index + 1}</span>
                              <span className="finding-icon"><Search /></span>
                              <span className="finding-copy">
                                <strong>{finding.title}</strong>
                                <span>{finding.description}</span>
                              </span>
                              <span className="finding-state" aria-hidden="true">{found ? <Check /> : <ChevronRight />}</span>
                            </Button>
                          );
                        })}
                      </div>

                      {selectedFindingData && (
                        <div className="finding-detail" aria-live="polite">
                          <div className="finding-detail-topline">
                            <span><CheckCircle2 /> {selectedFindingData.stamp}</span>
                            <span>FILE {activeCase.number}</span>
                          </div>
                          <h3>{selectedFindingData.title}</h3>
                          <p>{selectedFindingData.detail}</p>
                        </div>
                      )}
                    </section>

                    {puzzleUnlocked && !activeProgress.solved && (
                      <section className="cipher-console">
                        <div className="cipher-console-heading">
                          <div className="cipher-icon"><KeyRound /></div>
                          <div>
                            <p className="micro-label">ENCRYPTED EVIDENCE</p>
                            <h2>{isAccessCode ? "Unlock the computer" : "Decode the message"}</h2>
                          </div>
                          <span className="cipher-stamp">{activeIndex === 3 && !activeProgress.computerUnlocked ? "ACCESS CONTROL" : activeCase.cipherLabel}</span>
                        </div>

                        {isAccessCode ? (
                          <div className="access-panel">
                            <div className="access-note"><NotebookPen /><span>CHEMIST · VESPER · CODE</span></div>
                            <p>The four-digit access code is mentioned in the warehouse supplier entry.</p>
                          </div>
                        ) : (
                          <>
                            <div className="cipher-message">
                              <span className="micro-label">INTERCEPTED MESSAGE</span>
                              <p>{activeCase.cipherText}</p>
                            </div>
                            <p className="cipher-key-note">{activeCase.cipherKey}</p>
                          </>
                        )}

                        <form className="answer-form" onSubmit={submitAnswer}>
                          <label className="micro-label" htmlFor="case-answer">
                            {isAccessCode ? "FOUR-DIGIT ACCESS CODE" : "DECRYPTED MESSAGE"}
                          </label>
                          <div className="answer-row">
                            <Input
                              id="case-answer"
                              className="case-input"
                              value={answer}
                              onChange={(event) => setAnswer(event.target.value)}
                              placeholder={isAccessCode ? "Enter code" : "Enter the decoded message"}
                              autoComplete="off"
                              spellCheck={false}
                              inputMode={isAccessCode ? "numeric" : "text"}
                              aria-describedby={feedback ? "answer-feedback" : undefined}
                            />
                            <Button type="submit" disabled={!answer.trim()} className="case-primary-button">
                              {isAccessCode ? "Unlock" : "Submit"} <ArrowRight />
                            </Button>
                          </div>
                        </form>

                        {feedback && (
                          <p id="answer-feedback" className={`answer-feedback ${feedbackTone}`} role="status">
                            {feedbackTone === "success" ? <CheckCircle2 /> : <CircleDot />}
                            {feedback}
                          </p>
                        )}

                        {!isAccessCode && (
                          <div className="hint-row">
                            <Button type="button" variant="ghost" onClick={revealHint} className="hint-button">
                              <Sparkles /> Request a hint <span>{activeProgress.hintsUsed} / {activeCase.hints.length}</span>
                            </Button>
                            {visibleHint && <p className="hint-copy" aria-live="polite">{visibleHint}</p>}
                          </div>
                        )}
                      </section>
                    )}

                    {activeIndex === 1 && activeProgress.solved && activeProgress.codeSaved === null && (
                      <section className="decision-panel">
                        <p className="micro-label">A CHOICE FOR YOUR NOTEBOOK</p>
                        <h2>What will you do with the supplier code?</h2>
                        <p>The Lumos is gone. You can preserve the code for the clinic raid or leave it behind.</p>
                        <div className="decision-actions">
                          <Button type="button" onClick={() => chooseNotebook(true)} className="case-primary-button">
                            Save code 8492 <NotebookPen />
                          </Button>
                          <Button type="button" variant="outline" onClick={() => chooseNotebook(false)} className="case-secondary-button">
                            Leave it behind <ArrowRight />
                          </Button>
                        </div>
                      </section>
                    )}
                  </>
                )}

                {(screen === "case-complete" || screen === "review") && (
                  <section className="resolution-panel">
                    <div className="resolution-mark"><CheckCircle2 /></div>
                    <p className="micro-label">{screen === "review" ? "FILED CASE" : "CASE FILE COMPLETE"}</p>
                    <h2>{screen === "review" ? "Evidence preserved." : "The evidence holds."}</h2>
                    <p>{activeCase.revelation}</p>
                    {activeIndex === 1 && activeProgress.codeSaved === false && (
                      <div className="withheld-note"><LockKeyhole /><span>The supplier code was not added to your notebook.</span></div>
                    )}
                    {screen === "case-complete" && (
                      <div className="resolution-footer">
                        <span><ShieldCheck /> CASE SCORE <strong>{activeProgress.score} / 100</strong></span>
                        <Button type="button" onClick={continueCase} className="case-primary-button">
                          {activeIndex === CASE_FILES.length - 1 ? "Read final report" : "Proceed to next case"} <ArrowRight />
                        </Button>
                      </div>
                    )}
                    {screen === "review" && (
                      <Button type="button" onClick={resumeOpenCase} className="case-secondary-button" variant="outline">
                        <ArrowLeft /> Return to open case
                      </Button>
                    )}
                  </section>
                )}
              </div>
            </>
          )}
        </main>

        {screen !== "report" && (
          <aside className="notebook-rail" aria-label="Case notebook">
            <div className="notebook-heading">
              <div className="notebook-title-icon"><NotebookPen /></div>
              <div>
                <p className="micro-label">PERSONAL RECORD</p>
                <h2>Case notebook</h2>
              </div>
            </div>

            <div className="notebook-rule" />
            <div className="notebook-stat">
              <span>ACTIVE FILE</span>
              <strong>{activeCase.number} <i>—</i> {activeCase.title}</strong>
            </div>

            <div className="notebook-entry-list">
              {progress.map((record, index) => {
                const caseFile = CASE_FILES.at(index);
                if (!caseFile || !isCaseComplete(record, index)) return null;
                const notes = [
                  "The Hollow chat leads to a supplier called The Lumos.",
                  notebookCodeSaved ? "Alias Vesper · override code 8492." : "Alias Vesper identified; supplier code not saved.",
                  "St Jude Clinic is shared by both victims.",
                  "Vance is implicated. The chemist escaped before the raid.",
                ];
                const note = notes.at(index);
                if (!note) return null;
                return (
                  <div className="notebook-entry" key={caseFile.number}>
                    <span className="notebook-entry-no">{caseFile.number}</span>
                    <p>{note}</p>
                  </div>
                );
              })}
              {completedCount === 0 && (
                <div className="notebook-empty">
                  <span className="notebook-empty-mark">01</span>
                  <p>Your first finding is waiting at the scene.</p>
                </div>
              )}
            </div>

            <div className="notebook-bottom">
              <div className="notebook-metric">
                <span><CheckCircle2 /> CASES CLOSED</span>
                <strong>{completedCount}<i> / 04</i></strong>
              </div>
              <div className="notebook-metric">
                <span><Sparkles /> HINTS USED</span>
                <strong>{progress.reduce((total, record) => total + record.hintsUsed, 0)}</strong>
              </div>
            </div>

            {completedCount === CASE_FILES.length && (
              <Button type="button" variant="ghost" onClick={() => setScreen("report")} className="report-shortcut">
                Open final report <ChevronRight />
              </Button>
            )}
          </aside>
        )}
      </div>

      <footer className="prism-footer">
        <span>PRISM-25 <i>·</i> MAJOR CASES UNIT</span>
        <span>CONFIDENTIAL INVESTIGATION RECORD</span>
        <span>{activeCase.location.toUpperCase()}</span>
      </footer>
    </div>
  );
}

function FinalReport({
  progress,
  totalScore,
  onRestart,
  onReview,
}: {
  progress: CaseProgress[];
  totalScore: number;
  onRestart: () => void;
  onReview: (index: number) => void;
}) {
  return (
    <section className="final-report">
      <div className="report-topline"><span><ShieldCheck /> FINAL REPORT</span><span>PRISM-25 / CLOSED</span></div>
      <div className="report-title-block">
        <p className="micro-label">CASE ARCHIVE · 004 FILES</p>
        <h1>Case closed.<br /><em>The truth remains.</em></h1>
        <p>Dr Julian Vance and his suppliers await trial. The chemist behind PRISM-25 boarded an international flight twenty minutes before the raid.</p>
      </div>
      <div className="report-score-block">
        <div><span>TOTAL FIELD SCORE</span><strong>{totalScore}<i> / 400</i></strong></div>
        <div className="report-rank"><span>FINAL RANK</span><strong>{getInvestigatorRank(totalScore)}</strong></div>
      </div>
      <div className="report-case-list">
        {CASE_FILES.map((caseFile, index) => {
          const record = progress.at(index);
          if (!record) return null;
          return (
            <Button
              key={caseFile.number}
              type="button"
              variant="ghost"
              className="report-case-row"
              onClick={() => onReview(index)}
            >
              <span className="report-case-number">{caseFile.number}</span>
              <span className="report-case-name"><strong>{caseFile.title}</strong><span>{caseFile.location}</span></span>
              <span className="report-case-score">{record.score}<i> / 100</i></span>
              <ChevronRight />
            </Button>
          );
        })}
      </div>
      <div className="report-epilogue">
        <div className="epilogue-mark"><Fingerprint /></div>
        <p>Somewhere, a chemist is still working.<br /><em>Every grief demands a price. Every formula hides a sin.</em></p>
      </div>
      <Button type="button" onClick={onRestart} className="case-primary-button report-restart">
        <RotateCcw /> Begin a new investigation
      </Button>
    </section>
  );
}
