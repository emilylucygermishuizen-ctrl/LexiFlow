
import { 
  LayoutDashboard, HeartPulse, ArrowRightLeft, Building, Gavel, Users, Landmark
} from 'lucide-react';
import type { AppView } from './types';

export const APP_VIEWS: AppView[] = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Medicina Forensis", icon: HeartPulse },
  { name: "Commercial Transactions", icon: ArrowRightLeft },
  { name: "Corporation Law", icon: Building },
  { name: "Civil Procedure", icon: Gavel },
  { name: "Labour Law", icon: Users },
  { name: "Administrative Law", icon: Landmark },
];
