import { useState } from "react";
import { BookOpen, Calculator, ChevronRight, KeyRound, NotebookPen, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CASE_CREDITS,
  CASE_LORE,
  CIPHER_MANUAL,
  INVESTIGATION_PROTOCOL,
  shiftCaesar,
  type ManualCipherId,
  type ManualSectionId,
} from "@/lib/prism-game";

type FieldManualDrawerProps = {
  open: boolean;
  section: ManualSectionId;
  onOpenChange: (open: boolean) => void;
  onSectionChange: (section: ManualSectionId) => void;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function FieldManualDrawer({
  open,
  section,
  onOpenChange,
  onSectionChange,
}: FieldManualDrawerProps) {
  const [activeCipher, setActiveCipher] = useState<ManualCipherId>("caesar");
  const [cipherText, setCipherText] = useState("SPIDER IN THE DARK");
  const [shift, setShift] = useState(3);
  const [direction, setDirection] = useState<"encrypt" | "decrypt">("encrypt");
  const selectedCipher = CIPHER_MANUAL.find((cipher) => cipher.id === activeCipher);

  const changeSection = (value: string) => {
    if (value === "protocol" || value === "ciphers" || value === "lore" || value === "credits") {
      onSectionChange(value);
    }
  };

  if (!selectedCipher) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="field-manual-sheet">
        <SheetHeader className="field-manual-header">
          <div className="field-manual-mark"><BookOpen aria-hidden="true" /></div>
          <div>
            <p className="micro-label">MAJOR CASES UNIT</p>
            <SheetTitle className="field-manual-title">Detective Field Manual</SheetTitle>
            <SheetDescription className="field-manual-description">
              Protocol, cipher notes, case background, and personnel.
            </SheetDescription>
          </div>
        </SheetHeader>

        <Tabs value={section} onValueChange={changeSection} className="field-manual-tabs">
          <TabsList className="field-manual-tabs-list" aria-label="Field manual sections">
            <TabsTrigger value="protocol">Protocol</TabsTrigger>
            <TabsTrigger value="ciphers">Ciphers</TabsTrigger>
            <TabsTrigger value="lore">Lore</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="protocol" className="field-manual-content">
            <p className="micro-label">INVESTIGATION PROTOCOL</p>
            <ol className="manual-step-list">
              {INVESTIGATION_PROTOCOL.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="manual-step-number">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                  {index < INVESTIGATION_PROTOCOL.steps.length - 1 && <ChevronRight aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <div className="manual-rule-block">
              <div className="manual-block-heading"><NotebookPen aria-hidden="true" /><h3>Field scoring</h3></div>
              <p>{INVESTIGATION_PROTOCOL.scoring}</p>
              <p>{INVESTIGATION_PROTOCOL.rank}</p>
            </div>
            <div className="manual-rule-block manual-saved-clue">
              <div className="manual-block-heading"><KeyRound aria-hidden="true" /><h3>Persistent clue</h3></div>
              <p>{INVESTIGATION_PROTOCOL.persistentClue}</p>
            </div>
          </TabsContent>

          <TabsContent value="ciphers" className="field-manual-content">
            <p className="micro-label">CIPHER FIELD GUIDE</p>
            <div className="field-cipher-choices" role="group" aria-label="Choose a cipher guide">
              {CIPHER_MANUAL.map((cipher) => (
                <Button
                  key={cipher.id}
                  type="button"
                  variant="ghost"
                  className={`field-cipher-choice${activeCipher === cipher.id ? " is-active" : ""}`}
                  aria-pressed={activeCipher === cipher.id}
                  onClick={() => setActiveCipher(cipher.id)}
                >
                  <span>{cipher.title}</span>
                  <ChevronRight aria-hidden="true" />
                </Button>
              ))}
            </div>

            <section className="manual-cipher-card" aria-live="polite">
              <span className="manual-cipher-label">{selectedCipher.label}</span>
              <h3>{selectedCipher.title}</h3>
              <p>{selectedCipher.summary}</p>
              <div className="manual-formula">{selectedCipher.formula}</div>
              <p>{selectedCipher.method}</p>
              <div className="manual-example">
                <span>CASE NOTE</span>
                <strong>{selectedCipher.example}</strong>
              </div>
              <p className="manual-key-note">{selectedCipher.key}</p>

              {activeCipher === "atbash" && (
                <div className="manual-atbash-grid" aria-label="Atbash alphabet pairs">
                  {Array.from({ length: 13 }, (_, index) => (
                    <span key={index}>
                      {ALPHABET[index]} <i>↔</i> {ALPHABET[25 - index]}
                    </span>
                  ))}
                </div>
              )}

              {activeCipher === "xor" && (
                <div className="manual-byte-row">
                  <span>HEX BYTE</span><strong>18</strong><i>⊕</i><strong>4B</strong><i>=</i><strong>53</strong><span>ASCII S</span>
                </div>
              )}

              {activeCipher === "vigenere" && (
                <div className="manual-vigenere-key">
                  <span>CIPHER</span><strong>Q</strong><span>KEY</span><strong>V</strong><span>PLAIN</span><strong>V</strong>
                </div>
              )}
            </section>

            {activeCipher === "caesar" && (
              <section className="manual-shift-helper">
                <div className="manual-block-heading"><Calculator aria-hidden="true" /><h3>Shift helper</h3></div>
                <label className="manual-field-label" htmlFor="manual-caesar-text">Message</label>
                <Input
                  id="manual-caesar-text"
                  value={cipherText}
                  onChange={(event) => setCipherText(event.target.value)}
                  className="manual-field-input"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="manual-helper-controls">
                  <div className="manual-direction-control" role="group" aria-label="Cipher direction">
                    <Button
                      type="button"
                      variant="ghost"
                      aria-pressed={direction === "encrypt"}
                      className={direction === "encrypt" ? "is-active" : ""}
                      onClick={() => setDirection("encrypt")}
                    >
                      Encrypt
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-pressed={direction === "decrypt"}
                      className={direction === "decrypt" ? "is-active" : ""}
                      onClick={() => setDirection("decrypt")}
                    >
                      Decrypt
                    </Button>
                  </div>
                  <label className="manual-shift-input-label" htmlFor="manual-caesar-shift">
                    Shift
                    <Input
                      id="manual-caesar-shift"
                      type="number"
                      min={0}
                      max={25}
                      value={shift}
                      onChange={(event) => {
                        const nextShift = Number(event.target.value);
                        if (Number.isFinite(nextShift)) setShift(Math.max(0, Math.min(25, nextShift)));
                      }}
                      className="manual-field-input manual-number-input"
                    />
                  </label>
                </div>
                <div className="manual-result-block">
                  <span>RESULT</span>
                  <strong>{shiftCaesar(cipherText, shift, direction) || "—"}</strong>
                </div>
                <div className="manual-alphabet-grid" aria-label="Caesar substitution table">
                  {Array.from(ALPHABET, (letter) => (
                    <span key={letter}>{letter}<i>→</i>{shiftCaesar(letter, shift, direction)}</span>
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="lore" className="field-manual-content">
            <p className="micro-label">CASE BACKGROUND · THE TRUTH WITHIN</p>
            <div className="manual-lore-list">
              {CASE_LORE.map((entry, index) => (
                <article className="manual-lore-entry" key={entry.title}>
                  <span>0{index + 1}</span>
                  <div><h3>{entry.title}</h3><p>{entry.detail}</p></div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="field-manual-content">
            <p className="micro-label">PERSONNEL RECORD</p>
            <div className="manual-credit-mark"><Users aria-hidden="true" /></div>
            <h3 className="manual-credit-title">Case file contributors</h3>
            <p className="manual-credit-note">The original PRISM-25 investigation was developed by:</p>
            <ul className="manual-credit-list">
              {CASE_CREDITS.map((name, index) => (
                <li key={name}><span>0{index + 1}</span><strong>{name}</strong></li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}