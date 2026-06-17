const SKILL_CATEGORIES = [
  {
    category: 'Field Geology',
    skills: [
      { name: 'Structural Mapping', level: 5 },
      { name: 'Stratigraphic Analysis', level: 5 },
      { name: 'Core Logging', level: 4 },
      { name: 'Geophysical Survey', level: 3 },
    ],
  },
  {
    category: 'Lab & Analysis',
    skills: [
      { name: 'Petrography', level: 5 },
      { name: 'XRD / XRF', level: 4 },
      { name: 'SEM Imaging', level: 3 },
      { name: 'Geochronology', level: 3 },
    ],
  },
  {
    category: 'Software & Tools',
    skills: [
      { name: 'ArcGIS / QGIS', level: 5 },
      { name: 'Python (NumPy, Pandas)', level: 4 },
      { name: 'React / TypeScript', level: 4 },
      { name: 'MATLAB', level: 3 },
    ],
  },
  {
    category: 'Languages',
    skills: [
      { name: 'English', level: 5 },
      { name: 'Mandarin', level: 5 },
      { name: 'Spanish', level: 2 },
      { name: 'Arabic', level: 1 },
    ],
  },
]

function DotBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full transition-colors ${
            dot <= level ? 'bg-[#e8702a]' : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative bg-black py-24 sm:py-32 px-5 sm:px-10 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-playfair italic text-4xl sm:text-5xl text-white mb-16 text-center">
          Skills
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-7"
            >
              <h3 className="text-white text-lg font-semibold mb-5">
                {cat.category}
              </h3>
              <div className="flex flex-col gap-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-white/70 text-sm">{skill.name}</span>
                    <DotBar level={skill.level} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}