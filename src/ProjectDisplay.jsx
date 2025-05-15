import Works from "./Works";
import worksData from "../data/data.json";
import './App.css'

function ProjectDisplay() {
  return (
    <section className="projects">
      <h2 className="projects-title">Projelerim</h2>
      <Works data={worksData.worksData} />
    </section>
  );
}

export default ProjectDisplay;