// Closing contact band (theme B, v9 mockup): dark ink, a short ask, one
// white button, and the email plus LinkedIn and GitHub as plain links.
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/contact";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="close-h" className="theme-b close">
      <div className="wrap">
        <p className="chip">Contact</p>
        <h2 id="close-h" className="close-h">
          Building something?
        </h2>
        <p className="close-p">I&rsquo;d love to hear about it.</p>
        <div className="close-cta">
          <a className="btn-primary" href={`mailto:${EMAIL}`}>
            Get in touch
          </a>
          <a className="close-mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
        <div className="close-links">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
