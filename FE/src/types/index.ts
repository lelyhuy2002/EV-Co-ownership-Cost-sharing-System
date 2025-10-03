export interface Testimonial {
  text: string;
  avatar: string;
  name: string;
  position: string;
  company: string;
  companyLogo: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Partner {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface NavigationItem {
  href: string;
  label: string;
  emoji: string;
  id: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: string;
}
