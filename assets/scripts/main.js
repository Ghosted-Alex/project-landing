document.addEventListener("DOMContentLoaded", () => {
    // Helper functions to hide fields if value is "N/A"
    const renderValueField = (label, value) => {
        return (value && value !== "") ? `<p><strong>${label}:</strong> ${value}</p>` : "";
    };

    const renderCodenameField = (codename) => {
        return (codename && codename !== "") ? `<p>(${codename})</p>` : "";
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
                    }
                });
            });
        })
        .catch(err => console.error("Error loading project data:", err));
});