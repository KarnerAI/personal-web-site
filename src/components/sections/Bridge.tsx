// Einstein bridge (theme B, DESIGN.md; v7 mockup): the thesis for the
// career story. Not in the nav. The quote is set small on purpose (a
// lead-in, not a second headline), and a short blue rule runs down into
// Career, which starts tight under it.

export function Bridge() {
  return (
    <section aria-label="On experience" className="theme-b bridge-wash">
      <div className="wrap pt-10 max-md:pt-6">
        <figure className="m-0 max-w-[940px]">
          <blockquote className="m-0">
            <p className="type-quote m-0 max-w-[26em] text-ink [text-wrap:balance]">
              <span className="md:-ml-[0.4em]">&ldquo;</span>The only source of knowledge is{" "}
              <em className="not-italic text-primary">experience.</em>&rdquo;
            </p>
          </blockquote>
          <figcaption className="type-label mt-4 flex items-center gap-3 tracking-[0.12em] text-ink-muted before:h-px before:w-7 before:flex-none before:bg-[linear-gradient(90deg,var(--primary),var(--sky))] before:content-['']">
            Albert Einstein
          </figcaption>
        </figure>
        <p className="type-body-lg m-0 mt-6 max-w-[38em] leading-[1.6] text-ink-secondary max-md:mt-5 max-md:text-[17px]">
          Post college, I went straight to a brewhouse floor at Anheuser-Busch. There, I
          learned that real knowledge doesn&rsquo;t come from dashboards, it comes from being
          close to the people doing the work. Since then, I&rsquo;ve carried that lesson throughout my career, from production
          lines to high-growth tech and physical spaces.
        </p>
        <span aria-hidden className="bridge-lead" />
      </div>
    </section>
  );
}
