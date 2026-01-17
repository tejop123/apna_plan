const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Blog', href: '#blog' }
    ]
  },
  {
    title: 'Help',
    links: [
      { label: 'Support', href: 'mailto:support@apnaplan.com' },
      { label: 'FAQs', href: '#faqs' },
      { label: 'Cancellation', href: '#cancellation' },
      { label: 'Contact Us', href: 'tel:+919999999999' }
    ]
  },
  {
    title: 'Discover',
    links: [
      { label: 'Flight Status', href: '#flight-status' },
      { label: 'Trains Guide', href: '#trains-guide' },
      { label: 'Bus Operators', href: '#bus-operators' },
      { label: 'Hotel Deals', href: '#hotel-deals' }
    ]
  }
];

const routeHighlights = [
  {
    title: 'Popular Flight Routes',
    entries: ['Delhi ↔ Mumbai', 'Bengaluru ↔ Goa', 'Chennai ↔ Hyderabad']
  },
  {
    title: 'Top Train Journeys',
    entries: ['Rajdhani Express', 'Vande Bharat Express', 'Shatabdi Express']
  },
  {
    title: 'Bus Destinations',
    entries: ['Delhi → Manali', 'Mumbai → Pune', 'Jaipur → Udaipur']
  },
  {
    title: 'Hotel Hotspots',
    entries: ['Goa Beach Resorts', 'Shimla Hill Stays', 'Kerala Backwaters']
  }
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-900">
      <div className="px-4 py-10 md:px-8">
        <div className="w-full rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.05)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5 lg:w-1/2">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-indigo-500">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-semibold text-white shadow-lg">ap</span>
                Smart travel planner
              </div>
              <h2 className="text-[28px] font-semibold leading-tight text-slate-900 md:text-[32px]">apna plan is your smart travel planner for flights, trains, buses and hotels.</h2>
              <p className="text-sm text-slate-600 md:text-base">Compare fares, manage trips and enjoy seamless travel experiences across every mode you rely on.</p>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <a href="mailto:support@apnaplan.com" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:bg-slate-100">
                  support@apnaplan.com
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2">+91-9999999999</span>
              </div>
            </div>

            <div className="grid flex-1 gap-6 text-sm text-slate-600 md:grid-cols-3">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{section.title}</p>
                  <ul className="mt-4 space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} className="transition hover:text-indigo-600">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {routeHighlights.map((section) => (
              <article key={section.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">{section.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {section.entries.map((entry) => (
                    <li key={entry} className="flex items-center gap-2 text-slate-600">
                      <span className="h-0.5 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-sky-300" />
                      {entry}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-center text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="text-slate-600">&copy; {currentYear} apna plan. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-slate-600">
            <a href="#privacy" className="hover:text-indigo-600">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-indigo-600">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-indigo-600">
              Cookie Policy
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-slate-500">
            <span>CIN: U12345DL2025PTC000111</span>
            <span>GSTIN: 07ABCDE1234F1Z5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
