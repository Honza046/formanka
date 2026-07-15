export default function ContactForm() {
  return (
    <form className="space-y-4" action="#" method="POST">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="mb-1.5 block text-sm font-medium text-slate-deep">
            Jméno
          </label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        </div>
        <div>
          <label htmlFor="last-name" className="mb-1.5 block text-sm font-medium text-slate-deep">
            Příjmení
          </label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-deep">
          E-mail <span className="text-terracotta">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-deep">
          Zpráva <span className="text-terracotta">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full resize-y rounded-xl border border-slate-deep/10 bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light sm:w-auto"
      >
        Poslat
      </button>
    </form>
  );
}
