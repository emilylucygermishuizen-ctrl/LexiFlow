
import { addDays, subDays } from 'date-fns';
import type { Note, Case, Event } from './types';

const today = new Date();

export const sampleNotes: Note[] = [
    { id: 1, title: "Torts - Elements of Negligence", subject: "Torts", attachments: [{ id: 1, name: "Negligence Case Law.pdf", type: "pdf" },{ id: 2, name: "Duty of Care outline.docx", type: "doc" }] },
    { id: 2, title: "Contracts - Offer and Acceptance", subject: "Commercial Transactions", attachments: [] },
    { id: 3, title: "Subject Matter Jurisdiction", subject: "Civil Procedure", attachments: [{ id: 3, name: "SMJ Flowchart.png", type: "img" }] },
    { id: 4, title: "First Amendment Speech", subject: "Administrative Law", attachments: [] },
    { id: 5, title: "Piercing the Corporate Veil", subject: "Corporation Law", attachments: [{id: 4, name: "Case v. Case.pdf", type: "pdf"}] },
    { id: 6, title: "Workplace Safety Standards", subject: "Labour Law", attachments: [] },
    { id: 7, title: "Autopsy Procedures", subject: "Medicina Forensis", attachments: [{id: 5, name: "Coroner Report.pdf", type: "pdf"}] },
    { id: 8, title: "Rule 12(b)(6) Motions", subject: "Civil Procedure", attachments: [] },
];
export const sampleCases: Case[] = [
    { id: 1, caseName: "Marbury v. Madison", citation: "5 U.S. 137 (1803)", subject: "Administrative Law" },
    { id: 2, caseName: "Palsgraf v. Long Island Railroad Co.", citation: "248 N.Y. 339 (1928)", subject: "Torts" },
    { id: 3, caseName: "International Shoe Co. v. Washington", citation: "326 U.S. 310 (1945)", subject: "Civil Procedure" },
    { id: 4, caseName: "Salomon v. A Salomon & Co Ltd", citation: "UKHL 1 (1896)", subject: "Corporation Law" },
    { id: 5, caseName: "NLRB v. Jones & Laughlin Steel Corp", citation: "301 U.S. 1 (1937)", subject: "Labour Law" },
    { id: 6, caseName: "Uniform Commercial Code (UCC) Art. 2", citation: "U.C.C. - Art. 2 (Sales)", subject: "Commercial Transactions" },
];

// Note: Storing dates as Date objects directly for easier manipulation.
export const sampleEvents: Event[] = [
    { id: 1, title: "Torts Midterm", type: "Exam", date: addDays(today, 2), subject: "Torts" },
    { id: 2, title: "Contracts Memo Due", type: "Assignment", date: addDays(today, 5), subject: "Commercial Transactions" },
    { id: 3, title: "Study Group - Civ Pro", type: "Meeting", date: today, subject: "Civil Procedure" },
    { id: 4, title: "Spring Break Begins", type: "Holiday", date: addDays(today, 10), subject: null },
    { id: 5, title: "Legal Writing Class", type: "Class", date: subDays(today, 2), subject: null },
    { id: 6, title: "Admin Law Review", type: "Meeting", date: addDays(today, 1), subject: "Administrative Law" },
    { id: 7, title: "Forensics Lab", type: "Class", date: addDays(today, 3), subject: "Medicina Forensis" },
];
