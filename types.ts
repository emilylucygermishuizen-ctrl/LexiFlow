
import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface Attachment {
  id: number;
  name: string;
  type: 'pdf' | 'doc' | 'img';
}

export interface Note {
  id: number;
  title: string;
  subject: string;
  attachments: Attachment[];
}

export interface Case {
  id: number;
  caseName: string;
  citation: string;
  subject: string;
}

export interface Event {
  id: number;
  title: string;
  type: 'Exam' | 'Assignment' | 'Meeting' | 'Holiday' | 'Class';
  date: Date;
  subject: string | null;
}

export type AppViewName = "Dashboard" | "Medicina Forensis" | "Commercial Transactions" | "Corporation Law" | "Civil Procedure" | "Labour Law" | "Administrative Law";

export interface AppView {
    name: AppViewName;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export interface ModalSource {
    uri: string;
    title: string;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  sources: ModalSource[];
  isLoading: boolean;
}
