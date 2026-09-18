/** USDA FNS Child Nutrition NDS (Dec 2022). Do not paraphrase. */
export const AD3027 = "https://www.usda.gov/sites/default/files/documents/ad-3027.pdf";
export const FILE_COMPLAINT = "https://www.usda.gov/oascr/how-to-file-a-program-discrimination-complaint";
export const NDS_EMAIL = "program.intake@usda.gov";
export const NDS_PHONE = "(866) 632-9992";
export const TARGET = "(202) 720-2600";
export const RELAY = "(800) 877-8339";
export const FAX = "(833) 256-1665 or (202) 690-7442";

export const LEGAL_SHORT = "This institution is an equal opportunity provider.";

export const LEGAL_FULL =
  "In accordance with federal civil rights law and U.S. Department of Agriculture (USDA) civil rights regulations and policies, this institution is prohibited from discriminating on the basis of race, color, national origin, sex (including gender identity and sexual orientation), disability, age, or reprisal or retaliation for prior civil rights activity. Program information may be made available in languages other than English. Persons with disabilities who require alternative means of communication to obtain program information (e.g., Braille, large print, audiotape, American Sign Language), should contact the responsible state or local agency that administers the program or USDA's TARGET Center at (202) 720-2600 (voice and TTY) or contact USDA through the Federal Relay Service at (800) 877-8339. To file a program discrimination complaint, a Complainant should complete a Form AD-3027, USDA Program Discrimination Complaint Form which can be obtained online at https://www.usda.gov/sites/default/files/documents/ad-3027.pdf, from any USDA office, by calling (866) 632-9992, or by writing a letter addressed to USDA. The letter must contain the complainant's name, address, telephone number, and a written description of the alleged discriminatory action in sufficient detail to inform the Assistant Secretary for Civil Rights (ASCR) about the nature and date of an alleged civil rights violation. The completed AD-3027 form or letter must be submitted to USDA by: (1) mail: U.S. Department of Agriculture, Office of the Assistant Secretary for Civil Rights, 1400 Independence Avenue, SW, Washington, D.C. 20250-9410; (2) fax: (833) 256-1665 or (202) 690-7442; or (3) email: program.intake@usda.gov. This institution is an equal opportunity provider.";

export function ndsHtml() {
  return `<p>In accordance with federal civil rights law and U.S. Department of Agriculture (USDA) civil rights regulations and policies, this institution is prohibited from discriminating on the basis of race, color, national origin, sex (including gender identity and sexual orientation), disability, age, or reprisal or retaliation for prior civil rights activity.</p>
<p>Program information may be made available in languages other than English. Persons with disabilities who require alternative means of communication to obtain program information (e.g., Braille, large print, audiotape, American Sign Language), should contact the responsible state or local agency that administers the program or USDA's TARGET Center at ${TARGET} (voice and TTY) or contact USDA through the Federal Relay Service at ${RELAY}.</p>
<p>To file a program discrimination complaint, a Complainant should complete a Form AD-3027, USDA Program Discrimination Complaint Form which can be obtained online at <a href="${AD3027}">${AD3027}</a>, from any USDA office, by calling ${NDS_PHONE}, or by writing a letter addressed to USDA. The letter must contain the complainant's name, address, telephone number, and a written description of the alleged discriminatory action in sufficient detail to inform the Assistant Secretary for Civil Rights (ASCR) about the nature and date of an alleged civil rights violation. The completed AD-3027 form or letter must be submitted to USDA by:</p>
<ol>
<li>mail: U.S. Department of Agriculture, Office of the Assistant Secretary for Civil Rights, 1400 Independence Avenue, SW, Washington, D.C. 20250-9410;</li>
<li>fax: ${FAX}; or</li>
<li>email: <a href="mailto:${NDS_EMAIL}">${NDS_EMAIL}</a>.</li>
</ol>
<p>${LEGAL_SHORT}</p>`;
}
