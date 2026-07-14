export interface Dictionary {
  nav: {
    about: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
  };
  hero: {
    greeting: string;
    tagline: string;
    viewProjects: string;
    getInTouch: string;
    yearsExperience: string;
    coreStack: string;
    basedIn: string;
    scroll: string;
  };
  about: {
    label: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    quickFacts: string;
    factExperience: string;
    factLocation: string;
    factSpecialization: string;
    factCurrentFocus: string;
    factOpenTo: string;
    factExperienceValue: string;
    factSpecializationValue: string;
    factCurrentFocusValue: string;
    factOpenToValue: string;
    github: string;
    linkedin: string;
  };
  skills: {
    label: string;
    heading: string;
    subtitle: string;
  };
  experience: {
    label: string;
    heading: string;
  };
  projects: {
    label: string;
    heading: string;
    subtitle: string;
    highlights: string;
  };
  manifesto: {
    label: string;
    heading: string;
    resilience: string;
    resilienceBody: string;
    journey: string;
    journeyBody: string;
    vision: string;
    visionBody: string;
  };
  philosophy: {
    label: string;
    heading: string;
    subtitle: string;
  };
  techStack: {
    label: string;
    heading: string;
  };
  contact: {
    label: string;
    heading: string;
    body: string;
    sendEmail: string;
    linkedin: string;
    github: string;
  };
  footer: {
    builtWith: string;
  };
}
