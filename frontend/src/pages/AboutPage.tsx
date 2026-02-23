import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const founders = [
  {
    key: 'amina-farouk',
    name: 'Dr. Amina Farouk',
    role: 'Co-Founder & Chief Medical Officer',
    bio: 'Practicing physician focused on concierge care workflows, patient safety standards, and modern clinical experience design.',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/'
  },
  {
    key: 'noah-adeyemi',
    name: 'Noah Adeyemi',
    role: 'Co-Founder & Chief Product Officer',
    bio: 'Product leader building healthcare systems that combine operational intelligence, usability, and measurable outcomes.',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/'
  },
  {
    key: 'olivia-chen',
    name: 'Olivia Chen',
    role: 'Co-Founder & Chief Technology Officer',
    bio: 'Infrastructure engineer focused on secure multi-tenant architecture, reliability, and production-grade platform delivery.',
    linkedin: 'https://www.linkedin.com/',
    twitter: 'https://x.com/'
  }
];

const timeline = [
  { year: '2024', title: 'Cigali Founded', detail: 'Started with a mission to modernize clinic operations end-to-end.' },
  { year: '2025', title: 'Clinical Platform Launch', detail: 'Released patient, appointment, and inventory workflows for growing providers.' },
  { year: '2026', title: 'Healthcare Operating System', detail: 'Unified clinical intelligence, business analytics, and concierge workflows.' }
];

const teamImages = import.meta.glob('@/assets/team/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const resolveFounderImage = (key: string): string | undefined => {
  const entry = Object.entries(teamImages).find(([path]) => path.includes(`${key}.svg`));
  return entry?.[1];
};

export const AboutPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 pb-20 md:px-6">
      <section className="glass-luxury px-6 py-10">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-700">About Cigali Care</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black md:text-5xl">Built for the future of healthcare</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
          Cigali Care exists to help healthcare providers deliver better care while running smarter clinics.
          We combine clinical workflows, operations, and business intelligence in one premium platform.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-semibold text-black">Our Mission</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            Healthcare teams are burdened by fragmented tools, manual processes, and delayed decisions.
            Cigali modernizes care operations with a single operating system that supports doctors,
            clinics, pharmacies, and administrators in real time.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold text-black">Why We Built Cigali</h2>
          <p className="mt-3 text-sm leading-7 text-black/70">
            Providers need systems that are clinically useful and operationally effective.
            Cigali helps practices improve patient continuity, reduce missed follow-ups,
            and scale financial performance without sacrificing care quality.
          </p>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-black">Founding Team</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {founders.map((founder) => (
            <Card key={founder.key} className="flex h-full flex-col">
              <img
                src={resolveFounderImage(founder.key)}
                alt={founder.name}
                className="h-56 w-full rounded-[20px] border border-white/40 object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold text-black">{founder.name}</h3>
              <p className="text-sm font-medium text-primary-700">{founder.role}</p>
              <p className="mt-3 text-sm leading-6 text-black/70">{founder.bio}</p>
              <div className="mt-4 flex gap-2 text-sm">
                <a className="glass-button" href={founder.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="glass-button" href={founder.twitter} target="_blank" rel="noreferrer">Twitter</a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold tracking-tight text-black">Company Story</h2>
        <div className="mt-5 space-y-4">
          {timeline.map((entry) => (
            <Card key={entry.year} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">{entry.year}</p>
                <p className="text-lg font-semibold text-black">{entry.title}</p>
              </div>
              <p className="max-w-2xl text-sm text-black/70">{entry.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="glass-luxury px-6 py-8">
        <h2 className="text-2xl font-semibold text-black">Start using Cigali</h2>
        <p className="mt-2 text-sm text-black/70">Run your clinic on premium infrastructure built for modern healthcare teams.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/register"><Button>Start Free</Button></Link>
          <Link to="/"><Button variant="secondary">Back Home</Button></Link>
        </div>
      </section>
    </div>
  );
};
