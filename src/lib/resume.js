/**
 * The résumé's download name is derived from the configured resumeLink so the
 * file can be swapped by editing landing.json alone. Hard-coding it in each
 * link meant every new résumé needed the same edit in several components.
 */
export const RESUME_FALLBACK = "/Vivek_Pandey_Data_Engineer.pdf";

/** "/a/b/Vivek_Pandey_Data_Engineer.pdf" -> "Vivek_Pandey_Data_Engineer.pdf" */
export const resumeFileName = (link) => {
  const path = (link || RESUME_FALLBACK).split(/[?#]/)[0];
  const name = path.substring(path.lastIndexOf("/") + 1);
  return name || "resume.pdf";
};
