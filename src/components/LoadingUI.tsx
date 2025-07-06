export default function LoadingUI() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" />
        <span className="text-2xl font-bold">Loading</span>
      </div>
    </div>
  );
}
