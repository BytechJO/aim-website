import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen">
      <Image
        src="/hero.jpg"
        alt="Printing Company"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-2xl text-white">We print books perfectly</h2>

          <h1 className="mb-6 text-7xl font-light text-white">perfectly</h1>

          <p className="mb-8 max-w-md text-white">
            respecting the nature and caring about your needs
          </p>

          <button className="rounded-full bg-black px-8 py-3 text-white">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
