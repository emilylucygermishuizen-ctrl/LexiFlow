import React, { useState } from 'react';
import AppNavBar from './components/AppNavBar';
import DashboardView from './components/DashboardView';
import AiModal from './components/AiModal';
import { sampleNotes, sampleCases, sampleEvents, sampleTasks } from './data';
import { getDailyFocus, explainCase, generateStudyPlan, summarizeNote } from './services/geminiService';
import type { Note, Case, Event, ModalState, AppViewName, Task } from './types';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [cases, setCases] = useState<Case[]>(sampleCases);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  
  const [currentView, setCurrentView] = useState<AppViewName>("Dashboard");

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: '',
    sources: [],
    isLoading: false,
  });

  const handleApiError = (error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error);
    setModalState(prev => ({
        ...prev,
        isLoading: false,
        content: `Error: Unable to fetch AI response.\n${(error as Error).message}`
    }));
  };

  const handleDailyFocus = async () => {
    setModalState({
      isOpen: true,
      title: '✨ Daily Focus',
      content: '',
      sources: [],
      isLoading: true,
    });
    
    try {
        const { text, sources } = await getDailyFocus(events, notes);
        setModalState(prev => ({ ...prev, isLoading: false, content: text, sources }));
    } catch (error) {
        handleApiError(error, "Error getting daily focus:");
    }
  };

  const handleExplainCase = async (caseName: string, citation: string) => {
    setModalState({
      isOpen: true,
      title: `✨ Case Brief: ${caseName}`,
      content: '',
      sources: [],
      isLoading: true,
    });
    
    try {
        const { text, sources } = await explainCase(caseName, citation);
        setModalState(prev => ({ ...prev, isLoading: false, content: text, sources }));
    } catch (error) {
        handleApiError(error, "Error explaining case:");
    }
  };
  
  const handleStudyPlan = async (eventTitle: string) => {
    setModalState({
      isOpen: true,
      title: `✨ Study Plan: ${eventTitle}`,
      content: '',
      sources: [],
      isLoading: true,
    });
    
    try {
        const { text, sources } = await generateStudyPlan(eventTitle);
        setModalState(prev => ({ ...prev, isLoading: false, content: text, sources }));
    } catch (error) {
        handleApiError(error, "Error generating study plan:");
    }
  };

  const handleSummarizeNote = async (note: Note) => {
    setModalState({
      isOpen: true,
      title: `✨ Summary: ${note.title}`,
      content: '',
      sources: [],
      isLoading: true,
    });
    
    try {
        const { text, sources } = await summarizeNote(note);
        setModalState(prev => ({ ...prev, isLoading: false, content: text, sources }));
    } catch (error) {
        handleApiError(error, "Error summarizing note:");
    }
  };

  const handleAddTask = (title: string, description: string) => {
    if (!title.trim()) return; // Don't add empty tasks
    const newTask: Task = {
      id: Date.now(), // simple unique id
      title,
      description,
      isCompleted: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', content: '', sources: [], isLoading: false });
  };

  return (
    <div className="bg-base3 text-base01 p-4 md:p-8 lg:p-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <AppNavBar currentView={currentView} onSetView={setCurrentView} />
        <DashboardView 
          notes={notes}
          cases={cases}
          events={events}
          tasks={tasks}
          currentView={currentView}
          onDailyFocus={handleDailyFocus}
          onExplainCase={handleExplainCase}
          onStudyPlan={handleStudyPlan}
          onSummarizeNote={handleSummarizeNote}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
        />
      </div>
      <AiModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        content={modalState.content}
        sources={modalState.sources}
        isLoading={modalState.isLoading}
      />
    </div>
  );
}