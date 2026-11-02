document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/navigation.json") // Path to your json file
        .then(response => response.json())
        .then(data => {
            const navLeft = document.querySelector('.nav-left');
            const navRight = document.querySelector('.nav-right');
            
            // Get current filename for active state matching
            const currentPath = window.location.pathname.split("/").pop() || "index.html";

            data.forEach(item => {
                const li = document.createElement('li');

                if (item.dropdown) {
                    // Build Dropdown structure
                    const dropdownDiv = document.createElement('div');
                    dropdownDiv.className = 'dropdown';

                    const button = document.createElement('button');
                    button.className = 'dropbtn';
                    button.textContent = item.text;
                    dropdownDiv.appendChild(button);

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'dropdown-content';

                    item.dropdown.forEach(subItem => {
                        const a = document.createElement('a');
                        a.href = subItem.url;
                        a.className = 'clean-link';
                        
                        const span = document.createElement('span');
                        span.textContent = subItem.text;
                        a.appendChild(span);
                        contentDiv.appendChild(a);
                    });

                    // Optional depth effect if you use it in your CSS
                    const depthEffect = document.createElement('div');
                    depthEffect.className = 'depth-effect';
                    depthEffect.innerHTML = '<br>';
                    contentDiv.appendChild(depthEffect);

                    dropdownDiv.appendChild(contentDiv);
                    li.appendChild(dropdownDiv);
                } else {
                    // Build Standard Link
                    const a = document.createElement('a');
                    a.href = item.url;

                    // Check if this link matches the current page to set active
                    const hrefFile = item.url.split("#")[0];
                    if (hrefFile === currentPath) {
                        a.id = "active";
                    }

                    const span = document.createElement('span');
                    span.textContent = item.text;
                    a.appendChild(span);
                    li.appendChild(a);
                }

                // Append to correct side
                if (item.align === 'right' && navRight) {
                    navRight.appendChild(li);
                } else if (navLeft) {
                    navLeft.appendChild(li);
                }
            });
        })
        .catch(error => console.error('Error loading navigation:', error));
});