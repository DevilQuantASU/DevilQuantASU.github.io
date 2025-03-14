document.addEventListener("DOMContentLoaded", async function () {
  const projectListContainer = document.getElementById("project-list");

  try {
        // Fetch projects from lambda & dynamo
        const response = await fetch("https://niiy5egpuc4p2dcnmcpulfj3ua0eblai.lambda-url.us-east-1.on.aws?is_project=true");
        if (!response.ok) {
            throw new Error("Failed to fetch projects");
        }

        const projects = await response.json();

        projectListContainer.innerHTML = "";

        // Loop through projects and create HTML elements
        projects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project");

            projectElement.innerHTML = `
                <h3>
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer">
                        ${project.project_name}
                    </a>
                </h3>
                <p>${project.text}</p>
            `;

            projectListContainer.appendChild(projectElement);
        });

    } catch (error) {
        console.error("Error loading projects:", error);
        projectListContainer.innerHTML = "<p>Failed to load projects.</p>";
    }
});
