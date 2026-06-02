// VARUABLES
const version = "1.5.1"

const currentPage = window.location.pathname;

console.log(`Currently on Page: ${currentPage}`)

// VERSION LOGIC
document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the single element
    const ver_str = document.getElementById("version");
    // 2. Get the collection of elements
    const ver_str_labels = document.getElementsByClassName("version_label");

    // 3. Check for the ID element before assigning
    if (ver_str) {
        ver_str.innerText = version;
    }

    // 4. Loop through the collection if it exists
    if (ver_str_labels.length > 0) {
        for (let label of ver_str_labels) {
            label.innerText = version;
        }
    }
});

// IFRAME LOGIC
document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById('footer-iframe');

    const resizeIframe = () => {
        if (iframe && iframe.contentWindow) {
            try {
                // Get the scroll height of the document inside the iframe
                const newHeight = iframe.contentWindow.document.body.scrollHeight + 'px';
                iframe.style.height = newHeight;
            } catch (e) {
                console.error("Cannot resize iframe due to cross-origin policy:", e);
            }
        }
    };

    if (iframe) {
        // 1. Resize when the iframe finishes loading
        iframe.addEventListener('load', resizeIframe);
        
        // 2. Resize when the window is resized
        window.addEventListener('resize', resizeIframe);
        
        // 3. (Important) Initial call in case the iframe is cached
        if (iframe.contentDocument?.readyState === 'complete') {
            resizeIframe();
        }
    }
});

// PROJECTS.JSON LOGIC
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
    
        fetch('assets/data/projects.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                console.log(project)

                // 1. Check if AT LEAST ONE project has the "#future" tag safely
                const hasFutureProjects = data.some(project => 
                    project.tags && project.tags.includes("#future")
                );

                // 2. If no future projects exist, hide the category element
                if (!hasFutureProjects) {
                    const futureElement = document.getElementById("future");
                    // Change this line:
                    const futureAjacent = document.getElementsByClassName("future_ajacent")[0]; // Select the first element
                    
                    if (futureElement) {
                        futureElement.style.display = "none";
                    }
                    
                    // Check if the element exists before accessing style
                    if (futureAjacent) {
                        futureAjacent.style.display = "none";
                    }
                }

                // Using the helper functions to build the description block
                const projectHTML = `
                    <div class="left flex" id="${project.id}">
                        <div class="image">
                            <img class="inline" src="${project.img}" width="500px">
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