document.addEventListener("DOMContentLoaded", function() {
    // Select all the anchor tags inside the sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');

    // Attach click event listeners to each link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior (no page reload)

            // Handle routing based on the clicked link's text or href
            const target = link.textContent.trim().toLowerCase();

            switch(target) {
                case 'home':
                    window.location.href = '/';  // Assuming home page is '/'
                    break;
                case 'upload notes':
                    window.location.href = '/upload';  // Update the path as needed
                    break;
                case 'sectioning settings':
                    window.location.href = '/settings/sectioning';  // Update the path as needed
                    break;
                case 'quiz settings':
                    window.location.href = '/settings/quiz';  // Update the path as needed
                    break;
                case 'history':
                    window.location.href = '/history';  // Assuming history page is '/history'
                    break;
                default:
                    console.error('Unknown link clicked');
                    break;
            }
        });
    });

    // Optional: Toggle sidebar visibility (just in case)
    const toggleButton = document.getElementById('toggle-sidebar');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
});
