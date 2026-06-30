import { VIDEOS, VIDEO_HEADING, VIDEO_TAGLINE } from '@/config/brand'

export default function VideoReviews() {
  return (
    <section className="container-x py-14 text-center">
      <h2 className="display text-3xl sm:text-4xl">{VIDEO_HEADING}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-ink-soft">{VIDEO_TAGLINE}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {VIDEOS.map((v) => (
          <video
            key={v.src}
            src={v.src}
            poster={v.poster}
            controls
            playsInline
            muted
            loop
            preload="none"
            className="aspect-[9/16] w-56 rounded-2xl border border-line bg-black object-cover shadow-sm sm:w-64"
          />
        ))}
      </div>
    </section>
  )
}
