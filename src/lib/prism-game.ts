export type CaseFinding = {
  id: string;
  title: string;
  description: string;
  detail: string;
  stamp: string;
};

export type CaseFile = {
  number: string;
  title: string;
  chapter: string;
  location: string;
  subtitle: string;
  opening: string;
  status: string;
  findings: CaseFinding[];
  unlockFinding: string;
  cipherLabel: string;
  cipherText: string;
  cipherKey: string;
  hints: string[];
  revelation: string;
};

export const CASE_FILES: CaseFile[] = [
  {
    number: "001",
    title: "The Web",
    chapter: "A room full of silence",
    location: "Victim's residence",
    subtitle: "Every secret leaves a trace.",
    opening:
      "The bedroom is still. A phone glows on the floor while fine webs gather in the corners. Nothing about the scene feels accidental.",
    status: "ACTIVE INVESTIGATION",
    findings: [
      {
        id: "forensics",
        title: "Forensic examination",
        description: "The medical examiner's first report",
        detail:
          "The victim was 24. Severe internal damage, extreme light sensitivity, and traces of velvet spiders are noted. The toxicology screen flags PRISM-25.",
        stamp: "MEDICAL EXAMINER",
      },
      {
        id: "phone",
        title: "Search the bedroom",
        description: "A device lies beside the bed",
        detail:
          "A password-protected phone contains a group chat called THE HOLLOW. A contact called The Lumos posted a message: VSLGHU LQ WKH GDUN.",
        stamp: "EVIDENCE 01-A",
      },
    ],
    unlockFinding: "phone",
    cipherLabel: "CAESAR CIPHER · SHIFT 3",
    cipherText: "VSLGHU LQ WKH GDUN",
    cipherKey: "Shift every letter three places backward.",
    hints: [
      "The broken clock is three hours behind.",
      "Each letter moved three places forward when the message was written.",
      "Move V back to S. Keep the spaces between words.",
    ],
    revelation:
      "The phone opens to a group called THE HOLLOW. The Lumos offers free doses of PRISM-25 to people looking for help.",
  },
  {
    number: "002",
    title: "The Undercover Drop",
    chapter: "A meeting that never happened",
    location: "Abandoned textile warehouse",
    subtitle: "Every mask hides a motive.",
    opening:
      "At five in the morning, the warehouse is empty except for a swinging bulb, scattered glassware, and fresh boot prints leading out the back.",
    status: "UNDERCOVER OPERATION",
    findings: [
      {
        id: "glassware",
        title: "Examine the glassware",
        description: "Residue clings to the glass",
        detail:
          "The residue is PRISM-25. It was stored here, not made here. Whoever supplied it is working somewhere larger.",
        stamp: "LAB TRACE",
      },
      {
        id: "notebook",
        title: "Search the workbench",
        description: "A notebook was left behind",
        detail:
          "A supplier entry is written in a reverse alphabet. On the cover: “Your fate will mirror you.” The last four digits look important.",
        stamp: "EVIDENCE 02-B",
      },
    ],
    unlockFinding: "notebook",
    cipherLabel: "ATBASH · REVERSE ALPHABET",
    cipherText: "XSVNRHG ZORZH EVHKVI XLWV 8492",
    cipherKey: "A becomes Z. B becomes Y. Numbers stay as written.",
    hints: [
      "The notebook says your fate will mirror you.",
      "The alphabet is reversed: A becomes Z, B becomes Y, C becomes X.",
      "The first word is CHEMIST. The four digits do not change.",
    ],
    revelation:
      "The supplier entry names a chemist alias: VESPER. Code 8492 may open a door that the suspect thought was safe.",
  },
  {
    number: "003",
    title: "The Moth",
    chapter: "Under the lights",
    location: "Theatre lighting studio",
    subtitle: "Some things are drawn to the light.",
    opening:
      "The stage is empty beneath the harsh studio lamps. Another technician is dead, and the same drug appears in the case file.",
    status: "ACTIVE INVESTIGATION",
    findings: [
      {
        id: "technician",
        title: "Examine the technician",
        description: "The second forensic report",
        detail:
          "The victim worked the lighting board. Severe eye damage mirrors the first case. PRISM-25 appears in the toxicology report again.",
        stamp: "MEDICAL EXAMINER",
      },
      {
        id: "lamps",
        title: "Inspect the studio lamps",
        description: "The beams are aimed at the stage",
        detail:
          "High-wattage lamps face the stage. The technician may have stared into them for hours. One recorded PRISM-25 symptom is an attraction to light.",
        stamp: "SCENE ANALYSIS",
      },
      {
        id: "batch-tag",
        title: "Search beside the body",
        description: "A silver blister pack catches the light",
        detail:
          "A pharmacy batch tag is stamped in hexadecimal. The numbers are byte values; the key is K (decimal 75, hexadecimal 4B).",
        stamp: "EVIDENCE 03-C",
      },
    ],
    unlockFinding: "batch-tag",
    cipherLabel: "SINGLE-CHARACTER XOR · KEY K / 4B",
    cipherText:
      "18 1F 6B 01 1E 0F 0E 6B 1B 18 12 08 03 02 0A 1F 19 02 08 6B 08 07 02 05 02 08",
    cipherKey: "Convert each hex byte, XOR with 4B, then read the ASCII text.",
    hints: [
      "Hexadecimal is base 16. For example, 18 hex equals 24 decimal.",
      "Use the XOR operator with the key 75 (hex 4B).",
      "Convert each result to ASCII. The first two letters are ST.",
    ],
    revelation:
      "The decoded tag points to St Jude Psychiatric Clinic. Every victim had been a patient there.",
  },
  {
    number: "004",
    title: "The Finale",
    chapter: "The chemist's formula",
    location: "St Jude Psychiatric Clinic",
    subtitle: "Every formula hides a sin.",
    opening:
      "The clinic has been cleared. Dr Vance waits beside a locked computer, smiling as if the evidence will never reach him.",
    status: "CLINIC RAID",
    findings: [
      {
        id: "interrogation",
        title: "Question Dr Vance",
        description: "The director refuses to answer",
        detail:
          "Dr Vance stays calm and asks for a lawyer. With the case still building, you turn to the computer and the evidence already in your notebook.",
        stamp: "INTERVIEW LOG",
      },
      {
        id: "desk",
        title: "Inspect the director's desk",
        description: "A note is beside the locked computer",
        detail:
          "The handwritten note reads CHEMIST · VESPER · CODE. The supplier entry in your notebook may complete the four-digit password.",
        stamp: "EVIDENCE 04-A",
      },
    ],
    unlockFinding: "desk",
    cipherLabel: "VIGENÈRE CIPHER · KEY VESPER",
    cipherText: "QEFRI WPRVTH KCI LGMRGW LD WVZ LWG EXVMF X QLNX XAIV",
    cipherKey: "Repeat VESPER across the message and shift each letter backward.",
    hints: [
      "Repeat the keyword VESPER under the encrypted message.",
      "Subtract the key letter from the cipher letter. Q minus V gives V.",
      "The first word is VANCE.",
    ],
    revelation:
      "The files implicate Dr Julian Vance and his suppliers. But the chemist known as Vesper boarded a flight twenty minutes before the raid.",
  },
];

const CASE_SOLUTIONS = [
  "SPIDER IN THE DARK",
  "CHEMIST ALIAS VESPER CODE 8492",
  "ST JUDE PSYCHIATRIC CLINIC",
  "VANCE FUNDED THE TRIALS TO SEE HER AGAIN I MUST FLEE",
];

export function normalizeAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isAnswerCorrect(caseIndex: number, answer: string) {
  const expected = CASE_SOLUTIONS.at(caseIndex);
  return expected !== undefined && normalizeAnswer(answer) === normalizeAnswer(expected);
}

export function getCaseScore(incorrectAnswers: number, hintsUsed: number) {
  return Math.max(0, 100 - incorrectAnswers * 10 - hintsUsed * 20);
}

export function getInvestigatorRank(totalScore: number) {
  if (totalScore >= 350) return "MASTER DETECTIVE";
  if (totalScore >= 250) return "SENIOR INVESTIGATOR";
  if (totalScore >= 150) return "JUNIOR INVESTIGATOR";
  return "ROOKIE INVESTIGATOR";
}