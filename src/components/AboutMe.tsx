export default function AboutMe() {
  return (
    <section id="about" className="relative bg-black py-24 sm:py-32 px-5 sm:px-10 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair italic text-4xl sm:text-5xl text-white mb-16 text-center">
          About Me
        </h2>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
          {/* Avatar placeholder */}
          <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white/30"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>

          {/* Bio text */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              I'm a geologist with over 7 years of field and research experience
              spanning sedimentary basins, structural mapping, and geospatial
              analysis. My work bridges traditional fieldwork with modern
              computational tools.
            </p>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed">
              When I'm not in the field or at the microscope, I build interactive
              web tools that make geological data more accessible — from 3D
              terrain viewers to fossil record databases. I believe that
              understanding Earth's history helps us make better decisions for
              its future.
            </p>

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-left">
              {[
                { label: 'Location', value: 'Denver, CO' },
                { label: 'Focus', value: 'Sedimentology' },
                { label: 'Years in Field', value: '7+' },
                { label: 'Publications', value: '12' },
              ].map((info) => (
                <div key={info.label}>
                  <span className="text-[#e8702a] text-xs font-medium tracking-wider uppercase">
                    {info.label}
                  </span>
                  <p className="text-white/80 text-sm mt-0.5">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}