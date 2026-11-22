import { describe, expect, it } from "vitest";

import { getCaseScore, getInvestigatorRank, isAnswerCorrect } from "@/lib/prism-game";

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
});