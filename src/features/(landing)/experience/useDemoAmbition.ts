"use client";

import { useState, useCallback } from "react";
import { PersonaAmbition } from "./personaData";

export interface DemoAmbitionState {
  personaId: string | null;
  ambition: PersonaAmbition | null;
  completedItems: string[]; // IDs of completed tasks/milestones toggled in demo
}

const initialState: DemoAmbitionState = {
  personaId: null,
  ambition: null,
  completedItems: [],
};

export function useDemoAmbition() {
  const [state, setState] = useState<DemoAmbitionState>(initialState);
  // Always loaded since we're not using localStorage anymore
  const isLoaded = true;

  const selectPersona = useCallback((personaId: string, ambition: PersonaAmbition) => {
    setState((prev) => ({
      ...prev,
      personaId,
      ambition,
      completedItems: [], // Reset completed items when changing persona
    }));
  }, []);

  const toggleItemComplete = useCallback((itemId: string) => {
    setState((prev) => {
      const isCompleted = prev.completedItems.includes(itemId);
      return {
        ...prev,
        completedItems: isCompleted
          ? prev.completedItems.filter((id) => id !== itemId)
          : [...prev.completedItems, itemId],
      };
    });
  }, []);

  // Calculate progress based on demo interactions
  const calculateProgress = useCallback(() => {
    const currentAmbition = state.ambition;
    if (!currentAmbition) return 0;

    const items =
      currentAmbition.ambition.ambitionTrackingMethod === "task"
        ? currentAmbition.tasks || []
        : currentAmbition.milestones || [];

    if (items.length === 0) return 0;

    // Count originally completed + demo-completed items
    const originallyCompleted = items.filter((item) => {
      if ("taskCompleted" in item) return item.taskCompleted;
      if ("milestoneCompleted" in item) return item.milestoneCompleted;
      return false;
    }).length;

    // Add demo-toggled completions (but avoid double counting)
    const demoCompleted = state.completedItems.filter((id) => {
      const item = items.find((i) => i.id === id);
      if (!item) return false;
      // Only count if it wasn't originally completed
      if ("taskCompleted" in item) return !item.taskCompleted;
      if ("milestoneCompleted" in item) return !item.milestoneCompleted;
      return false;
    }).length;

    // Subtract demo-uncompleted items (items that were completed but user toggled off)
    const demoUncompleted = state.completedItems.filter((id) => {
      const item = items.find((i) => i.id === id);
      if (!item) return false;
      // Only count if it was originally completed
      if ("taskCompleted" in item) return item.taskCompleted;
      if ("milestoneCompleted" in item) return item.milestoneCompleted;
      return false;
    }).length;

    const totalCompleted = originallyCompleted + demoCompleted - demoUncompleted;
    return Math.round((totalCompleted / items.length) * 100);
  }, [state]);

  return {
    state,
    isLoaded,
    selectPersona,
    toggleItemComplete,
    calculateProgress,
  };
}
