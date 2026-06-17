const PROJECTS = [
  {
    title: 'Sediment Basin Mapper',
    tags: ['React', 'Mapbox', 'Python'],
    description:
      'Interactive web tool for visualizing sedimentary basin structures and stratigraphic columns across North America.',
  },
  {
    title: 'Fossil Record DB',
    tags: ['PostgreSQL', 'GraphQL', 'D3.js'],
    description:
      'Queryable database of fossil records with timeline visualizations, used by researchers across 12 universities.',
  },
  {
    title: 'Core Sample Analyzer',
    tags: ['TensorFlow', 'OpenCV', 'FastAPI'],
    description:
      'ML-powered image analysis for automated core sample classification and fracture detection.',
  },
  {
    title: 'Terrain Explorer',
    tags: ['Three.js', 'Node.js', 'WebGL'],
    description:
      '3D geological terrain viewer rendering LiDAR and DEM data directly in the browser at interactive framerates.',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="relative bg-black py-24 sm:py-32 px-5 sm:px-10 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-playfair italic text-4xl sm:text-5xl text-white mb-16 text-center">
          Projects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PROJECTS.map((project, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-7 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-[#e8702a] bg-[#e8702a]/10 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-white text-lg font-semibold mb-2">
                {project.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {project.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#e8702a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}