const cursosPorCiclo = {
  1: [
    { id: "mat_basica", nombre: "Matemática Básica", grupo: "matematicas" },
    { id: "quimica", nombre: "Química General", grupo: "otros" },
    { id: "intro_ing", nombre: "Introducción a la Ingeniería", grupo: "otros" }
  ],
  2: [
    { id: "fisica1", nombre: "Física I", grupo: "fisica", prereq: ["mat_basica"] },
    { id: "algebra", nombre: "Álgebra", grupo: "matematicas", prereq: ["mat_basica"] },
    { id: "prog_basica", nombre: "Programación Básica", grupo: "programacion" }
  ],
  3: [
    { id: "estadistica", nombre: "Estadística", grupo: "matematicas", prereq: ["algebra"] },
    { id: "fisica2", nombre: "Física II", grupo: "fisica", prereq: ["fisica1"] },
    { id: "estructuras", nombre: "Estructuras Discretas", grupo: "programacion", prereq: ["prog_basica"] }
  ]
};

function obtenerCursosCompletados() {
  return JSON.parse(localStorage.getItem("cursosCompletados")) || [];
}

function guardarCursosCompletados(lista) {
  localStorage.setItem("cursosCompletados", JSON.stringify(lista));
}

function mostrarCursos(ciclo) {
  const contenedor = document.getElementById("resultado");
  const completados = obtenerCursosCompletados();

  contenedor.innerHTML = `<h2>Cursos del Ciclo ${ciclo}</h2><ul>`;

  cursosPorCiclo[ciclo].forEach((curso) => {
    const colorClass = `grupo-${curso.grupo}`;
    const estaCompleto = completados.includes(curso.id) ? "completado" : "";
    const prereqText = curso.prereq
      ? `<small> → Requiere: ${curso.prereq.map(p => obtenerNombreCurso(p)).join(", ")}</small>`
      : "";

    contenedor.innerHTML += `
      <li id="${curso.id}" class="${colorClass} ${estaCompleto}" onclick="toggleCurso('${curso.id}')">
        ${curso.nombre}
        ${prereqText}
      </li>
    `;
  });

  contenedor.innerHTML += "</ul>";
  mostrarProgreso();
}

function toggleCurso(id) {
  let completados = obtenerCursosCompletados();

  if (completados.includes(id)) {
    completados = completados.filter(c => c !== id);
  } else {
    completados.push(id);
  }

  guardarCursosCompletados(completados);
  document.getElementById(id).classList.toggle("completado");
  mostrarProgreso();
}

function mostrarProgreso() {
  const totalCursos = Object.values(cursosPorCiclo).flat().length;
  const completados = obtenerCursosCompletados().length;
  const porcentaje = Math.round((completados / totalCursos) * 100);

  document.getElementById("progreso").innerHTML = `
    <p><strong>Progreso:</strong> ${completados} / ${totalCursos} cursos completados (${porcentaje}%)</p>
  `;
}

function obtenerNombreCurso(id) {
  for (let ciclo of Object.values(cursosPorCiclo)) {
    for (let curso of ciclo) {
      if (curso.id === id) return curso.nombre;
    }
  }
  return id;
}