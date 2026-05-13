import { CinematicWordmark } from '~ui/atoms/cinematic-wordmark';

export default function CinematicWordmarkDemo() {
  return (
    <main className="min-h-screen bg-black">
      <div className="relative w-full h-screen">
        <CinematicWordmark
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </main>
  );
}
