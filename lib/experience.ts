import { experience, fieldExperience } from "@/content/experience";

export function getExperience() {
  return experience;
}

export function getHomepageExperience() {
  return experience.slice(0, 2);
}

export function getFieldExperience() {
  return fieldExperience;
}
