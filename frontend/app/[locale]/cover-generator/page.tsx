import CoverGeneratorForm from "./CoverGeneratorForm";
import CoverPreview from "./CoverPreview";

export default function Page() {
  return (
    <div className="grid lg:grid-cols-[480px_1fr]">
      <CoverGeneratorForm />
      <CoverPreview />
    </div>
  );
}
