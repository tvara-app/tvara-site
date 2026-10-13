import Reveal from "../components/Reveal.jsx";
import Prose from "../components/Prose.jsx";
import html from "../content/about.html?raw";

export default function About() {
  return (
    <section data-section="About">
      <Reveal><Prose html={html} /></Reveal>
    </section>
  );
}
