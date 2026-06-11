export default function loading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-black rounded-full animate-bounce" />
        <div
          className="w-3 h-3 bg-black rounded-full animate-bounce"
          style={{ animationDelay: "0.15s" }}
        />
        <div
          className="w-3 h-3 bg-black rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}
