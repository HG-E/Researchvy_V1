export interface ProgrammeConfig {
  displayName:     string;
  certificateType: string;
  code:            string;
}

export const PROGRAMMES: Record<string, ProgrammeConfig> = {
  "digital-visibility-clinic": {
    displayName:     "Digital Visibility Clinic",
    certificateType: "Certificate of Scholarly Visibility Practice",
    code:            "CSVP",
  },
  // Future programmes — add slug entries here:
  // "research-communication-bootcamp": {
  //   displayName:     "Research Communication Bootcamp",
  //   certificateType: "Certificate of Research Communication",
  //   code:            "CRC",
  // },
  // "digital-scholarly-identity": {
  //   displayName:     "Digital Scholarly Identity Programme",
  //   certificateType: "Certificate of Digital Scholarly Identity",
  //   code:            "CDSI",
  // },
};

const DEFAULT_PROGRAMME: ProgrammeConfig = {
  displayName:     "Digital Visibility Clinic",
  certificateType: "Certificate of Scholarly Visibility Practice",
  code:            "CSVP",
};

export function getProgramme(clinicSlug: string): ProgrammeConfig {
  return PROGRAMMES[clinicSlug] ?? DEFAULT_PROGRAMME;
}
