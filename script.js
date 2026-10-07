const portfolio = {
    student: {
        name: "Yash",
        usn: "CS25061",
        role: "B.Tech CSE Student · S.B. Jain Institute of Technology, Management & Research, Nagpur",
        bio: "Computer Science student who enjoys building web apps, experimenting with UI design and organising tech events."
    },

    projects: [
        {
            title: "Lunareth",
            category: "Web App",
            tech: ["React", "Vite", "Tailwind", "Supabase"],
            description: "Digital letter-sharing platform with an animated envelope opening and a cinematic reading experience.",
            link: "https://lunareth-letters.vercel.app/",   
            year: 2026
        },
        {
            title: "CircuitPath",
            category: "Education",
            tech: ["HTML", "Tailwind", "JavaScript"],
            description: "Computer-literacy course website designed for middle-school students.",
            link: "https://dark-ff.github.io/TechSiksha/",
            year: 2026
        },
        {
            title: "LUNARC 2.0 Hackathon Portal",
            category: "Event",
            tech: ["HTML", "Tailwind", "JavaScript"],
            description: "Event page for an Agentic AI Chatbot hackathon organised at college.",
            link: "https://lunarc-2-0.vercel.app/",
            year: 2026
        },
        {
            title: "Student Registration Form",
            category: "Practical",
            tech: ["HTML", "Tailwind", "JavaScript"],
            description: "Form with client-side validation for mandatory fields, email, password and mobile number.",
            link: "#",
            year: 2026
        }
    ],

    certifications: [
        { title: "Web Fundamentals & Basic Frontend Design", issuer: "SBJITMR (MDM Course)", date: "2026", icon: "🌐", link: "#" },
        { title: "Certificate Name 2", issuer: "Issuing Organisation", date: "2026", icon: "📜", link: "#" },
        { title: "Certificate Name 3", issuer: "Issuing Organisation", date: "2025", icon: "🏅", link: "#" }
    ],

    skills: [
        { name: "HTML5",        level: 90, group: "Frontend" },
        { name: "CSS3",         level: 85, group: "Frontend" },
        { name: "Tailwind CSS", level: 85, group: "Frontend" },
        { name: "JavaScript",   level: 80, group: "Frontend" },
        { name: "React",        level: 70, group: "Frameworks" },
        { name: "Vite",         level: 65, group: "Tools" },
        { name: "Supabase",     level: 60, group: "Backend" },
        { name: "Git & GitHub", level: 75, group: "Tools" },
        { name: "Public Speaking", level: 80, group: "Soft Skills" }
    ]
};

const $ = (id) => document.getElementById(id);
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const tabs = [
    { id: "projects",       label: "🚀 Projects",       render: renderProjects },
    { id: "certifications", label: "🎓 Certifications", render: renderCerts },
    { id: "skills",         label: "🛠️ Skills",         render: renderSkills }
];

let activeTab = "projects";
let projectSearch = "";
let projectTech = "All";

function renderHeader() {
    const s = portfolio.student;
    $("studentName").textContent = s.name;
    $("studentRole").textContent = s.role;
    $("studentBio").textContent = s.bio;
    $("avatar").textContent = s.name.trim().charAt(0).toUpperCase();
    $("statProjects").textContent = portfolio.projects.length;
    $("statCerts").textContent = portfolio.certifications.length;
    $("statSkills").textContent = portfolio.skills.length;
    $("footerText").textContent = `© ${new Date().getFullYear()} ${s.name} (${s.usn}) · Web Fundamentals & Basic Frontend Design · TAE-1`;
}


function renderTabButtons() {
    $("tabList").innerHTML = tabs.map(t => `
        <button role="tab" id="tab-${t.id}" data-tab="${t.id}"
                aria-selected="${t.id === activeTab}"
                class="px-4 py-2 whitespace-nowrap font-medium border-b-2 -mb-px transition
                       ${t.id === activeTab
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-indigo-600 dark:text-slate-400'}">
            ${t.label}
        </button>`).join("");
}

function switchTab(id) {
    activeTab = id;
    try { localStorage.setItem("portfolioTab", id); } catch (e) {}
    history.replaceState(null, "", "#" + id);
    renderTabButtons();
    const panel = $("tabPanel");
    panel.setAttribute("aria-labelledby", "tab-" + id);
    panel.classList.remove("tab-panel");
    void panel.offsetWidth;                 // restart animation
    panel.classList.add("tab-panel");
    tabs.find(t => t.id === id).render();
}

function renderProjects() {
    const allTech = ["All", ...new Set(portfolio.projects.flatMap(p => p.tech))];

    $("tabPanel").innerHTML = `
        <div class="flex flex-col sm:flex-row gap-3 mb-5">
            <input id="projectSearch" type="search" placeholder="Search projects…" value="${escapeHTML(projectSearch)}"
                   class="flex-1 border rounded p-2 bg-white dark:bg-slate-800 dark:border-slate-600">
            <div id="techFilters" class="flex flex-wrap gap-2">
                ${allTech.map(t => `
                    <button data-tech="${escapeHTML(t)}"
                        class="px-3 py-1 rounded-full text-sm border transition
                        ${t === projectTech
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-800 dark:border-slate-600 hover:border-indigo-500'}">
                        ${escapeHTML(t)}
                    </button>`).join("")}
            </div>
        </div>
        <div id="projectGrid" class="grid gap-4 sm:grid-cols-2"></div>`;

    drawProjectCards();

    $("projectSearch").addEventListener("input", (e) => {
        projectSearch = e.target.value;
        drawProjectCards();
    });
    $("techFilters").addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-tech]");
        if (!btn) return;
        projectTech = btn.dataset.tech;
        renderProjects();
    });
}

function drawProjectCards() {
    const q = projectSearch.trim().toLowerCase();
    const list = portfolio.projects.filter(p =>
        (projectTech === "All" || p.tech.includes(projectTech)) &&
        (p.title + p.description + p.category + p.tech.join(" ")).toLowerCase().includes(q)
    );

    $("projectGrid").innerHTML = list.length ? list.map(p => `
        <article class="bg-white dark:bg-slate-800 rounded-lg shadow p-5 hover:shadow-lg transition flex flex-col">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold">${escapeHTML(p.title)}</h3>
                <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">${escapeHTML(p.category)}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-slate-300 flex-1">${escapeHTML(p.description)}</p>
            <div class="flex flex-wrap gap-1 mt-3">
                ${p.tech.map(t => `<span class="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-0.5 rounded">${escapeHTML(t)}</span>`).join("")}
            </div>
            <div class="flex justify-between items-center mt-4 text-sm">
                <span class="text-gray-400">${p.year}</span>
                <a href="${escapeHTML(p.link)}" target="_blank" rel="noopener"
                   class="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View project →</a>
            </div>
        </article>`).join("")
        : `<p class="col-span-full text-center text-gray-500 py-10">No projects match your search.</p>`;
}

function renderCerts() {
    $("tabPanel").innerHTML = `
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${portfolio.certifications.map(c => `
                <article class="bg-white dark:bg-slate-800 rounded-lg shadow p-5 text-center hover:shadow-lg transition">
                    <div class="text-4xl mb-2">${c.icon}</div>
                    <h3 class="font-bold">${escapeHTML(c.title)}</h3>
                    <p class="text-sm text-gray-600 dark:text-slate-300 mt-1">${escapeHTML(c.issuer)}</p>
                    <p class="text-xs text-gray-400 mt-1">${escapeHTML(c.date)}</p>
                    <a href="${escapeHTML(c.link)}" target="_blank" rel="noopener"
                       class="inline-block mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View certificate</a>
                </article>`).join("")}
        </div>`;
}

function renderSkills() {
    const groups = {};
    portfolio.skills.forEach(s => (groups[s.group] ||= []).push(s));

    $("tabPanel").innerHTML = `
        <div class="grid gap-5 md:grid-cols-2">
            ${Object.entries(groups).map(([group, items]) => `
                <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
                    <h3 class="font-bold mb-3">${escapeHTML(group)}</h3>
                    ${items.map(s => `
                        <div class="mb-3">
                            <div class="flex justify-between text-sm mb-1">
                                <span>${escapeHTML(s.name)}</span><span>${s.level}%</span>
                            </div>
                            <div class="h-2 bg-gray-200 dark:bg-slate-700 rounded">
                                <div class="bar-fill h-2 rounded bg-indigo-600" style="width:0" data-width="${s.level}"></div>
                            </div>
                        </div>`).join("")}
                </div>`).join("")}
        </div>`;

    requestAnimationFrame(() => requestAnimationFrame(() => {
        document.querySelectorAll(".bar-fill").forEach(b => b.style.width = b.dataset.width + "%");
    }));
}

function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    $("themeToggle").textContent = dark ? "☀️ Light" : "🌙 Dark";
    try { localStorage.setItem("portfolioDark", dark ? "1" : "0"); } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();

    $("tabList").addEventListener("click", (e) => {
        const b = e.target.closest("button[data-tab]");
        if (b) switchTab(b.dataset.tab);
    });
    $("tabList").addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const i = tabs.findIndex(t => t.id === activeTab);
        const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        switchTab(next.id);
        $("tab-" + next.id).focus();
    });

    $("themeToggle").addEventListener("click", () =>
        applyTheme(!document.documentElement.classList.contains("dark")));

    let dark = false, saved = null;
    try { dark = localStorage.getItem("portfolioDark") === "1"; saved = localStorage.getItem("portfolioTab"); } catch (e) {}
    applyTheme(dark);

    const fromHash = location.hash.replace("#", "");
    const start = [fromHash, saved].find(id => tabs.some(t => t.id === id)) || "projects";
    switchTab(start);
});
