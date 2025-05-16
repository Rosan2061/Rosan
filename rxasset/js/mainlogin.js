class QuestionPortal {
    constructor() {
        // Initialize with null values, will be set in init()
        this.loginForm = null;
        this.loginError = null;
        this.mainContent = null;
        this.loggedInUserSpan = null;
        this.userInitials = null;
        this.logoutBtn = null;
        this.questionCardsContainer = null;
        this.searchInput = null;
        this.searchButton = null;
        this.categoryFilter = null;
        this.noResults = null;
        this.backToQuestionsBtn = null;
        this.filterToggle = null;
        this.advancedFilters = null;
        this.sections = {
            questions: null
        };
        this.sessionTimeoutModal = null;
        this.questionPreviewModal = null;
        this.countdownSpan = null;
        this.extendSessionBtn = null;
        this.countdownInterval = null;

        // Configuration
        this.config = {
            sessionTimeoutMinutes: 30,
            sessionWarningMinutes: 2,
            checkSessionInterval: 60000
        };

        // State management
        this.state = {
            currentUser: null,
            currentSection: 'questions',
            questions: [],
            isOnline: navigator.onLine
        };

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.checkExistingSession();
        this.setupPasswordToggle();
        this.setupOnlineStatus();
        this.loadInitialData();
    }

    initializeElements() {
        // Auth elements
        this.loginForm = document.getElementById('loginForm');
        this.loginError = document.getElementById('loginError');
        this.mainContent = document.getElementById('mainContent');
        this.loggedInUserSpan = document.getElementById('loggedInUser');
        this.userInitials = document.getElementById('userInitials');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Question elements
        this.questionCardsContainer = document.getElementById('questionCards');
        this.noResults = document.getElementById('noResults');
        this.backToQuestionsBtn = document.getElementById('backToQuestionsBtn');
        

        // Sections
        this.sections.questions = document.getElementById('questionsSection');

        // Modals
        const sessionTimeoutModalEl = document.getElementById('sessionTimeoutModal');
        if (sessionTimeoutModalEl) {
            this.sessionTimeoutModal = new bootstrap.Modal(sessionTimeoutModalEl);
            this.countdownSpan = document.getElementById('countdown');
            this.extendSessionBtn = document.getElementById('extendSession');
        }

        const questionPreviewModalEl = document.getElementById('questionPreviewModal');
        if (questionPreviewModalEl) {
            this.questionPreviewModal = new bootstrap.Modal(questionPreviewModalEl);
        }
    }

    setupEventListeners() {
        // Auth events
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        if (this.extendSessionBtn) {
            this.extendSessionBtn.addEventListener('click', () => this.extendSession());
        }

        // Question events
        if (this.backToQuestionsBtn) {
            this.backToQuestionsBtn.addEventListener('click', () => this.showQuestionsSection());
        }
    }

    // Initial data loading
    async loadInitialData() {
        try {
            this.state.questions = [
                {
                    id: 1,
                    title: "Question Model 1",
                    description: "Korean Language Test Exam Model.",
                    category: "QSM",
                    fileLink: "QSM1.html",
                    difficulty: "Easy",
                    type: "multiple",
                    status: "published",
                    points: 40,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    title: "PDF Model 1",
                    description: "Korean Language Detail PDF Basice Model.",
                    category: "PDF",
                    fileLink: "rxasset/file/한국 Basic RX' PASS = Rosan2061.pdf",
                    difficulty: "easy",
                    type: "pdf",
                    status: "published",
                    points: undefined,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 3,
                    title: "Question Model 2",
                    description: "Korean Language Test Exam Model",
                    category: "QSM",
                    fileLink: "QSM2.html",
                    difficulty: "hard",
                    type: "multiple",
                    status: "published",
                    points: 40,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 4,
                    title: "Question Model 3",
                    description: "its on updating not complete ",
                    category: "QSM",
                    fileLink: "QSM3.html",
                    difficulty: "medium",
                    type: "multiple",
                    status: "updating",
                    points: 40,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // Update UI with loaded data
            if (this.state.currentUser) {
                this.renderQuestionCards();
                this.showSection('questions');
            }

        } catch (error) {
            console.error("Error loading initial data:", error);
            this.showToast("Error loading data. Please refresh the page.", "error");
        }
    }

    // Setup online/offline detection
    setupOnlineStatus() {
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.showToast("You are back online", "success");
        });

        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.showToast("You are offline. Some features may not work.", "warning");
        });
    }

    // Setup password visibility toggle
    setupPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const input = button.closest('.input-group').querySelector('input');
                const icon = button.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        });
    }

    // Check for existing session
    checkExistingSession() {
        const savedSession = localStorage.getItem('questionPortalSession');

        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                this.startSession(sessionData);
            } catch (e) {
                console.error('Error parsing session data:', e);
                this.clearSession();
            }
        }
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value.trim() || username;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        // Validate form
        if (!username || !password) {
            this.loginForm.classList.add('was-validated');
            return;
        }

        // Show loading state
        const submitBtn = this.loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Hardcoded credentials for demo (in real app, use server-side auth)
            const validUsername = "Rosan";
            const validPassword = "Rosan2061";

            if (username === validUsername && password === validPassword) {
                this.loginError?.classList.add('d-none');

                const sessionData = {
                    username,
                    name,
                    isAdmin: true,
                    timestamp: new Date().getTime(),
                    rememberMe
                };

                this.startSession(sessionData);
                this.loginForm.reset();
                this.loginForm.classList.remove('was-validated');

                // Show welcome message
                this.showToast(`Welcome back, ${name}!`, "success");
            } else {
                this.loginError.textContent = "Invalid username or password";
                this.loginError?.classList.remove('d-none');
                this.showToast("Login failed. Please check your credentials.", "error");
            }
        } catch (error) {
            console.error("Login error:", error);
            this.loginError.textContent = "An error occurred during login";
            this.loginError?.classList.remove('d-none');
            this.showToast("Login error. Please try again.", "error");
        } finally {
            const submitBtn = this.loginForm?.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        }
    }

    // Start new session
    startSession(sessionData) {
        localStorage.setItem('questionPortalSession', JSON.stringify(sessionData));

        // Update state
        this.state.currentUser = {
            username: sessionData.username,
            name: sessionData.name,
            isAdmin: sessionData.isAdmin || false
        };

        // Update UI
        document.querySelector('.login-container')?.classList.add('d-none');
        this.mainContent?.classList.remove('d-none');
        if (this.loggedInUserSpan) {
            this.loggedInUserSpan.textContent = sessionData.name || sessionData.username;
        }

        // Set user initials for avatar
        if (sessionData.name && this.userInitials) {
            const initials = sessionData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            this.userInitials.textContent = initials.substring(0, 2);
        }

        this.renderQuestionCards();
        this.showSection('questions');
    }

    // Handle logout
    handleLogout() {
        this.clearSession();
        this.mainContent?.classList.add('d-none');
        document.querySelector('.login-container')?.classList.remove('d-none');
        if (this.loggedInUserSpan) {
            this.loggedInUserSpan.textContent = '';
        }
        if (this.questionCardsContainer) {
            this.questionCardsContainer.innerHTML = '';
        }

        this.showToast("You have been logged out", "info");
    }

    // Clear session data
    clearSession() {
        localStorage.removeItem('questionPortalSession');
        this.state.currentUser = null;
    }

    // Check for session timeout
    checkSessionTimeout() {
        const savedSession = localStorage.getItem('questionPortalSession');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            const elapsedMinutes = Math.floor((new Date().getTime() - sessionData.timestamp) / 60000);
            const remainingMinutes = this.config.sessionTimeoutMinutes - elapsedMinutes;

            if (remainingMinutes <= 0) {
                this.handleLogout();
            } else if (remainingMinutes <= this.config.sessionWarningMinutes && 
                      this.sessionTimeoutModal && !this.sessionTimeoutModal._isShown) {
                this.showSessionWarning(remainingMinutes);
            }
        }
    }

    // Show session timeout warning
    showSessionWarning(minutes) {
        let seconds = Math.floor(minutes * 60);
        if (this.countdownSpan) {
            this.countdownSpan.textContent = Math.ceil(seconds / 60);
        }

        this.countdownInterval = setInterval(() => {
            seconds--;
            if (this.countdownSpan) {
                this.countdownSpan.textContent = Math.ceil(seconds / 60);
            }

            if (seconds <= 0) {
                clearInterval(this.countdownInterval);
                this.sessionTimeoutModal?.hide();
                this.handleLogout();
            }
        }, 1000);

        this.sessionTimeoutModal?.show();
    }

    // Extend session
    extendSession() {
        clearInterval(this.countdownInterval);
        this.sessionTimeoutModal?.hide();

        const savedSession = localStorage.getItem('questionPortalSession');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            sessionData.timestamp = new Date().getTime();
            localStorage.setItem('questionPortalSession', JSON.stringify(sessionData));

            this.showToast("Session extended", "success");
        }
    }

    // Show specific section
    showSection(section) {
        // Hide all sections first
        Object.values(this.sections).forEach(sec => {
            sec?.classList.add('d-none');
        });

        // Show requested section
        if (this.sections[section]) {
            this.sections[section].classList.remove('d-none');
            this.state.currentSection = section;
        }
    }

    // Show questions section
    showQuestionsSection() {
        this.showSection('questions');
    }

    // Toggle advanced filters
    toggleAdvancedFilters() {
        if (!this.advancedFilters || !this.filterToggle) return;

        this.advancedFilters.classList.toggle('active');
        this.filterToggle.classList.toggle('active');

        const icon = this.filterToggle.querySelector('i');
        if (icon) {
            if (this.advancedFilters.classList.contains('active')) {
                icon.classList.remove('bi-funnel');
                icon.classList.add('bi-funnel-fill');
            } else {
                icon.classList.remove('bi-funnel-fill');
                icon.classList.add('bi-funnel');
            }
        }
    }

    // Render question cards
    renderQuestionCards(questions = this.state.questions) {
        if (!this.questionCardsContainer || !this.noResults) return;

        this.questionCardsContainer.innerHTML = '';

        if (questions.length === 0) {
            this.noResults.classList.remove('d-none');
            return;
        }

        this.noResults.classList.add('d-none');

        questions.forEach((question, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="question-card" style="animation-delay: ${index * 0.1}s">
                    <div class="card-icon">Q${question.id}</div>
                    <h3>${this.escapeHtml(question.title)}</h3>
                    <p>${this.escapeHtml(question.description)}</p>
                    <div class="d-flex gap-2 mb-2">
                        <span class="badge">${this.escapeHtml(question.category)}</span>
                        <span class="badge ${this.getDifficultyBadgeClass(question.difficulty)}">
                            ${this.capitalizeFirstLetter(question.difficulty)}
                        </span>
                        <span class="badge ${this.getStatusBadgeClass(question.status)}">
                            ${this.capitalizeFirstLetter(question.status)}
                        </span>
                    </div>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${this.formatDate(question.updatedAt)}</small>
                            <span class="badge bg-primary">${question.points} pts</span>
                        </div>
                        <div class="d-flex gap-2 mt-3">
                            <button class="btn btn-sm btn-outline-primary view-details" data-id="${question.id}">
                                <i class="bi bi-eye me-1"></i>View
                            </button>
                            <!--<button class="btn btn-sm btn-outline-secondary edit-question" data-id="${question.id}" ${!this.state.currentUser?.isAdmin ? 'disabled' : ''}>
                                <i class="bi bi-pencil me-1"></i>Edit
                            </button>-->
                            <button class="btn btn-sm btn-outline-danger delete-question" data-id="${question.id}" ${!this.state.currentUser?.isAdmin ? 'disabled' : ''}>
                                <i class="bi bi-trash me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.questionCardsContainer.appendChild(card);

            // Add animation
            setTimeout(() => {
                const questionCard = card.querySelector('.question-card');
                if (questionCard) {
                    questionCard.style.animation = 'cardEntrance 0.5s ease-out forwards';
                }
            }, 10);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const questionId = e.currentTarget.getAttribute('data-id');
                this.viewQuestionDetails(questionId);
            });
        });

        document.querySelectorAll('.edit-question').forEach(button => {
            button.addEventListener('click', (e) => {
                const questionId = e.currentTarget.getAttribute('data-id');
                this.editQuestion(questionId);
            });
        });

        document.querySelectorAll('.delete-question').forEach(button => {
            button.addEventListener('click', (e) => {
                const questionId = e.currentTarget.getAttribute('data-id');
                this.confirmDeleteQuestion(questionId);
            });
        });
    }

    // Filter questions based on search and filters
    filterQuestions() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const categoryFilter = this.categoryFilter?.value || '';
        const dateFilter = document.getElementById('dateFilter')?.value || '';
        const difficultyFilter = document.getElementById('difficultyFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        const filteredQuestions = this.state.questions.filter(question => {
            // Search term matching
            const matchesSearch = searchTerm === '' || 
                question.title.toLowerCase().includes(searchTerm) || 
                question.description.toLowerCase().includes(searchTerm) ||
                question.category.toLowerCase().includes(searchTerm);

            // Category filter
            const matchesCategory = !categoryFilter || question.category === categoryFilter;

            // Date filter (simplified for demo)
            const matchesDate = !dateFilter || this.checkDateFilter(question.createdAt, dateFilter);

            // Difficulty filter
            const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;

            // Type filter
            const matchesType = !typeFilter || question.type === typeFilter;

            // Status filter
            const matchesStatus = !statusFilter || question.status === statusFilter;

            return matchesSearch && matchesCategory && matchesDate && 
                   matchesDifficulty && matchesType && matchesStatus;
        });

        this.renderQuestionCards(filteredQuestions);
    }

    // Check if question matches date filter
    checkDateFilter(questionDate, filter) {
        const now = new Date();
        const qDate = new Date(questionDate);

        switch (filter) {
            case 'today':
                return qDate.toDateString() === now.toDateString();
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                return qDate >= weekStart;
            case 'month':
                return qDate.getMonth() === now.getMonth() && 
                       qDate.getFullYear() === now.getFullYear();
            case 'year':
                return qDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    }

    // View question details
    viewQuestionDetails(questionId) {
        const question = this.state.questions.find(q => q.id == questionId);
        if (question) {
            this.showQuestionModal(question);
        }
    }

    // Edit question
    editQuestion(questionId) {
        const question = this.state.questions.find(q => q.id == questionId);
        if (question) {
            // In a real app, this would navigate to an edit page or show an edit form
            this.showToast("Edit functionality would be implemented here", "info");
        }
    }

    // Confirm question deletion
    confirmDeleteQuestion(questionId) {
        if (confirm("Are you sure you want to delete this question?")) {
            this.deleteQuestion(questionId);
        }
    }

    // Delete question
    deleteQuestion(questionId) {
        this.state.questions = this.state.questions.filter(q => q.id != questionId);
        this.renderQuestionCards();

        this.showToast("Question deleted successfully", "success");
    }

    // Show question modal
    showQuestionModal(question) {
        const modalId = 'questionModal';

        // Remove old modal if exists
        const existingModal = document.getElementById(modalId);
        if (existingModal) existingModal.remove();

        const modalHtml = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content dark-theme">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.escapeHtml(question.title)}</h5>
                            <span class="badge bg-primary">${this.escapeHtml(question.category)}</span>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${this.escapeHtml(question.description)}</p>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <div>
                                    <small class="text-muted me-3">ID: ${question.id}</small>
                                    <small class="text-muted">Last updated: ${this.formatDate(question.updatedAt)}</small>
                                </div>
                                <a href="${this.escapeHtml(question.fileLink)}" class="btn btn-primary" target="_blank">
                                    <i class="bi bi-box-arrow-up-right me-1"></i>Open
                                </a>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-lg me-1"></i>Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();

        // Remove modal from DOM when hidden
        document.getElementById(modalId).addEventListener('hidden.bs.modal', () => {
            document.getElementById(modalId).remove();
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            className: `toast-${type}`,
            style: {
                background: "var(--bg-secondary)",
                borderLeft: `4px solid var(--${type}-color)`,
                color: "var(--text-primary)"
            }
        }).showToast();
    }

    // Helper: Format date
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Helper: Capitalize first letter
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper: Escape HTML
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Helper: Get difficulty badge class
    getDifficultyBadgeClass(difficulty) {
        switch (difficulty) {
            case 'easy': return 'bg-success';
            case 'medium': return 'bg-warning';
            case 'hard': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Helper: Get status badge class
    getStatusBadgeClass(status) {
        switch (status) {
            case 'published': return 'bg-success';
            case 'draft': return 'bg-secondary';
            case 'archived': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}

// Initialize the portal when the script loads
document.addEventListener('DOMContentLoaded', () => {
    const portal = new QuestionPortal();
});
