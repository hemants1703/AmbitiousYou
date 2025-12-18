interface AmbitionStatusBadgeProps {
  ambitionStatus: string;
}

export function AmbitionStatusBadge(props: AmbitionStatusBadgeProps) {
  return (
    <div className="flex justify-between items-center rounded-full overflow-hidden text-xs text-black font-mono uppercase font-bold">
      <span className="bg-gray-200 px-2">STATUS</span>
      <span
        className={`px-2 ${
          props.ambitionStatus === "active"
            ? "bg-green-400"
            : props.ambitionStatus === "completed"
              ? "bg-blue-500 text-white"
              : props.ambitionStatus === "missed"
                ? "bg-amber-500"
                : "bg-gray-200"
        }`}
      >
        {props.ambitionStatus.toUpperCase()}
      </span>
    </div>
  );
}
