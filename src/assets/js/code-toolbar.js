document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((pre) => {
    // Check for ascii-art language
    const codeTag = pre.querySelector("code");
    let language = "Code";
    let isAsciiArt = false;
    if (codeTag) {
      codeTag.classList.forEach((cls) => {
        if (cls.startsWith("language-")) {
          language = cls.replace("language-", "");
          if (language === "ascii-art") {
            isAsciiArt = true;
          }
        }
      });
    }

    // ASCII art: simple wrapper without header
    if (isAsciiArt) {
      const wrapper = document.createElement("div");
      wrapper.className = "ascii-art-wrapper";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      return;
    }

    // 1. Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";

    // 2. Header
    const header = document.createElement("div");
    header.className = "code-header";

    // 3. Language Label (e.g., "JavaScript")
    const langSpan = document.createElement("span");
    langSpan.className = "code-lang";
    langSpan.innerText = language.charAt(0).toUpperCase() + language.slice(1); // Capitalize

    // 4. Buttons Container
    const actions = document.createElement("div");
    actions.className = "code-actions";

    // --- ICONS (SVG Paths) ---
    const iconDownload = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
    const iconCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    const iconCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ffa7b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const iconCollapse = `<svg class="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    const iconExpand = `<svg class="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    // --- BUTTON: DOWNLOAD ---
    const btnDownload = document.createElement("button");
    btnDownload.innerHTML = iconDownload;
    btnDownload.title = "Download";
    btnDownload.addEventListener("click", () => {
      const text = pre.innerText;
      const blob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snippet.${language === "Code" ? "txt" : language}`; // filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });

    // --- BUTTON: COPY ---
    const btnCopy = document.createElement("button");
    btnCopy.innerHTML = iconCopy;
    btnCopy.title = "Copy Code";
    btnCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btnCopy.innerHTML = iconCheck; // Feedback
        setTimeout(() => (btnCopy.innerHTML = iconCopy), 2000); // Reset
      } catch (err) {
        console.error("Failed to copy!", err);
      }
    });

    // --- BUTTON: COLLAPSE ---
    const btnCollapse = document.createElement("button");
    btnCollapse.innerHTML = iconCollapse;
    btnCollapse.title = "Collapse";
    let isCollapsed = false;

    btnCollapse.addEventListener("click", () => {
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
        pre.style.display = "none";
        btnCollapse.innerHTML = iconExpand;
        wrapper.classList.add("collapsed");
      } else {
        pre.style.display = "block";
        btnCollapse.innerHTML = iconCollapse;
        wrapper.classList.remove("collapsed");
      }
    });

    // Assemble
    actions.appendChild(btnDownload);
    actions.appendChild(btnCopy);
    actions.appendChild(btnCollapse);

    header.appendChild(langSpan);
    header.appendChild(actions);

    // DOM Manipulation
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(header);
    wrapper.appendChild(pre);
  });
});