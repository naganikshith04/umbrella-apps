```javascript
// Resume Builder Pro - Main Application

class ResumeBuilder {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.resumeData = {
            personal: {},
            experience: [],
            education: [],
            skills: [],
            summary: ''
        };
        this.selectedTemplate = 'modern';
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.updateStepDisplay();
        this.updatePreview();
        this.setupAutoSave();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('[data-next]').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        document.querySelectorAll('[data-prev]').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });

        // Personal Information
        const personalFields = ['fullName', 'email', 'phone', 'location'];
        personalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.resumeData.personal[field] = e.target.value;
                    this.updatePreview();
                });
            }
        });

        // Summary
        const summaryField = document.getElementById('summary');
        if (summaryField) {
            summaryField.addEventListener('input', (e) => {
                this.resumeData.summary = e.target.value;
                this.updatePreview();
            });
        }

        // Experience
        const addExperienceBtn = document.getElementById('addExperience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperience());
        }

        // Education
        const addEducationBtn = document.getElementById('addEducation');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => this.addEducation());
        }

        // Skills
        const skillInput = document.getElementById('skillInput');
        if (skillInput) {
            skillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addSkill();
                }
            });
        }

        const addSkillBtn = document.querySelector('[data-add-skill]');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => this.addSkill());
        }

        // Template Selection
        document.querySelectorAll('[data-template]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.selectTemplate(template);
            });
        });

        // Export to PDF
        const exportBtn = document.querySelector('[data-export-pdf]');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Download Resume
        const downloadBtn = document.querySelector('[data-download]');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Clear/Reset
        const clearBtn = document.querySelector('[data-clear]');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearData());
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.scrollToTop();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.scrollToTop();
        }
    }

    updateStepDisplay() {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        }

        // Show current step
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.style.display = 'block';
        }

        // Update progress indicators
        document.querySelectorAll('[data-step]').forEach(indicator => {
            const stepNum = parseInt(indicator.dataset.step);
            indicator.classList.remove('active', 'completed');
            
            if (stepNum === this.currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    validateCurrentStep() {
        let isValid = true;
        const errors = [];

        if (this.currentStep === 1) {
            // Validate personal information
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');

            if (fullName && !fullName.value.trim()) {
                errors.push('Full name is required');
                fullName.classList.add('error');
                isValid = false;
            } else if (fullName) {
                fullName.classList.remove('error');
            }

            if (email && !this.validateEmail(email.value)) {
                errors.push('Valid email is required');
                email.classList.add('error');
                isValid = false;
            } else if (email) {
                email.classList.remove('error');
            }

            if (phone && !phone.value.trim()) {
                errors.push('Phone number is required');
                phone.classList.add('error');
                isValid = false;
            } else if (phone) {
                phone.classList.remove('error');
            }
        }

        if (!isValid) {
            this.showNotification(errors.join(', '), 'error');
        }

        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    addExperience() {
        const experienceList = document.getElementById('experienceList');
        const template = document.getElementById('experienceTemplate');
        
        if (!experienceList || !template) return;

        const clone = template.content.cloneNode(true);
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.appendChild(clone);

        const index = this.resumeData.experience.length;
        this.resumeData.experience.push({
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });

        // Setup input listeners
        const inputs = experienceItem.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const field = input.dataset.field;
            if (field) {
                input.addEventListener('input', (e) => {
                    if (input.type === 'checkbox') {
                        this.resumeData.experience[index][field] = e.target.checked;
                        const endDateInput = experienceItem.querySelector('[data-field="endDate"]');
                        if (endDateInput) {
                            endDateInput.disabled = e.target.checked;
                            if (e.target.checked) {
                                endDateInput.value = '';
                                this.resumeData.experience[index].endDate = '';
                            }
                        }
                    } else {
                        this.resumeData.experience[index][field] = e.target.value;
                    }
                    this.updatePreview();
                });
            }
        });

        // Setup remove button
        const removeBtn = experienceItem.querySelector('[data-remove-experience]');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.resumeData.experience.splice(index, 1);
                experienceItem.remove();
                this.updatePreview();
                this.reindexExperience();
            });
        }

        experienceList.appendChild(experienceItem);
        this.updatePreview();
    }

    reindexExperience() {
        const experienceItems = document.querySelectorAll('#experienceList .experience-item');
        experienceItems.forEach((item, newIndex) => {
            const inputs = item.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const field = input.dataset.field;
                if (field) {
                    input.removeEventListener('input', null);
                    input.addEventListener('input', (e) => {
                        if (input.type === 'checkbox') {
                            this.resumeData.experience[newIndex][field] = e.target.checked;
                        } else {
                            this.resumeData.experience[newIndex][field] = e.target.value;
                        }
                        this.updatePreview();
                    });
                }
            });

            const removeBtn = item.querySelector('[data-remove-experience]');
            if (removeBtn) {
                removeBtn.replaceWith(removeBtn.cloneNode(true));
                const newRemoveBtn = item.querySelector('[data-remove-experience]');
                newRemoveBtn.addEventListener('click', () => {
                    this.resumeData.experience.splice(newIndex, 1);
                    item.remove();
                    this.updatePreview();
                    this.reindexExperience();
                });
            }
        });
    }

    addEducation() {
        const educationList = document.getElementById('educationList');
        const template = document.getElementById('educationTemplate');
        
        if (!educationList || !template) return;

        const clone = template.content.cloneNode(true);
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.appendChild(clone);

        const index = this.resumeData.education.length;
        this.resumeData.education.push({
            degree: '',
            school: '',
            graduationDate: '',
            gpa: ''
        });

        // Setup input listeners
        const inputs = educationItem.querySelectorAll('input');
        inputs.forEach(input => {
            const field = input.dataset.field;
            if (field) {
                input.addEventListener('input', (e) => {
                    this.resumeData.education[index][field] = e.target.value;
                    this.updatePreview();
                });
            }
        });

        // Setup remove button
        const removeBtn = educationItem.querySelector('[data-remove-education]');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.resumeData.education.splice(index, 1);
                educationItem.remove();
                this.updatePreview();
                this.reindexEducation();
            });
        }

        educationList.appendChild(educationItem);
        this.updatePreview();
    }

    reindexEducation() {
        const educationItems = document.querySelectorAll('#educationList .education-item');
        educationItems.forEach((item, newIndex) => {
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                const field = input.dataset.field;
                if (field) {
                    input.removeEventListener('input', null);
                    input.addEventListener('input', (e) => {
                        this.resumeData.education[newIndex][field] = e.target.value;
                        this.updatePreview();
                    });
                }
            });

            const removeBtn = item.querySelector('[data-remove-education]');
            if (removeBtn) {
                removeBtn.replaceWith(removeBtn.cloneNode(true));
                const newRemoveBtn = item.querySelector('[data-remove-education]');
                newRemoveBtn.addEventListener('click', () => {
                    this.resumeData.education.splice(newIndex, 1);
                    item.remove();
                    this.updatePreview();
                    this.reindexEducation();
                });
            }
        });
    }

    addSkill() {
        const skillInput = document.getElementById('skillInput');
        if (!skillInput || !skillInput.value.trim()) return;

        const skill = skillInput.value.trim();
        if (this.resumeData.skills.includes(skill)) {
            this.showNotification('Skill already added', 'warning');
            return;
        }

        this.resumeData.skills.push(skill);
        this.renderSkills();
        skillInput.value = '';
        this.updatePreview();
    }

    renderSkills() {
        const skillsContainer = document.getElementById('skillsContainer');
        if (!skillsContainer) return;

        skillsContainer.innerHTML = '';

        this.resumeData.skills.forEach((skill, index) => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${this.escapeHtml(skill)}</span>
                <button type="button" class="remove-skill" data-index="${index}">&times;</button>
            `;

            const removeBtn = skillTag.querySelector('.remove-skill');
            removeBtn.addEventListener('click', () => {
                this.resumeData.skills.splice(index, 1);
                this.renderSkills();
                this.updatePreview();
            });

            skillsContainer.appendChild(skillTag);
        });
    }

    selectTemplate(templateName) {
        this.selectedTemplate = templateName;
        
        // Update active state
        document.querySelectorAll('[data-template]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.template === templateName) {
                btn.classList.add('active');
            }
        });

        this.updatePreview();
    }

    updatePreview() {
        const preview = document.getElementById('resumePreview');
        if (!preview) return;

        const templateHTML = this.generateTemplateHTML();
        preview.innerHTML = templateHTML;
        this.saveToLocalStorage();
    }

    generateTemplateHTML() {
        const { personal, experience, education, skills, summary } = this.resumeData;

        switch (this.selectedTemplate) {
            case 'modern':
                return this.generateModernTemplate(personal, experience, education, skills, summary);
            case 'classic':
                return this.generateClassicTemplate(personal, experience, education, skills, summary);
            case 'minimal':
                return this.generateMinimalTemplate(personal, experience, education, skills, summary);
            case 'creative':
                return this.generateCreativeTemplate(personal, experience, education, skills, summary);
            case 'professional':
                return this.generateProfessionalTemplate(personal, experience, education, skills, summary);
            case 'elegant':
                return this.generateElegantTemplate(personal, experience, education, skills, summary);
            default:
                return this.generateModernTemplate(personal, experience, education, skills, summary);
        }
    }

    generateModernTemplate(personal, experience, education, skills, summary) {
        return `
            <div class="resume-template modern-template">
                <header class="resume-header">
                    <h1>${this.escapeHtml(personal.fullName || 'Your Name')}</h1>
                    <div class="contact-info">
                        ${personal.email ? `<span><i class="icon-email"></i>${this.escapeHtml(personal.email)}</span>` : ''}
                        ${personal.phone ? `<span><i class="icon-phone"></i>${this.escapeHtml(personal.phone)}</span>` : ''}
                        ${personal.location ? `<span><i class="icon-location"></i>${this.escapeHtml(personal.location)}</span>` : ''}
                    </div>
                </header>

                ${summary ? `
                    <section class="resume-section">
                        <h2>Professional Summary</h2>
                        <p>${this.escapeHtml(summary)}</p>
                    </section>
                ` : ''}

                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2>Work Experience</h2>
                        ${experience.map(exp => `
                            <div class="experience-entry">
                                <div class="entry-header">
                                    <h3>${this.escapeHtml(exp.jobTitle || 'Job Title')}</h3>
                                    <span class="date">${this.escapeHtml(exp.startDate || 'Start')} - ${exp.current ? 'Present' : this.escapeHtml(exp.endDate || 'End')}</span>
                                </div>
                                <div class="entry-subheader">
                                    <strong>${this.escapeHtml(exp.company || 'Company Name')}</strong>
                                </div>
                                ${exp.description ? `<p>${this.escapeHtml(exp.description)}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2>Education</h2>
                        ${education.map(edu => `
                            <div class="education-entry">
                                <div class="entry-header">
                                    <h3>${this.escapeHtml(edu.degree || 'Degree')}</h3>
                                    <span class="date">${this.escapeHtml(edu.graduationDate || 'Graduation Date')}</span>
                                </div>
                                <div class="entry-subheader">
                                    <strong>${this.escapeHtml(edu.school || 'School Name')}</strong>
                                    ${edu.gpa ? `<span>GPA: ${this.escapeHtml(edu.gpa)}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${skills.length > 0 ? `
                    <section class="resume-section">
                        <h2>Skills</h2>
                        <div class="skills-list">
                            ${skills.map(skill => `<span class="skill-item">${this.escapeHtml(skill)}</span>`).join('')}
                        </div>
                    </section>
                ` : ''}
            </div>
        `;
    }

    generateClassicTemplate(personal, experience, education, skills, summary) {
        return `
            <div class="resume-template classic-template">
                <header class="resume-header">
                    <h1>${this.escapeHtml(personal.fullName || 'Your Name')}</h1>
                    <div class="contact-info">
                        ${personal.email ? `${this.escapeHtml(personal.email)}` : ''}
                        ${personal.phone ? ` | ${this.escapeHtml(personal.phone)}` : ''}
                        ${personal.location ? ` | ${this.escapeHtml(personal.location)}` : ''}
                    </div>
                </header>

                ${summary ? `
                    <section class="resume-section">
                        <h2>OBJECTIVE</h2>
                        <hr>
                        <p>${this.escapeHtml(summary)}</p>
                    </section>
                ` : ''}

                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2>EXPERIENCE</h2>
                        <hr>
                        ${experience.map(exp => `
                            <div class="experience-entry">
                                <h3>${this.escapeHtml(exp.jobTitle || 'Job Title')}</h3>
                                <div class="entry-meta">
                                    <strong>${this.escapeHtml(exp.company || 'Company Name')}</strong>
                                    <span>${this.escapeHtml(exp.startDate || 'Start')} - ${exp.current ? 'Present' : this.escapeHtml(exp.endDate || 'End')}</span>
                                </div>
                                ${exp.description ? `<p>${this.escapeHtml(exp.description)}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2>EDUCATION</h2>
                        <hr>
                        ${education.map(edu => `
                            <div class="education-entry">
                                <h3>${this.escapeHtml(edu.degree || 'Degree')}</h3>
                                <div class="entry-meta">
                                    <strong>${this.escapeHtml(edu.school || 'School Name')}</strong>
                                    <span>${this.escapeHtml(edu.graduationDate || 'Graduation Date')}</span>
                                </div>
                                ${edu.gpa ? `<p>GPA: ${this.escapeHtml(edu.gpa)}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${skills.length > 0 ? `
                    <section class="resume-section">
                        <h2>SKILLS</h2>
                        <hr>
                        <p>${skills.map(skill => this.escapeHtml(skill)).join(' • ')}</p>
                    </section>
                ` : ''}
            </div>
        `;
    }

    generateMinimalTemplate(personal, experience, education, skills, summary) {
        return `
            <div class="resume-template minimal-template">
                <header class="resume-header">
                    <h1>${this.escapeHtml(personal.fullName || 'Your Name')}</h1>
                    <div class="contact-info">
                        ${personal.email ? `${this.escapeHtml(personal.email)}` : ''}
                        ${personal.phone ? ` · ${this.escapeHtml(personal.phone)}` : ''}
                        ${personal.location ? ` · ${this.escapeHtml(personal.location)}` : ''}
                    </div>
                </header>

                ${summary ? `
                    <section class="resume-section">
                        <p class="summary">${this.escapeHtml(summary)}</p>
                    </section>
                ` : ''}

                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2>Experience</h2>
                        ${experience.map(exp => `
                            <div class="experience-entry">
                                <div class="entry-row">
                                    <h3>${this.escapeHtml(exp.jobTitle || 'Job Title')}</h3>
                                    <span class="date">${this.escapeHtml(exp.startDate || 'Start')} - ${exp.current ? 'Present' : this.escapeHtml(exp.endDate || 'End')}</span>
                                </div>
                                <div class="company">${this.escapeHtml(exp.company || 'Company Name')}</div>
                                ${exp.description ? `<p>${this.escapeHtml(exp.description)}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2>Education</h2>
                        ${education.map(edu => `
                            <div class="education-entry">
                                <div class="entry-row">
                                    <h3>${this.escapeHtml(edu.degree || 'Degree')}</h3>
                                    <span class="date">${this.escapeHtml(edu.graduationDate || 'Graduation Date')}</span>
                                </div>
                                <div class="school">${this.escapeHtml(edu.school || 'School Name')}${edu.gpa ? ` · GPA: ${this.escapeHtml(edu.gpa)}` : ''}</div>
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${skills.length > 0 ? `
                    <section class="resume-section">
                        <h2>Skills</h2>
                        <div class="skills-minimal">
                            ${skills.map(skill => this.escapeHtml(skill)).join(', ')}
                        </div>
                    </section>
                ` : ''}
            </div>
        `;
    }

    generateCreativeTemplate(personal, experience, education, skills, summary) {
        return `
            <div class="resume-template creative-template">
                <div class="sidebar">
                    <div class="profile-section">
                        <h1>${this.escapeHtml(personal.fullName || 'Your Name')}</h1>
                        ${summary ? `<p class="tagline">${this.escapeHtml(summary)}</p>` : ''}
                    </div>

                    <div class="contact-section">
                        <h2>Contact</h2>
                        ${personal.email ? `<div class="contact-item"><strong>Email:</strong> ${this.escapeHtml(personal.email)}</div>` : ''}
                        ${personal.phone ? `<div class="contact-item"><strong>Phone:</strong> ${this.escapeHtml(personal.phone)}</div>` : ''}
                        ${personal.location ? `<div class="contact-item"><strong>Location:</strong> ${this.escapeHtml(personal.location)}</div>` : ''}
                    </div>

                    ${skills.length > 0 ? `
                        <div class="skills-section">
                            <h2>Skills</h2>
                            <div class="skills-creative">
                                ${skills.map(skill => `<div class="skill-badge">${this.escapeHtml(skill)}</div>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="main-content">
                    ${experience.length > 0 ? `
                        <section class="resume-section">
                            <h2>Experience</h2>
                            ${experience.map(exp => `
                                <div class="experience-entry">
                                    <h3>${this.escapeHtml(exp.jobTitle || 'Job Title')}</h3>
                                    <div class="meta-info">
                                        <span class="company">${this.escapeHtml(exp.company || 'Company Name')}</span>
                                        <span class="date">${this.escapeHtml(exp.startDate || 'Start')} - ${exp.current ? 'Present' : this.escapeHtml(exp.endDate || 'End')}</span>
                                    </div>
                                    ${exp.description ? `<p>${this.escapeHtml(exp.description)}</p>` : ''}
                                </div>
                            `).join('')}
                        </section>
                    ` : ''}

                    ${education.length > 0 ? `
                        <section class="resume-section">
                            <h2>Education</h2>
                            ${education.map(edu => `
                                <div class="education-entry">
                                    <h3>${this.escapeHtml(edu.degree || 'Degree')}</h3>
                                    <div class="meta-info">
                                        <span class="school">${this.escapeHtml(edu.school || 'School Name')}</span>
                                        <span class="date">${this.escapeHtml(edu.graduationDate || 'Graduation Date')}</span>
                                    </div>
                                    ${edu.gpa ? `<p>GPA: ${this.escapeHtml(edu.gpa)}</p>` : ''}
                                </div>
                            `).join('')}
                        </section>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateProfessionalTemplate(personal, experience, education, skills, summary) {
        return `
            <div class="resume-template professional-template">
                <header class="resume-header">
                    <div class="header-content">
                        <h1>${this.escapeHtml(personal.fullName || 'Your Name')}</h1>
                        <div class="contact-bar">
                            ${personal.email ? `<span>${this.escapeHtml(personal.email)}</span>` : ''}
                            ${personal.phone ? `<span>${this.escapeHtml(personal.phone)}</span>` : ''}
                            ${personal.location ? `<span>${this.escapeHtml(personal.location)}</span>` : ''}
                        </div>
                    </div>
                </header>

                ${summary ? `
                    <section class="resume-section">
                        <h2 class="section-title">Professional Summary</h2>
                        <div class="section-content">
                            <p>${this.escapeHtml(summary)}</p>
                        </div>
                    </section>
                ` : ''}

                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Professional Experience</h2>
                        <div class="section-content">
                            ${experience.map(exp => `
                                <div class="experience-entry">
                                    <div class="entry-header-row">
                                        <div>
                                            <h3>${this.escapeHtml(exp.jobTitle || 'Job Title')}</h3>
                                            <div class="company-name">${this.escapeHtml(exp.company || 'Company Name')}</div>
                                        </div>
                                        <div class="date-range">${this.escapeHtml(exp.startDate || 'Start')} - ${exp.current ? 'Present' : this.escapeHtml(exp.endDate || 'End')}</div>
                                    </div>
                                    ${exp.description ? `<p class="description">${this.escapeHtml(exp.description)}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </section>
                ` : ''}

                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Education</h2>
                        <div class="section-content">
                            ${