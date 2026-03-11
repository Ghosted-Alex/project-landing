document.querySelectorAll(".clean-link").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault(); // Prevents the #section from being added to the URL

        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
            behavior: "smooth", // Optional: adds a smooth scrolling effect
            });
        }
    });
});
