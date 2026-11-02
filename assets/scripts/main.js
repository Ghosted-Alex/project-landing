// VARUABLES
const version = "1.7"
const update = "MAJOR"

const currentPage = window.location.pathname;

console.log(`Currently on Page: ${currentPage}`)

// VERSION LOGIC
document.addEventListener("DOMContentLoaded", () => {

    const ver_str = document.querySelectorAll(".version");
    const upd_str = document.getElementById("update")

    if (ver_str) {
        ver_str.forEach(element => {
            element.textContent = version;
        });
    }

    upd_str.innerText = update

    if (currentPage === "/project-landing/update.html" || currentPage === "/update.html"){
        if (ver_str_labels.length > 0) {
            for (let label of ver_str_labels) {
                label.innerText = version;
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (currentPage === "/project-landing/index.html" || currentPage === "/project-landing/" || currentPage === "/index.html" || currentPage === "/"){
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

            console.log(imgParam)

            if (statusActive == false) return `<img class="inline" src=${imgParam} width="500px">`
            if (statusActive == true) return `<img class="inline" src=${imgParam} width="500px" style="border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">`
        };

        fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                console.log(project)

                const hasFutureProjects = data.some(project => 
                    project.tags && project.tags.includes("#future")
                );

                if (!hasFutureProjects) {
                    const futureElement = document.getElementById("future");
                    const futureAjacent = document.getElementsByClassName("future_ajacent")[0];
                    
                    if (futureElement) {
                        futureElement.innerHTML = `<br>
                        <h1><code>Get Ready for NEW PROJECTS!</code></h1>
                        <h3>Future Projects and Leaks</h3>
                        <hr class="no_limit">
                        <img class="status" src="https://img.shields.io/badge/There_are_no_future_projects_and_leaks_currently,_please_come_back_later-red" style="width: 750px;">`;
                    }
                    
                    // if (futureAjacent) {
                    //     futureAjacent.style.display = "none";
                    // }
                }

                // Using the helper functions to build the description block
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
                                <a href="${project.link}">
                                    <button>${project.buttonText || "Download"}</button>
                                </a>
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
                        console.log(`Successfully loaded Project: ${project.title} (pl.${project.id})`)
                    }
                });
            });
        })
        .catch(err => console.error("Error loading project data:", err));
    }
});