import { TrackedItemDraftEditor } from "@/components/(app)/ambitions/(ambitionId)/ambition-details/tracked-item-draft-editor";
import { emptyDraft, MOVE_TITLE_MAX_LENGTH, type DraftState } from "@/lib/(app)/tracked-item";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

function DraftEditorHarness(props: {
  initialDraft?: DraftState;
  lockKind?: boolean;
  isPending?: boolean;
  onSubmit?: () => void;
}) {
  const [draft, setDraft] = useState(props.initialDraft ?? emptyDraft);

  return (
    <TrackedItemDraftEditor
      label="Add move"
      draft={draft}
      dateDisabled={[]}
      isPending={props.isPending ?? false}
      lockKind={props.lockKind}
      onChange={setDraft}
      onSubmit={props.onSubmit ?? vi.fn()}
      onCancel={vi.fn()}
    />
  );
}

describe("TrackedItemDraftEditor", () => {
  it("keeps Save disabled until title and date are set", async () => {
    const user = userEvent.setup();

    render(<DraftEditorHarness />);

    const saveButton = screen.getByRole("button", { name: "Save move" });
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Task title"), "Write tests");
    expect(saveButton).toBeDisabled();
  });

  it("enables Save when title and date are present", () => {
    render(
      <DraftEditorHarness
        initialDraft={{
          kind: "task",
          title: "Write tests",
          description: "",
          date: "2026-07-01",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: "Save move" })).toBeEnabled();
  });

  it("clears description when the description checkbox is unchecked", async () => {
    const user = userEvent.setup();

    render(
      <DraftEditorHarness
        initialDraft={{
          kind: "milestone",
          title: "Launch",
          description: "Public release",
          date: "2026-08-01",
        }}
      />,
    );

    const descriptionField = screen.getByPlaceholderText("Optional description…");
    expect(descriptionField).toHaveValue("Public release");

    await user.click(screen.getByRole("checkbox", { name: /Add a milestone description/i }));

    expect(screen.queryByPlaceholderText("Optional description…")).not.toBeInTheDocument();
  });

  it("shows a character counter near the title limit", () => {
    const longTitle = "x".repeat(MOVE_TITLE_MAX_LENGTH - 5);

    render(
      <DraftEditorHarness
        initialDraft={{
          kind: "task",
          title: longTitle,
          description: "",
          date: "2026-07-01",
        }}
      />,
    );

    expect(screen.getByText(`${longTitle.length}/${MOVE_TITLE_MAX_LENGTH}`)).toHaveAttribute("aria-live", "polite");
  });

  it("disables Save while a mutation is pending", () => {
    render(
      <DraftEditorHarness
        isPending
        initialDraft={{
          kind: "task",
          title: "Write tests",
          description: "",
          date: "2026-07-01",
        }}
      />,
    );

    expect(screen.getByRole("button", { name: "Save move" })).toBeDisabled();
  });
});
