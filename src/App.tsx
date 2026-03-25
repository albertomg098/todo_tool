import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { HelpView } from "@/components/HelpView";

export type ViewMode = "day" | "week" | "help";

function App() {
  const [view, setView] = useState<ViewMode>("day");
  const [previousView, setPreviousView] = useState<ViewMode>("day");
  const [selectedDay, setSelectedDay] = useState<string | undefined>();

  function handleNavigateToDay(daySlot: string) {
    setSelectedDay(daySlot);
    setView("day");
  }

  function handleOpenHelp() {
    setPreviousView(view);
    setView("help");
  }

  function handleCloseHelp() {
    setView(previousView);
  }

  return (
    <TooltipProvider>
      {view === "day" && (
        <DayView
          initialDay={selectedDay}
          onSwitchToWeek={() => setView("week")}
          onOpenHelp={handleOpenHelp}
        />
      )}
      {view === "week" && (
        <WeekView
          onSwitchToDay={() => setView("day")}
          onNavigateToDay={handleNavigateToDay}
          onOpenHelp={handleOpenHelp}
        />
      )}
      {view === "help" && (
        <HelpView onBack={handleCloseHelp} />
      )}
    </TooltipProvider>
  );
}

export default App;
