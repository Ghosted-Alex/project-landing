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

    if (currentPage === "/project-landing/update.html" || currentPage === "/update.html")
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

});