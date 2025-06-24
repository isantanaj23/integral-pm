/**
 * app.js
 * Lógica principal de la aplicación Planifica+
 * Este script maneja la navegación, interactividad del Kanban y modales.
 */

document.addEventListener('DOMContentLoaded', function () {

  // --- LÓGICA DE NAVEGACIÓN PRINCIPAL (SIDEBAR) ---
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  const mainContent = document.querySelector('.main-content');
  const contentViews = mainContent.querySelectorAll(':scope > div[id$="-view"]');

  const showView = (viewId) => {
    contentViews.forEach(view => {
      if(view) view.style.display = 'none';
    });
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
      viewToShow.style.display = 'block';
    }
  };
  
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetViewId = this.getAttribute('href').substring(1);
      navLinks.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      showView(targetViewId);
    });
  });

  // --- 2. ESTADO INICIAL DE LA APLICACIÓN ---
  const initialActiveLink = document.querySelector('.sidebar .nav-link.active');
  let initialViewId = initialActiveLink ? initialActiveLink.getAttribute('href').substring(1) : (contentViews.length > 0 ? contentViews[0].id : '');
  showView(initialViewId);


  // --- 3. LÓGICA DEL MODAL DE TAREAS ---
  const taskModalElement = document.getElementById('taskModal');
  if (taskModalElement) {
    taskModalElement.addEventListener('show.bs.modal', function (event) {
      const card = event.relatedTarget;
      if (!card) return;
      const taskTitle = card.querySelector('.card-title')?.textContent;
      const modalTitle = taskModalElement.querySelector('.modal-title');
      if (taskTitle && modalTitle) {
        modalTitle.textContent = taskTitle;
      }
    });
  }

  // --- 4. FUNCIONALIDAD DE ARRASTRAR Y SOLTAR (DRAG & DROP) PARA KANBAN ---
  const taskCards = document.querySelectorAll('.task-card');
  const kanbanColumns = document.querySelectorAll('.kanban-column .card-body');
  let draggedElement = null;

  taskCards.forEach(card => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', (e) => {
      draggedElement = e.target.closest('.task-card');
      setTimeout(() => {
        e.target.style.opacity = '0.5';
      }, 0);
    });

    card.addEventListener('dragend', (e) => {
      e.target.style.opacity = '1';
      draggedElement = null;
    });
  });

  kanbanColumns.forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necesario para permitir el drop
      column.style.backgroundColor = '#f0f0ff'; // Feedback visual
    });

    column.addEventListener('dragleave', () => {
      column.style.backgroundColor = ''; // Restaura el color
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.style.backgroundColor = '';
      if (draggedElement) {
        column.appendChild(draggedElement);
        // Aquí podrías añadir una función para actualizar el estado de la tarea en el backend.
        console.log(`Tarea '${draggedElement.querySelector('.card-title').textContent}' movida a la columna '${column.previousElementSibling.textContent}'.`);
      }
    });
  });

  // --- 5. ATAJOS DE TECLADO PARA NAVEGACIÓN ---
  document.addEventListener('keydown', (e) => {
    // Usamos 'e.metaKey' para Command en Mac y 'e.ctrlKey' para Ctrl en Windows/Linux.
    if (e.ctrlKey || e.metaKey) {
      const shortcutKey = parseInt(e.key);
      if (!isNaN(shortcutKey) && shortcutKey >= 1 && shortcutKey <= navLinks.length) {
        e.preventDefault();
        const targetLink = navLinks[shortcutKey - 1];
        if (targetLink) {
          targetLink.click(); // Simula un clic en el enlace para cambiar de vista
        }
      }
    }
  });

  

});

document.addEventListener('DOMContentLoaded', function () {

  // --- LÓGICA DE NAVEGACIÓN PRINCIPAL (SIDEBAR) ---
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  const mainContent = document.querySelector('.main-content');
  const contentViews = mainContent.querySelectorAll(':scope > div[id$="-view"]');

  const showView = (viewId) => {
    contentViews.forEach(view => {
      if(view) view.style.display = 'none';
    });
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
      viewToShow.style.display = 'block';
    }
  };
  
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetViewId = this.getAttribute('href').substring(1);
      navLinks.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      showView(targetViewId);
    });
  });

  // --- NAVEGACIÓN ANIDADA: DE PROYECTOS A KANBAN ---
  const projectCards = document.querySelectorAll('.project-card');
  const kanbanTitle = document.getElementById('kanban-title');
  const backToProjectsButton = document.getElementById('back-to-projects');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectName = card.querySelector('.project-title').textContent;
      if (kanbanTitle) {
        kanbanTitle.textContent = `Tablero: ${projectName}`;
      }
      showView('kanban-view');
    });
  });

  if (backToProjectsButton) {
    backToProjectsButton.addEventListener('click', () => {
      showView('proyectos-view');
    });
  }

  // --- LÓGICA DEL MODAL DE TAREAS ---
  const taskModalElement = document.getElementById('taskModal');
  if (taskModalElement) {
    taskModalElement.addEventListener('show.bs.modal', function (event) {
      const card = event.relatedTarget;
      if (!card) return;
      const taskTitle = card.querySelector('.card-title')?.textContent;
      const modalTitle = taskModalElement.querySelector('.modal-title');
      if (taskTitle && modalTitle) {
        modalTitle.textContent = taskTitle;
      }
    });
  }

  // --- ESTADO INICIAL ---
  const initialActiveLink = document.querySelector('.sidebar .nav-link.active');
  if (initialActiveLink) {
    showView(initialActiveLink.getAttribute('href').substring(1));
  } else if (contentViews.length > 0) {
    showView(contentViews[0].id); // Muestra la primera vista si ninguna está activa
  }

});
