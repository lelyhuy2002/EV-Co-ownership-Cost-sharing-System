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

// App-shared domain types (kept minimal for student-level clarity)
export interface Member {
  id: string;
  name: string;
  percent: number;
  color: string;
}

export interface BookingSlot {
  date: string;
  start: string;
  end?: string;
  endDate?: string;
  endTimeExpected?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  groupId: string;
  userId: string;
  slot: BookingSlot;
  status: string;
  createdAt: string;
}

export interface UsageEntry {
  id: string;
  bookingId: string;
  ts: string | number;
  usage: {
    recordedBy?: string;
    distanceKm?: number;
    durationMin?: number;
    cost?: number;
    paid?: boolean;
  };
}

export interface GroupInfo {
  id: string;
  vehicleName?: string;
  vehicleModel?: string;
}