import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, CalendarDays, Scale, Paperclip, Search, FileImage, WandSparkles, ListChecks, PlusCircle } from 'lucide-react';
import { format, isToday, isFuture } from 'date-fns';
import AiButton from './AiButton';
import { APP_VIEWS } from '../constants';
import type { Note, Case, Event, AppViewName, Attachment, Task } from '../types';

// Prop types for components
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  color: string;
}
interface SectionProps {
  title: string;
  icon: React.ElementType;
  emptyText: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}
interface DashboardViewProps {
  notes: Note[];
  cases: Case[];
  events: Event[];
  tasks: Task[];
  currentView: AppViewName;
  onDailyFocus: () => void;
  onExplainCase: (caseName: string, citation: string) => void;
  onStudyPlan: (eventTitle: string) => void;
  onSummarizeNote: (note: Note) => void;
  onAddTask: (title: string, description: string) => void;
  onToggleTask: (id: number) => void;
}
interface LayoutProps extends DashboardViewProps {
  caseSearchQuery: string;
  setCaseSearchQuery: (query: string) => void;
  noteSearchQuery: string;
  setNoteSearchQuery: (query: string) => void;
}


// --- Reusable Sub-Components (defined outside main component) ---

const NoteAttachments: React.FC<{ attachments: Attachment[] }> = ({ attachments }) => {
    if (attachments.length === 0) {
        return <span className="text-xs">No attachments</span>;
    }

    const getIcon = (type: Attachment['type']) => {
        switch (type) {
            case 'pdf':
                return <FileText className="w-4 h-4 text-red shrink-0" />;
            case 'doc':
                return <FileText className="w-4 h-4 text-blue shrink-0" />;
            case 'img':
                return <FileImage className="w-4 h-4 text-green shrink-0" />;
            default:
                return <Paperclip className="w-4 h-4 text-base01 shrink-0" />;
        }
    };
    
    const attachmentsToShow = attachments.slice(0, 3);
    const hasMore = attachments.length > 3;

    return (
        <div className="space-y-2">
            {attachmentsToShow.map(att => (
                <div key={att.id} className="flex items-center gap-2 text-xs text-base01">
                    {getIcon(att.type)}
                    <span className="truncate" title={att.name}>{att.name}</span>
                </div>
            ))}
            {hasMore && (
                <div className="text-xs text-base01 font-medium pl-[24px]">...</div>
            )}
        </div>
    );
};


const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  const Icon = icon;
  return (
    <motion.div 
      whileHover={{ y: -5, x: -2 }}
      className="bg-base2 rounded-sm border-2 border-base01 p-5 shadow-[4px_4px_0px_#93a1a1] flex items-center gap-4"
    >
      <div className={`p-3 rounded-sm ${color}`}>
        <Icon className="w-6 h-6 text-base3" />
      </div>
      <div>
        <p className="text-sm text-base01 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-base02">{value}</p>
      </div>
    </motion.div>
  );
};

const Section: React.FC<SectionProps> = ({ title, icon, emptyText, children, headerContent }) => {
  const Icon = icon;
  return (
    <div className="bg-base2 rounded-sm border-2 border-base01 p-5 shadow-[4px_4px_0px_#93a1a1]">
      <div className="flex items-center justify-between gap-3 mb-4 border-b-2 border-base1 pb-2">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-yellow"/>
          <h3 className="text-xl font-bold text-base02">{title}</h3>
        </div>
        {headerContent}
      </div>
      <div className="space-y-3">
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <p className="text-sm text-base01 text-center py-4">{emptyText}</p>
        )}
      </div>
    </div>
  );
};

// --- New Task Components ---
const TaskForm: React.FC<{ onAddTask: (title: string, description: string) => void }> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(title, description);
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mb-4 p-3 bg-base3 rounded-sm border-2 border-dashed border-base1">
            <input
                type="text"
                placeholder="New task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-base2 border-2 border-base1 rounded-sm px-2 py-1 text-sm w-full focus:outline-none focus:border-blue transition-colors"
                aria-label="New task title"
                required
            />
            <textarea
                placeholder="Add a description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-base2 border-2 border-base1 rounded-sm px-2 py-1 text-sm w-full focus:outline-none focus:border-blue transition-colors resize-none"
                aria-label="New task description"
            />
            <button type="submit" className="flex items-center gap-1.5 text-xs font-bold text-green bg-base3 border-2 border-base1 px-2 py-1 rounded-sm shadow-[2px_2px_0px_#93a1a1] transition-all hover:scale-105 active:scale-95">
                <PlusCircle className="w-3.5 h-3.5" />
                Add Task
            </button>
        </form>
    );
};

// --- Layouts ---
const DashboardLayout: React.FC<LayoutProps> = ({ notes, cases, events, tasks, onDailyFocus, onStudyPlan, onSummarizeNote, onExplainCase, onAddTask, onToggleTask, caseSearchQuery, setCaseSearchQuery, noteSearchQuery, setNoteSearchQuery }) => {
  const upcomingExamsCount = events.filter(event => (isToday(event.date) || isFuture(event.date)) && event.type === 'Exam').length;
  const upcomingEvents = events.filter(event => isToday(event.date) || isFuture(event.date)).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3);
  const recentNotes = [...notes].sort((a,b) => b.id - a.id).slice(0, 3);
  const recentCases = [...cases].sort((a,b) => b.id - a.id).slice(0, 3);
  
  const caseSearchBar = (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base01 pointer-events-none" />
      <input
        type="text"
        placeholder="Search cases..."
        value={caseSearchQuery}
        onChange={(e) => setCaseSearchQuery(e.target.value)}
        className="bg-base3 border-2 border-base1 rounded-sm pl-8 pr-2 py-1 text-sm w-full max-w-48 focus:outline-none focus:border-blue transition-colors"
        aria-label="Search cases by name or citation"
      />
    </div>
  );

  const noteSearchBar = (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base01 pointer-events-none" />
      <input
        type="text"
        placeholder="Search notes..."
        value={noteSearchQuery}
        onChange={(e) => setNoteSearchQuery(e.target.value)}
        className="bg-base3 border-2 border-base1 rounded-sm pl-8 pr-2 py-1 text-sm w-full max-w-48 focus:outline-none focus:border-blue transition-colors"
        aria-label="Search notes by title"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-yellow mt-1" />
          <div>
            <h2 className="text-4xl font-bold text-base02">Dura lex, sed lex</h2>
            <p className="text-base01 mt-1">Dashboard</p>
          </div>
        </div>
        <AiButton text="Daily Focus" onClick={onDailyFocus} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={FileText} title="Total Notes" value={notes.length} color="bg-blue" />
        <StatCard icon={Briefcase} title="Total Cases" value={cases.length} color="bg-green" />
        <StatCard icon={CalendarDays} title="Upcoming Exams" value={upcomingExamsCount} color="bg-red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section title="Upcoming Deadlines & Events" icon={CalendarDays} emptyText="No upcoming events. Enjoy the peace!">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-3 rounded-sm bg-base3 border-2 border-base1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base02">{event.title}</p>
                    <p className="text-sm text-base01">{event.type} {event.subject ? `(${event.subject})` : ''}</p>
                  </div>
                  <p className="text-sm font-bold text-orange shrink-0 ml-2">{format(event.date, 'MMM do')}</p>
                </div>
                {(event.type === 'Exam' || event.type === 'Assignment') && (
                  <div className="mt-3 pt-3 border-t border-base1"><AiButton text="Generate Study Plan" onClick={() => onStudyPlan(event.title)} /></div>
                )}
              </div>
            ))}
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Recent Notes" icon={FileText} emptyText={noteSearchQuery ? "No matching notes found." : "No notes yet. Start writing!"} headerContent={noteSearchBar}>
            {recentNotes.map(note => (
              <div key={note.id} className="p-3 rounded-sm bg-base3 border-2 border-base1">
                <p className="font-bold text-base02 truncate">{note.title}</p>
                <p className="text-sm text-blue font-semibold">{note.subject}</p>
                <div className="flex justify-between items-end mt-3 pt-3 border-t border-base1">
                  <NoteAttachments attachments={note.attachments} />
                  <AiButton text="Summarize" onClick={() => onSummarizeNote(note)} />
                </div>
              </div>
            ))}
          </Section>
          <Section title="Recent Cases" icon={Briefcase} emptyText={caseSearchQuery ? "No matching cases found." : "No cases added yet."} headerContent={caseSearchBar}>
            {recentCases.map(c => (
              <motion.div 
                key={c.id}
                onClick={() => onExplainCase(c.caseName, c.citation)}
                whileHover={{ y: -3, boxShadow: "3px 3px 0px #93a1a1" }}
                className="p-3 rounded-sm bg-base3 border-2 border-base1 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-base02 truncate">{c.caseName}</p>
                    <p className="text-sm text-green font-semibold">{c.citation}</p>
                    <p className="text-xs text-base01 font-medium">{c.subject}</p>
                  </div>
                  <WandSparkles className="w-4 h-4 text-yellow shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </Section>
          <Section title="Tasks" icon={ListChecks} emptyText="No tasks yet. Add one above!">
             <TaskForm onAddTask={onAddTask} />
             <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-3 p-2 rounded-sm bg-base3 border border-base1 transition-colors ${task.isCompleted ? 'bg-opacity-70' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => onToggleTask(task.id)}
                            className="mt-1 w-4 h-4 accent-green bg-base2 border-base1 rounded focus:ring-green"
                            aria-labelledby={`task-title-${task.id}`}
                        />
                        <div className="flex-1">
                            <p id={`task-title-${task.id}`} className={`font-bold text-sm ${task.isCompleted ? 'line-through text-base01' : 'text-base02'}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <p className={`text-xs mt-0.5 ${task.isCompleted ? 'line-through text-base01' : 'text-base01'}`}>
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const SubjectLayout: React.FC<LayoutProps> = ({ currentView, notes, cases, events, onSummarizeNote, onExplainCase, onStudyPlan, caseSearchQuery, setCaseSearchQuery, noteSearchQuery, setNoteSearchQuery }) => {
  const viewConfig = APP_VIEWS.find(v => v.name === currentView) || APP_VIEWS[0];
  const Icon = viewConfig.icon;
  const upcomingEvents = events.filter(e => isToday(e.date) || isFuture(e.date)).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 10);

  const caseSearchBar = (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base01 pointer-events-none" />
      <input
        type="text"
        placeholder="Search cases..."
        value={caseSearchQuery}
        onChange={(e) => setCaseSearchQuery(e.target.value)}
        className="bg-base3 border-2 border-base1 rounded-sm pl-8 pr-2 py-1 text-sm w-full max-w-48 focus:outline-none focus:border-blue transition-colors"
        aria-label="Search cases by name or citation"
      />
    </div>
  );
  
  const noteSearchBar = (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base01 pointer-events-none" />
      <input
        type="text"
        placeholder="Search notes..."
        value={noteSearchQuery}
        onChange={(e) => setNoteSearchQuery(e.target.value)}
        className="bg-base3 border-2 border-base1 rounded-sm pl-8 pr-2 py-1 text-sm w-full max-w-48 focus:outline-none focus:border-blue transition-colors"
        aria-label="Search notes by title"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-yellow mt-1" />
        <div>
          <h2 className="text-4xl font-bold text-base02">{currentView}</h2>
          <p className="text-base01 mt-1">Notes, cases, and events for this subject.</p>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Notes" icon={FileText} emptyText={noteSearchQuery ? "No matching notes found." : `No notes found for ${currentView}.`} headerContent={noteSearchBar}>
          {notes.map(note => (
            <div key={note.id} className="p-3 rounded-sm bg-base3 border-2 border-base1">
              <p className="font-bold text-base02 truncate">{note.title}</p>
              <div className="flex justify-between items-end mt-3 pt-3 border-t border-base1">
                 <NoteAttachments attachments={note.attachments} />
                <AiButton text="Summarize" onClick={() => onSummarizeNote(note)} />
              </div>
            </div>
          ))}
        </Section>
        <Section title="Cases" icon={Briefcase} emptyText={caseSearchQuery ? "No matching cases found." : `No cases found for ${currentView}.`} headerContent={caseSearchBar}>
          {cases.map(c => (
             <motion.div 
                key={c.id}
                onClick={() => onExplainCase(c.caseName, c.citation)}
                whileHover={{ y: -3, boxShadow: "3px 3px 0px #93a1a1" }}
                className="p-3 rounded-sm bg-base3 border-2 border-base1 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-base02 truncate">{c.caseName}</p>
                    <p className="text-sm text-green font-semibold">{c.citation}</p>
                  </div>
                  <WandSparkles className="w-4 h-4 text-yellow shrink-0 mt-1" />
                </div>
              </motion.div>
          ))}
        </Section>
        <div className="lg:col-span-2">
          <Section title="Upcoming Subject Events" icon={CalendarDays} emptyText={`No upcoming events for ${currentView}.`}>
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-3 rounded-sm bg-base3 border-2 border-base1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base02">{event.title}</p>
                    <p className="text-sm text-base01">{event.type}</p>
                  </div>
                  <p className="text-sm font-bold text-orange shrink-0 ml-2">{format(event.date, 'MMM do')}</p>
                </div>
                {(event.type === 'Exam' || event.type === 'Assignment') && (
                  <div className="mt-3 pt-3 border-t border-base1"><AiButton text="Generate Study Plan" onClick={() => onStudyPlan(event.title)} /></div>
                )}
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

// --- Main View Component ---
const DashboardView: React.FC<DashboardViewProps> = (props) => {
    const { currentView, notes, cases, events } = props;
    const [noteSearchQuery, setNoteSearchQuery] = useState('');
    const [caseSearchQuery, setCaseSearchQuery] = useState('');

    const filteredNotes = notes.filter(note => {
        const matchesView = currentView === "Dashboard" || note.subject === currentView;
        const matchesSearch = note.title.toLowerCase().includes(noteSearchQuery.toLowerCase());
        return matchesView && matchesSearch;
    });

    const filteredCases = cases.filter(c => {
        const matchesView = currentView === "Dashboard" || c.subject === currentView;
        const matchesSearch = c.caseName.toLowerCase().includes(caseSearchQuery.toLowerCase()) || c.citation.toLowerCase().includes(caseSearchQuery.toLowerCase());
        return matchesView && matchesSearch;
    });
    
    const filteredEvents = events.filter(event => {
        return currentView === "Dashboard" || event.subject === currentView;
    });

    const layoutProps = {
        ...props,
        notes: filteredNotes,
        cases: filteredCases,
        events: filteredEvents,
        noteSearchQuery,
        setNoteSearchQuery,
        caseSearchQuery,
        setCaseSearchQuery,
    };

    return (
      <AnimatePresence mode="wait">
          <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
          >
              {currentView === "Dashboard" ? (
                  <DashboardLayout {...layoutProps} />
              ) : (
                  <SubjectLayout {...layoutProps} />
              )}
          </motion.div>
      </AnimatePresence>
    );
};

export default DashboardView;
