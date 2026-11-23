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

export type ManualCipherId = "caesar" | "atbash" | "xor" | "vigenere";
export type ManualSectionId = "protocol" | "ciphers" | "lore" | "credits";

export const CIPHER_MANUAL = [
  {
    id: "caesar",
    title: "Caesar cipher",
    label: "SHIFT SUBSTITUTION",
    summary: "Each letter moves the same number of places around the alphabet.",
    method: "To decrypt, move each letter backward by the stated shift. Wrap Z back to A.",
    formula: "D(x) = (x − k) mod 26",
    key: "Case 001 uses a shift of 3.",
    example: "V moves back three places to S.",
  },
  {
    id: "atbash",
    title: "Atbash",
    label: "REVERSE ALPHABET",
    summary: "Each letter is replaced by its mirror across the alphabet.",
    method: "A maps to Z, B to Y, and the same reversed mapping decrypts the text.",
    formula: "A ↔ Z · B ↔ Y · C ↔ X",
    key: "Numbers and spaces stay as written.",
    example: "XSVNRHG decodes to CHEMIST.",
  },
  {
    id: "xor",
    title: "Single-character XOR",
    label: "BYTE OPERATION",
    summary: "Each hexadecimal byte is combined with the same one-character key.",
    method: "Convert each hex byte, XOR it with the key byte, then read the ASCII character.",
    formula: "0x18 XOR 0x4B = 0x53",
    key: "The key is K: decimal 75, hexadecimal 4B.",
    example: "0x53 is the ASCII letter S.",
  },
  {
    id: "vigenere",
    title: "Vigenère cipher",
    label: "REPEATING KEYWORD",
    summary: "A repeated keyword gives each letter its own alphabet shift.",
    method: "Repeat VESPER across letters only, then subtract each key-letter value to decrypt.",
    formula: "P(x) = (C(x) − K(x)) mod 26",
    key: "The keyword repeats across the message; spaces do not consume key letters.",
    example: "Q minus V wraps around the alphabet to V.",
  },
] as const;

export const INVESTIGATION_PROTOCOL = {
  steps: [
    { title: "Briefing", detail: "Read the case file and enter the scene." },
    { title: "Examination", detail: "Inspect every available item; discoveries stay in your notebook." },
    { title: "Cipher analysis", detail: "Use the evidence and cipher key to decode the locked message." },
    { title: "Resolution", detail: "Close the case, preserve any important clue, and follow the next lead." },
  ],
  scoring: "Each case starts at 100 points. Wrong answers cost 10 points; requested case hints cost 20.",
  persistentClue: "The supplier code 8492 can be saved in Case 002 and used at the clinic computer in Case 004.",
  rank: "Your final investigator rank is based on the total score across all four cases.",
} as const;

export const CASE_LORE = [
  {
    title: "The inspiration",
    detail: "PRISM-25 takes inspiration from the C-drama The Truth Within.",
  },
  {
    title: "PRISM-25",
    detail: "A fictional psychedelic at the center of the case files, linked to light-triggered hallucinations, guilt, shame, and detachment.",
  },
  {
    title: "The chemist",
    detail: "A university professor's private research into treatment-resistant depression turns into an attempt to bring back someone he lost.",
  },
  {
    title: "Dr. Vance",
    detail: "A psychiatrist who once treated patients ethically lets personal grief draw him into illegal trials.",
  },
  {
    title: "The Lumos",
    detail: "A supplier inside The Hollow presents PRISM-25 as help to vulnerable members of the online group.",
  },
] as const;

export const CASE_CREDITS = ["Hania Nauman", "Rameen Arjmand", "Shaheer"] as const;

export const FINAL_EPILOGUE = [
  {
    chapter: "THREE WEEKS LATER",
    title: "The headlines read the same everywhere.",
    paragraphs: [
      "ST JUDE CLINIC SEALED. DR. VANCE CHARGED.",
      "Dr. Julian Vance, The Lumos, and every supplier tied to PRISM-25 now wait for trial. The victims' families finally have names for what happened to them.",
    ],
  },
  {
    chapter: "THE HOLLOW",
    title: "The group chat goes quiet.",
    paragraphs: [
      "The Hollow has been taken offline. Its members have been contacted by counselors—this time, with real help.",
    ],
  },
  {
    chapter: "ONE FILE NEVER MADE IT INTO EVIDENCE",
    title: "Every trail pointed to Vesper.",
    paragraphs: [
      "The pharmacy batch tag. The notebook. The override code. No name, no face—only a seat on an international flight that took off twenty minutes before the raid.",
      "You close your notebook. Somewhere, a chemist is still working.",
    ],
    quote: "Every grief demands a price. Every formula hides a sin.",
  },
] as const;

export function shiftCaesar(value: string, shift: number, direction: "encrypt" | "decrypt" = "encrypt") {
  const normalized = ((Math.trunc(shift) % 26) + 26) % 26;
  const amount = direction === "encrypt" ? normalized : -normalized;

  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    if (!isUpper && !isLower) return character;
    const base = isUpper ? 65 : 97;
    return String.fromCharCode(((code - base + amount + 26) % 26) + base);
  }).join("");
}

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