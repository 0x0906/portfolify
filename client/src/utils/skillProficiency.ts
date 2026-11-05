/**
 * Computes a distinct, normalized proficiency percentage (1-100) for a skill.
 * - Beginner: 35% (1/3 progress, 3/10 terminal blocks)
 * - Intermediate: 65% (~2/3 progress, 6/10 terminal blocks)
 * - Advanced: 100% (completed progress bar, 10/10 terminal blocks)
 */
export function getSkillProficiency(skill: { level?: string; proficiency?: number }): number {
  const lvl = skill.level?.toLowerCase()?.trim()

  if (lvl === "beginner") {
    if (typeof skill.proficiency === "number" && skill.proficiency > 0 && skill.proficiency <= 45) {
      return skill.proficiency
    }
    return 35
  }

  if (lvl === "intermediate") {
    if (typeof skill.proficiency === "number" && skill.proficiency >= 50 && skill.proficiency <= 75) {
      return skill.proficiency
    }
    return 65
  }

  if (lvl === "advanced" || lvl === "advance") {
    return 100
  }

  // Fallback if no level is provided but proficiency is set
  if (typeof skill.proficiency === "number" && skill.proficiency > 0) {
    return Math.min(100, Math.max(10, skill.proficiency))
  }

  return 50
}
