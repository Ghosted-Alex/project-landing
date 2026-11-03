document.addEventListener("DOMContentLoaded", () => {
    if (currentPage === "/project-landing/index.html" || currentPage === "/project-landing/" || currentPage === "/index.html" || currentPage === "/project-landing/releases.html" || currentPage === "/" || currentPage === "/releases.html"|| currentPage === "/project-landing/past.html" || currentPage === "/past.html"){
        
        // Helper functions to hide fields if value is "N/A"
        const renderValueField = (label, value) => {
            return (value && value !== "") ? `<p><strong>${label}:</strong> ${value}</p>` : "";
        };
    
        const renderCodenameField = (codename) => {
            return (codename && codename !== "") ? `<code>(${codename})</code>` : "";
        };
    
        const renderStatusField = (status, color, logo = "") => {
            if (!status) return "";
            const logoParam = logo ? `&logo=${logo}` : "";
            return `<hr class="no_limit">
            <img class="status" src="https://img.shields.io/badge/${encodeURIComponent(status)}-${color}?${logoParam}" alt="${status}">`;
        };
    
        const renderImage = (image = "", statusActive = false) => {
            if (!image) return "";
            const imgParam = image ? `&image="${image}"` : "";
            if (statusActive == false) return `<img class="inline" src=${imgParam} width="500px">`;
            if (statusActive == true) return `<img class="inline" src=${imgParam} width="500px" style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">`;
        };

        const project_json_meta = "https://gitlab.com/api/v4/projects/ghostedalex%2Fproject-data-server/repository/files/project_landing%2Fprojects.json/raw";
        
        // Caching Configuration
        const CACHE_KEY = "gitlab_projects_cache";
        const CACHE_TIME_KEY = "gitlab_projects_timestamp";
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

        // Core processing and rendering logic
        const processProjectsData = (data) => {
            console.log("Successfully loaded project data");

            // Clear out existing containers to prevent duplication when reloading from cache
            data.forEach(project => {
                if (project.tags) {
                    project.tags.forEach(tag => {
                        const targetSection = document.querySelector(tag);
                        if (targetSection) {
                            const container = targetSection.querySelector('.project-list');
                            if (container) {
                                container.innerHTML = '';
                            }
                        }
                    });
                }
            });

            const hasFutureProjects = data.some(project => 
                project.tags && project.tags.includes("#future")
            );

            const hasNewReleases = data.some(project => 
                project.tags && project.tags.includes("#new_release")
            );

            if (!hasFutureProjects) {
                const releasesElement = document.getElementById("future");
                if (releasesElement) {
                    releasesElement.innerHTML = `<br>
                    <h1><code>Get Ready for NEW PROJECTS!</code></h1>
                    <h3>Future Projects and Leaks</h3>
                    <hr class="no_limit">`;
                }
            }

            if (!hasNewReleases) {
                const releasesElement = document.getElementById("new_release");
                if (releasesElement) {
                    releasesElement.innerHTML = `<br>
                    <h1><code>Newest Releases</code></h1>
                    <hr class="no_limit">
                    <img class="status" src="https://img.shields.io/badge/There_are_no_releases_currently_at_this_moment,_please_come_back_later-red" style="width: 750px;">`;
                }
            }

            data.forEach(project => {
                const projectHTML = `
                    <div class="left flex" id="${project.id}">
                        <div class="image">
                            <img class="project_image ${project.tags} inline" src="${project.img}" width="500px">
                            ${project.status ? renderStatusField(project.status.text, project.status.color, project.status.logo) : ""}
                        </div>
                        <div class="text">
                            <div class="title">
                                <h2><code>${project.title}</code></h2>
                                ${renderCodenameField(project.codename)}
                            </div>
                            <div class="desc">
                                <h3>${project.description}</h3>
                                <br>
                                ${renderValueField("PROJECT REQUIREMENT", project.requirement)}
                                ${renderValueField("VERSION REQUIREMENT", project.version_req)}
                                <p><strong>VERSION:</strong> ${project.version}</p>
                                ${renderValueField("Last Update Release", project.discontinue)}
                                <br>
                                ${project.disabled === false ? `
                                    <a href="${project.link}">
                                        <button>${project.buttonText || "Download"}</button>
                                    </a>` : ''}
                            </div>
                        </div>
                    </div>
                    <br>
                `;

                project.tags.forEach(tag => {
                    const targetSection = document.querySelector(tag);
                    if (targetSection) {
                        let container = targetSection.querySelector('.project-list');
                        if (!container) {
                            container = document.createElement('div');
                            container.className = 'project-list';
                            targetSection.appendChild(container);
                        }
                        container.insertAdjacentHTML('beforeend', projectHTML);
                    }
                });
            });
        };

        // Fetch wrapper with cache check and fallback
        const loadProjects = (forceRefresh = false) => {
            return new Promise((resolve, reject) => {
                const cachedData = localStorage.getItem(CACHE_KEY);
                const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
                const now = new Date().getTime();

                if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION) && !forceRefresh) {
                    console.log("Loading projects from localStorage cache.");
                    processProjectsData(JSON.parse(cachedData));
                    resolve("cache");
                    return;
                }

                console.log("Fetching fresh data from GitLab...");
                fetch(project_json_meta, {
                    method: "GET",
                    mode: "cors",
                })
                  .then(response => {
                      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                      return response.json();
                  })
                  .then(data => {
                      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                      localStorage.setItem(CACHE_TIME_KEY, new Date().getTime());
                      processProjectsData(data);
                      resolve("success");
                  })
                  .catch(err => {
                      console.error("Error loading project data from GitLab, falling back to cache:", err);
                      if (cachedData) {
                          processProjectsData(JSON.parse(cachedData));
                      }
                      reject(err);
                  });
            });
        };

        // Initialize execution
        loadProjects(false);

        // Wire up the manual refresh button
        const refreshButton = document.getElementById("refresh-projects-btn");
        const refreshStatus = document.getElementById("refresh-projects-status");
        
        if (refreshButton) {
            refreshButton.addEventListener("click", () => {
                refreshButton.textContent = "Refreshing...";
                refreshButton.disabled = true;
                
                if (refreshStatus) {
                    refreshStatus.innerText = "Refreshing Projects...";
                    refreshStatus.className = "";
                }

                loadProjects(true)
                    .then(() => {
                        // Success block
                        refreshButton.textContent = "Refresh Projects";
                        refreshButton.disabled = false;
                        
                        if (refreshStatus) {
                            refreshStatus.innerText = "Projects updated successfully!";
                            refreshStatus.className = "color green";
                        }
                    })
                    .catch(() => {
                        // Error / Rate-limit block
                        refreshButton.textContent = "Refresh Projects";
                        refreshButton.disabled = false;
                        
                        if (refreshStatus) {
                            refreshStatus.innerText = "Failed to fetch from GitLab (Using cached version).";
                            refreshStatus.className = "color red"; // or whatever your error class is
                        }
                    });
            });
        }
    }
});