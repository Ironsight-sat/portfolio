import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 4000;

app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");

/* HOME */
app.get("/", (req, res) => {
  res.render("index", {
    name: "Satyam Teotia",
    title: "Full Stack & Systems Focused Engineer",
    intro:
      "I build clean, scalable web applications with a strong focus on correctness, usability, and system-level thinking.",
    skills: [
      "Cyber Security",
      "System Engineering",
      "IT Specialist",
      "Full Stack Developer"
    ]
  });
});

/* PROJECTS */
app.get("/projects", (req, res) => {
  res.render("projects", {
    projects: [
      {
        title: "University Planning Dashboard",
        description:
          "A responsive study-abroad planning tool that aggregates public universities, QS rankings, and live CS / AI / Informatics course links.",
        tech: ["Node.js", "Express", "EJS", "CSS Grid"],
        live: "http://localhost:3000", // <-- your Uni Planner app
        github: "https://github.com/Ironsight-sat?tab=repositories"
      },
      {
        title: "Online SQL Editor",
        description:
          "A web-based SQL editor that allows users to write, execute, and test SQL queries in real time through a clean and interactive interface.",
        tech: ["Next.js", "SQL"],
        live: "#",
        github: "https://github.com/Ironsight-sat/Sql-Editor"
      }
    ]
  });
});

app.get("/uni", (req, res) => {

    res.render("uni.ejs", {
    name: "UNI",
    work: "PLANNING",
    time: new Date().getSeconds(),

    universities: [
      {
        name: "University of Passau",
        country: "Germany",
        qsRank: "801–1000",
        course: "M.Sc. Computer Science / AI",
        image: "/images/Passau.jpg",
        courseLink: "https://www.uni-passau.de/en/msc-computer-science/"
      },
      {
        name: "Saarland University",
        country: "Germany",
        qsRank: "601–650",
        course: "M.Sc. Informatics / Data Science",
        image: "/images/Saarland.jpeg",
        courseLink: "https://www.uni-saarland.de/en/study/programmes/master/informatics.html"
      },
      {
        name: "Otto von Guericke University Magdeburg",
        country: "Germany",
        qsRank: "801–1000",
        course: "M.Sc. Computer Science",
        image: "/images/Otto.jpg",
        courseLink: "https://www.ovgu.de/en/Study/Degree+Programmes/Master/Computer+Science.html"
      },
      {
        name: "University of Bonn",
        country: "Germany",
        qsRank: "≈207",
        course: "M.Sc. Computer Science",
        image: "/images/Bonn.jpg",
        courseLink: "https://www.uni-bonn.de/en/studying/degree-programs/degree-programs-a-z/computer-science-msc"
      },
      {
        name: "TU Dortmund University",
        country: "Germany",
        qsRank: "801–1000",
        course: "M.Sc. Computer Science",
        image: "/images/Tu_Dortmund.jpg",
        courseLink: "https://cs.tu-dortmund.de/en/studies/"
      },
      {
        name: "University of Duisburg-Essen",
        country: "Germany",
        qsRank: "801–1000",
        course: "M.Sc. Computer Engineering / Informatics",
        image: "/images/Duisburg.jpg",
        courseLink: "https://www.uni-due.de/en/studying/"
      },
      {
        name: "University of Potsdam",
        country: "Germany",
        qsRank: "801–1000",
        course: "M.Sc. Computer Science",
        image: "/images/Potsdam.png",
        courseLink: "https://www.uni-potsdam.de/en/studies/degree-programs"
      },
      {
        name: "FAU Erlangen–Nürnberg",
        country: "Germany",
        qsRank: "224",
        course: "M.Sc. Computer Science",
        image: "/images/FAU.jpg",
        courseLink: "https://www.informatik.studium.fau.de/master/"
      },
      {
        name: "Université Grenoble Alpes",
        country: "France",
        qsRank: "294",
        course: "Master Informatique / AI / Data Science",
        image: "/images/Grenoble.jpg",
        courseLink: "https://www.univ-grenoble-alpes.fr/english/education/"
      },
      {
        name: "Université Paris-Est Créteil (UPEC)",
        country: "France",
        qsRank: "1001–1200",
        course: "Master Informatique",
        image: "/images/Paris_Est.jpg",
        courseLink: "https://sciences-tech.u-pec.fr/formations"
      },
      {
        name: "Sorbonne University",
        country: "France",
        qsRank: "59",
        course: "Master Informatique / AI",
        image: "/images/Sorbone.jpg",
        courseLink: "https://sciences.sorbonne-universite.fr/formation-sciences/masters/master-informatique"
      },
      {
        name: "University of Göttingen",
        country: "Germany",
        qsRank: "232",
        course: "M.Sc. Applied Computer Science",
        image: "/images/Gottingen.jpg",
        courseLink: "https://www.uni-goettingen.de/en/msc-applied-computer-science/625616.html"
      },
      {
        name: "Karlsruhe Institute of Technology",
        country: "Germany",
        qsRank: "119",
        course: "M.Sc. Computer Science",
        image: "/images/KIT.png",
        courseLink: "https://www.sle.kit.edu/english/vorstudium/master-computer-science.php"
      }
    ]
  });


});

app.get("/resume", (req, res) => {
  res.render("resume");
});

app.get("/about", (req, res) => {
  res.render("aboutme");
});

app.get("/linux-game", (req, res) => {
  res.render("linux-game");
});





app.listen(port, () => {
  console.log(`Portfolio running at http://localhost:${port}`);
});
