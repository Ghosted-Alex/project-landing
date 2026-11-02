// This is the footer logic, iframe is used to display the footer and the logic here stablizes the iframe height/width and content inside
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

// Inside your parent page resize script, add a minimum height or buffer when hovered
// const resizeIframe = () => {
//     const iframe = document.getElementById('navbar-iframe');

//     if (iframe && iframe.contentWindow) {
//         try {
//             const doc = iframe.contentWindow.document;
//             let baseHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
            
//             // Check if the dropdown is open (e.g., if you have an active class or hover state)
//             const dropdown = doc.querySelector('.dropdown-content');
//             if (dropdown && window.getComputedStyle(dropdown).display !== 'none') {
//                 baseHeight += 500; // Add enough buffer space for the dropdown items
//             }

//             iframe.style.height = baseHeight + 'px';
//         } catch (e) {
//             console.error("Cannot resize navbar iframe:", e);
//         }
//     }
// };