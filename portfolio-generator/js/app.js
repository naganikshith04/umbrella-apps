```javascript
// Portfolio Generator JavaScript

// State management
const portfolioState = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    bio: '',
    profilePhoto: '',
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      github: ''
    }
  },
  projects: [],
  skills: [],
  testimonials: [],
  theme: 'modern'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  initializeEventListeners();
  updatePreview();
  setCurrentYear();
});

// Set current year in footer
function setCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  // Personal info listeners
  document.getElementById('full-name')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.fullName = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('job-title')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.jobTitle = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('bio')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.bio = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('profile-photo')?.addEventListener('change', handleProfilePhoto);

  // Contact info listeners
  document.getElementById('contact-email')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.contact.email = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('contact-phone')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.contact.phone = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('contact-linkedin')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.contact.linkedin = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  document.getElementById('contact-github')?.addEventListener('input', (e) => {
    portfolioState.personalInfo.contact.github = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  // Project, skill, testimonial buttons
  document.getElementById('add-project')?.addEventListener('click', addProject);
  document.getElementById('add-skill')?.addEventListener('click', addSkill);
  document.getElementById('add-testimonial')?.addEventListener('click', addTestimonial);

  // Preview and export buttons
  document.getElementById('preview-btn')?.addEventListener('click', showPreview);
  document.getElementById('close-preview')?.addEventListener('click', closePreview);
  document.getElementById('export-btn')?.addEventListener('click', exportAsHTML);

  // Theme selector
  document.getElementById('theme-select')?.addEventListener('change', (e) => {
    portfolioState.theme = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });
}

// Handle profile photo upload
function handleProfilePhoto(e) {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      portfolioState.personalInfo.profilePhoto = event.target.result;
      saveToLocalStorage();
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
}

// Add new project
function addProject() {
  const projectsList = document.getElementById('projects-list');
  const template = document.getElementById('project-template');
  
  if (!projectsList || !template) return;

  const projectId = `project-${Date.now()}`;
  const projectItem = template.content.cloneNode(true);
  const projectDiv = projectItem.querySelector('.project-item');
  projectDiv.dataset.id = projectId;

  const project = {
    id: projectId,
    title: '',
    description: '',
    technologies: '',
    link: '',
    image: ''
  };

  portfolioState.projects.push(project);

  // Add event listeners to inputs
  const titleInput = projectItem.querySelector('.project-title');
  const descInput = projectItem.querySelector('.project-description');
  const techInput = projectItem.querySelector('.project-technologies');
  const linkInput = projectItem.querySelector('.project-link');
  const imageInput = projectItem.querySelector('.project-image');
  const removeBtn = projectItem.querySelector('.remove-project');

  titleInput.addEventListener('input', (e) => {
    project.title = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  descInput.addEventListener('input', (e) => {
    project.description = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  techInput.addEventListener('input', (e) => {
    project.technologies = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  linkInput.addEventListener('input', (e) => {
    project.link = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        project.image = event.target.result;
        saveToLocalStorage();
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  removeBtn.addEventListener('click', () => {
    removeProject(projectId);
  });

  projectsList.appendChild(projectItem);
  saveToLocalStorage();
  updatePreview();
}

// Remove project
function removeProject(projectId) {
  portfolioState.projects = portfolioState.projects.filter(p => p.id !== projectId);
  const projectDiv = document.querySelector(`[data-id="${projectId}"]`);
  if (projectDiv) {
    projectDiv.remove();
  }
  saveToLocalStorage();
  updatePreview();
}

// Add new skill
function addSkill() {
  const skillsList = document.getElementById('skills-list');
  const template = document.getElementById('skill-template');
  
  if (!skillsList || !template) return;

  const skillId = `skill-${Date.now()}`;
  const skillItem = template.content.cloneNode(true);
  const skillDiv = skillItem.querySelector('.skill-item');
  skillDiv.dataset.id = skillId;

  const skill = {
    id: skillId,
    name: '',
    proficiency: 50
  };

  portfolioState.skills.push(skill);

  const nameInput = skillItem.querySelector('.skill-name');
  const proficiencyInput = skillItem.querySelector('.skill-proficiency');
  const proficiencyValue = skillItem.querySelector('.proficiency-value');
  const removeBtn = skillItem.querySelector('.remove-skill');

  nameInput.addEventListener('input', (e) => {
    skill.name = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  proficiencyInput.addEventListener('input', (e) => {
    skill.proficiency = parseInt(e.target.value);
    proficiencyValue.textContent = `${skill.proficiency}%`;
    saveToLocalStorage();
    updatePreview();
  });

  removeBtn.addEventListener('click', () => {
    removeSkill(skillId);
  });

  skillsList.appendChild(skillItem);
  saveToLocalStorage();
  updatePreview();
}

// Remove skill
function removeSkill(skillId) {
  portfolioState.skills = portfolioState.skills.filter(s => s.id !== skillId);
  const skillDiv = document.querySelector(`[data-id="${skillId}"]`);
  if (skillDiv) {
    skillDiv.remove();
  }
  saveToLocalStorage();
  updatePreview();
}

// Add new testimonial
function addTestimonial() {
  const testimonialsList = document.getElementById('testimonials-list');
  const template = document.getElementById('testimonial-template');
  
  if (!testimonialsList || !template) return;

  const testimonialId = `testimonial-${Date.now()}`;
  const testimonialItem = template.content.cloneNode(true);
  const testimonialDiv = testimonialItem.querySelector('.testimonial-item');
  testimonialDiv.dataset.id = testimonialId;

  const testimonial = {
    id: testimonialId,
    name: '',
    position: '',
    company: '',
    text: '',
    image: ''
  };

  portfolioState.testimonials.push(testimonial);

  const nameInput = testimonialItem.querySelector('.testimonial-name');
  const positionInput = testimonialItem.querySelector('.testimonial-position');
  const companyInput = testimonialItem.querySelector('.testimonial-company');
  const textInput = testimonialItem.querySelector('.testimonial-text');
  const imageInput = testimonialItem.querySelector('.testimonial-image');
  const removeBtn = testimonialItem.querySelector('.remove-testimonial');

  nameInput.addEventListener('input', (e) => {
    testimonial.name = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  positionInput.addEventListener('input', (e) => {
    testimonial.position = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  companyInput.addEventListener('input', (e) => {
    testimonial.company = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  textInput.addEventListener('input', (e) => {
    testimonial.text = e.target.value;
    saveToLocalStorage();
    updatePreview();
  });

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        testimonial.image = event.target.result;
        saveToLocalStorage();
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  removeBtn.addEventListener('click', () => {
    removeTestimonial(testimonialId);
  });

  testimonialsList.appendChild(testimonialItem);
  saveToLocalStorage();
  updatePreview();
}

// Remove testimonial
function removeTestimonial(testimonialId) {
  portfolioState.testimonials = portfolioState.testimonials.filter(t => t.id !== testimonialId);
  const testimonialDiv = document.querySelector(`[data-id="${testimonialId}"]`);
  if (testimonialDiv) {
    testimonialDiv.remove();
  }
  saveToLocalStorage();
  updatePreview();
}

// Update preview
function updatePreview() {
  updatePreviewPersonalInfo();
  updatePreviewProjects();
  updatePreviewSkills();
  updatePreviewTestimonials();
  updatePreviewContact();
  applyTheme();
}

// Update personal info in preview
function updatePreviewPersonalInfo() {
  const previewName = document.getElementById('preview-name');
  const previewTitle = document.getElementById('preview-title');
  const previewBio = document.getElementById('preview-bio');
  const previewPhoto = document.getElementById('preview-photo');
  const previewFooterName = document.getElementById('preview-footer-name');

  if (previewName) {
    previewName.textContent = portfolioState.personalInfo.fullName || 'Your Name';
  }
  if (previewTitle) {
    previewTitle.textContent = portfolioState.personalInfo.jobTitle || 'Your Job Title';
  }
  if (previewBio) {
    previewBio.textContent = portfolioState.personalInfo.bio || 'Your bio goes here...';
  }
  if (previewPhoto) {
    if (portfolioState.personalInfo.profilePhoto) {
      previewPhoto.src = portfolioState.personalInfo.profilePhoto;
      previewPhoto.style.display = 'block';
    } else {
      previewPhoto.style.display = 'none';
    }
  }
  if (previewFooterName) {
    previewFooterName.textContent = portfolioState.personalInfo.fullName || 'Your Name';
  }
}

// Update projects in preview
function updatePreviewProjects() {
  const previewProjects = document.getElementById('preview-projects');
  if (!previewProjects) return;

  if (portfolioState.projects.length === 0) {
    previewProjects.innerHTML = '<p class="empty-state">No projects added yet</p>';
    return;
  }

  previewProjects.innerHTML = portfolioState.projects.map(project => `
    <div class="preview-project-card">
      ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-preview-image">` : ''}
      <h3>${project.title || 'Untitled Project'}</h3>
      <p class="project-description">${project.description || 'No description'}</p>
      ${project.technologies ? `<p class="project-tech"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
      ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">View Project →</a>` : ''}
    </div>
  `).join('');
}

// Update skills in preview
function updatePreviewSkills() {
  const previewSkills = document.getElementById('preview-skills');
  if (!previewSkills) return;

  if (portfolioState.skills.length === 0) {
    previewSkills.innerHTML = '<p class="empty-state">No skills added yet</p>';
    return;
  }

  previewSkills.innerHTML = portfolioState.skills.map(skill => `
    <div class="preview-skill">
      <div class="skill-header">
        <span class="skill-name">${skill.name || 'Unnamed Skill'}</span>
        <span class="skill-percentage">${skill.proficiency}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" style="width: ${skill.proficiency}%"></div>
      </div>
    </div>
  `).join('');
}

// Update testimonials in preview
function updatePreviewTestimonials() {
  const previewTestimonials = document.getElementById('preview-testimonials');
  if (!previewTestimonials) return;

  if (portfolioState.testimonials.length === 0) {
    previewTestimonials.innerHTML = '<p class="empty-state">No testimonials added yet</p>';
    return;
  }

  let currentTestimonialIndex = 0;

  const renderTestimonial = (index) => {
    const testimonial = portfolioState.testimonials[index];
    previewTestimonials.innerHTML = `
      <div class="testimonial-carousel">
        <div class="testimonial-content">
          ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">` : '<div class="testimonial-avatar-placeholder"></div>'}
          <p class="testimonial-text">"${testimonial.text || 'No testimonial text'}"</p>
          <p class="testimonial-author"><strong>${testimonial.name || 'Anonymous'}</strong></p>
          <p class="testimonial-position">${testimonial.position || ''}${testimonial.company ? ` at ${testimonial.company}` : ''}</p>
        </div>
        ${portfolioState.testimonials.length > 1 ? `
          <div class="carousel-controls">
            <button class="carousel-btn prev-btn" aria-label="Previous testimonial">‹</button>
            <div class="carousel-dots">
              ${portfolioState.testimonials.map((_, i) => `
                <span class="dot ${i === index ? 'active' : ''}" data-index="${i}"></span>
              `).join('')}
            </div>
            <button class="carousel-btn next-btn" aria-label="Next testimonial">›</button>
          </div>
        ` : ''}
      </div>
    `;

    // Add event listeners for carousel controls
    if (portfolioState.testimonials.length > 1) {
      const prevBtn = previewTestimonials.querySelector('.prev-btn');
      const nextBtn = previewTestimonials.querySelector('.next-btn');
      const dots = previewTestimonials.querySelectorAll('.dot');

      prevBtn?.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + portfolioState.testimonials.length) % portfolioState.testimonials.length;
        renderTestimonial(currentTestimonialIndex);
      });

      nextBtn?.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % portfolioState.testimonials.length;
        renderTestimonial(currentTestimonialIndex);
      });

      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          currentTestimonialIndex = parseInt(e.target.dataset.index);
          renderTestimonial(currentTestimonialIndex);
        });
      });
    }
  };

  renderTestimonial(currentTestimonialIndex);
}

// Update contact info in preview
function updatePreviewContact() {
  const previewContactInfo = document.getElementById('preview-contact-info');
  if (!previewContactInfo) return;

  const contact = portfolioState.personalInfo.contact;
  const hasContact = contact.email || contact.phone || contact.linkedin || contact.github;

  if (!hasContact) {
    previewContactInfo.innerHTML = '<p class="empty-state">No contact information added yet</p>';
    return;
  }

  previewContactInfo.innerHTML = `
    <div class="contact-info-grid">
      ${contact.email ? `
        <div class="contact-item">
          <strong>Email:</strong>
          <a href="mailto:${contact.email}">${contact.email}</a>
        </div>
      ` : ''}
      ${contact.phone ? `
        <div class="contact-item">
          <strong>Phone:</strong>
          <a href="tel:${contact.phone}">${contact.phone}</a>
        </div>
      ` : ''}
      ${contact.linkedin ? `
        <div class="contact-item">
          <strong>LinkedIn:</strong>
          <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer">View Profile</a>
        </div>
      ` : ''}
      ${contact.github ? `
        <div class="contact-item">
          <strong>GitHub:</strong>
          <a href="${contact.github}" target="_blank" rel="noopener noreferrer">View Profile</a>
        </div>
      ` : ''}
    </div>
  `;
}

// Apply theme
function applyTheme() {
  const preview = document.getElementById('portfolio-preview');
  if (!preview) return;

  preview.className = `portfolio-preview theme-${portfolioState.theme}`;
}

// Show preview
function showPreview() {
  const previewSection = document.getElementById('preview-section');
  if (previewSection) {
    previewSection.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Close preview
function closePreview() {
  const previewSection = document.getElementById('preview-section');
  if (previewSection) {
    previewSection.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Export as HTML
function exportAsHTML() {
  const htmlContent = generateHTMLContent();
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const fileName = `${portfolioState.personalInfo.fullName.replace(/\s+/g, '_') || 'portfolio'}.html`;
  
  if (typeof saveAs === 'function') {
    saveAs(blob, fileName);
  } else {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Generate HTML content for export
function generateHTMLContent() {
  const { personalInfo, projects, skills, testimonials, theme } = portfolioState;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${personalInfo.bio || 'Professional Portfolio'}">
    <title>${personalInfo.fullName || 'Portfolio'} - ${personalInfo.jobTitle || 'Professional Portfolio'}</title>
    <style>
        ${getThemeStyles(theme)}
    </style>
</head>
<body class="theme-${theme}">
    <header class="portfolio-header">
        <div class="container">
            ${personalInfo.profilePhoto ? `<img src="${personalInfo.profilePhoto}" alt="${personalInfo.fullName}" class="profile-photo">` : ''}
            <h1>${personalInfo.fullName || 'Your Name'}</h1>
            <p class="job-title">${personalInfo.jobTitle || 'Your Job Title'}</p>
        </div>
    </header>

    <main>
        <section id="about" class="section">
            <div class="container">
                <h2>About Me</h2>
                <p>${personalInfo.bio || 'Your bio goes here...'}</p>
            </div>
        </section>

        ${projects.length > 0 ? `
        <section id="projects" class="section">
            <div class="container">
                <h2>Projects</h2>
                <div class="projects-grid">
                    ${projects.map(project => `
                        <div class="project-card">
                            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            ${project.technologies ? `<p class="tech-stack"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                            ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">View Project →</a>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${skills.length > 0 ? `
        <section id="skills" class="section">
            <div class="container">
                <h2>Skills</h2>
                <div class="skills-container">
                    ${skills.map(skill => `
                        <div class="skill">
                            <div class="skill-header">
                                <span>${skill.name}</span>
                                <span>${skill.proficiency}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${skill.proficiency}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        ${testimonials.length > 0 ? `
        <section id="testimonials" class="section">
            <div class="container">
                <h2>Testimonials</h2>
                <div class="testimonials-carousel">
                    ${testimonials.map((testimonial, index) => `
                        <div class="testimonial ${index === 0 ? 'active' : ''}" data-index="${index}">
                            ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">` : ''}
                            <p class="testimonial-text">"${testimonial.text}"</p>
                            <p class="testimonial-author"><strong>${testimonial.name}</strong></p>
                            <p class="testimonial-position">${testimonial.position}${testimonial.company ? ` at ${testimonial.company}` : ''}</p>
                        </div>
                    `).join('')}
                    ${testimonials.length > 1 ? `
                    <div class="carousel-controls">
                        <button class="carousel-btn prev" onclick="changeTestimonial(-1)">‹</button>
                        <button class="carousel-btn next" onclick="changeTestimonial(1)">›</button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}

        <section id="contact" class="section">
            <div class="container">
                <h2>Contact Me</h2>
                <div class="contact-info">
                    ${personalInfo.contact.email ? `<p><strong>Email:</strong> <a href="mailto:${personalInfo.contact.email}">${personalInfo.contact.email}</a></p>` : ''}
                    ${personalInfo.contact.phone ? `<p><strong>Phone:</strong> <a href="tel:${personalInfo.contact.phone}">${personalInfo.contact.phone}</a></p>` : ''}
                    ${personalInfo.contact.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${personalInfo.contact.linkedin}" target="_blank" rel="noopener noreferrer">View Profile</a></p>` : ''}
                    ${personalInfo.contact.github ? `<p><strong>GitHub:</strong> <a href="${personalInfo.contact.github}" target="_blank" rel="noopener noreferrer">View Profile</a></p>` : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="portfolio-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName || 'Your Name'}. All rights reserved.</p>
        </div>
    </footer>

    ${testimonials.length > 1 ? `
    <script>
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        
        function changeTestimonial(direction) {
            testimonials[currentTestimonial].classList.remove('active');
            currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
            testimonials[currentTestimonial].classList.add('active');
        }
        
        setInterval(() => changeTestimonial(1), 5000);
    </script>
    ` : ''}
</body>
</html>`;
}

// Get theme styles
function getThemeStyles(theme) {
  const baseStyles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .portfolio-header {
            text-align: center;
            padding: 60px 20px;
        }

        .profile-photo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
            border: 4px solid #fff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .portfolio-header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .job-title {
            font-size: 1.2rem;
            opacity: 0.8;
        }

        .section {
            padding: 60px 20px;
        }

        .section h2 {
            font-size: 2rem;
            margin-bottom: 30px;
            text-align: center;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .project-card {
            border-radius: 8px;
            padding: 20px;
            transition: transform 0.3s ease;
        }

        .project-card:hover {
            transform: translateY(-5px);
        }

        .project-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .project-card h3 {
            margin-bottom: 10px;
        }

        .tech-stack {
            margin-top: 10px;
            font-size: 0.9rem;
        }

        .project-link {
            display: inline-block;
            margin-top: 15px;
            text-decoration: none;
            font-weight: bold;
        }

        .skills-container {
            max-width: 800px;
            margin: 0 auto;
        }

        .skill {
            margin-bottom: 25px;
        }

        .skill-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .skill-bar {
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
        }

        .skill-fill {
            height: 100%;
            border-radius: 5px;
            transition: width 0.3s ease;
        }

        .testimonials-carousel {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }

        .testimonial {
            display: none;
            text-align: center;
            padding: 40px;
        }

        .testimonial.active {
            display