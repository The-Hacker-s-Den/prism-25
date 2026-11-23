import { describe, expect, it } from "vitest";

import {
  CASE_CREDITS,
  CASE_LORE,
  CIPHER_MANUAL,
  FINAL_EPILOGUE,
  getCaseScore,
  getInvestigatorRank,
  INVESTIGATION_PROTOCOL,
  isAnswerCorrect,
  shiftCaesar,
} from "@/lib/prism-game";

describe("PRISM-25 case rules", () => {
  it("accepts the four decrypted messages from the original case file", () => {
    expect(isAnswerCorrect(0, "spider in the dark")).toBe(true);
    expect(isAnswerCorrect(1, "chemist alias vesper code 8492")).toBe(true);
    expect(isAnswerCorrect(2, "St Jude Psychiatric Clinic")).toBe(true);
    expect(isAnswerCorrect(3, "Vance funded the trials to see her again I must flee")).toBe(true);
    expect(isAnswerCorrect(0, "spider in the light")).toBe(false);
  });

  it("deducts 10 points per wrong answer and 20 per hint, never below zero", () => {
    expect(getCaseScore(0, 0)).toBe(100);
    expect(getCaseScore(1, 1)).toBe(70);
    expect(getCaseScore(3, 5)).toBe(0);
  });

  it("assigns ranks at the original score thresholds", () => {
    expect(getInvestigatorRank(350)).toBe("MASTER DETECTIVE");
    expect(getInvestigatorRank(250)).toBe("SENIOR INVESTIGATOR");
    expect(getInvestigatorRank(150)).toBe("JUNIOR INVESTIGATOR");
    expect(getInvestigatorRank(149)).toBe("ROOKIE INVESTIGATOR");
  });

  it("documents all four case ciphers, including the repeating VESPER key", () => {
    expect(CIPHER_MANUAL.map((cipher) => cipher.id)).toEqual(["caesar", "atbash", "xor", "vigenere"]);
    expect(CIPHER_MANUAL[3]?.key).toContain("VESPER");
    expect(CIPHER_MANUAL[3]?.method).toContain("spaces do not consume");
  });

  it("keeps the manual's investigation costs and saved code aligned with the cases", () => {
    expect(INVESTIGATION_PROTOCOL.scoring).toContain("Wrong answers cost 10 points");
    expect(INVESTIGATION_PROTOCOL.scoring).toContain("hints cost 20");
    expect(INVESTIGATION_PROTOCOL.persistentClue).toContain("8492");
  });

  it("transforms Caesar text with alphabet wrap while keeping spaces and punctuation", () => {
    expect(shiftCaesar("A z!", 3)).toBe("D c!");
    expect(shiftCaesar("D c!", 3, "decrypt")).toBe("A z!");
  });

  it("includes the newest lore, credited authors, and complete epilogue beats", () => {
    expect(CASE_LORE.map((entry) => entry.title)).toContain("The chemist");
    expect(CASE_LORE[0]?.detail).toContain("The Truth Within");
    expect(CASE_CREDITS).toEqual(["Hania Nauman", "Rameen Arjmand", "Shaheer"]);
    expect(FINAL_EPILOGUE[2]?.paragraphs[0]).toContain("twenty minutes before the raid");
    expect(FINAL_EPILOGUE[2]?.quote).toContain("Every formula hides a sin");
  });
});