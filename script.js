document.addEventListener("DOMContentLoaded", function () {
  // Global variables
  const configureModal = document.getElementById("configureModal");
  const configureButtons = document.querySelectorAll(".btn-configure");
  let currentType = "";
  let currentKeywordContainer = null;

  // Keyword functionality
  const optInKeywordInput = document.getElementById("opt-in-keyword-input");
  const optOutKeywordInput = document.getElementById("opt-out-keyword-input");
  const optInKeywordsContainer = document.getElementById(
    "opt-in-keywords-container"
  );
  const optOutKeywordsContainer = document.getElementById(
    "opt-out-keywords-container"
  );

  // Initialize UI with empty keyword containers
  initializeKeywordsContainers();

  function initializeKeywordsContainers() {
    // Clear existing placeholder keywords
    optInKeywordsContainer.innerHTML = "";
    optOutKeywordsContainer.innerHTML = "";

    // Create first row for opt-in keywords
    let optInRow1 = document.createElement("div");
    optInRow1.className = "keyword-row";
    optInKeywordsContainer.appendChild(optInRow1);

    // Create second row for opt-in keywords
    let optInRow2 = document.createElement("div");
    optInRow2.className = "keyword-row";
    optInKeywordsContainer.appendChild(optInRow2);

    // Add keywords to opt-in container
    addKeyword("Yes", optInRow1);
    addKeyword("Subscribe", optInRow1);
    addKeyword("Start", optInRow1);
    addKeyword("Begin", optInRow1);

    addKeyword("Opt-in", optInRow2);
    addKeyword("Join", optInRow2);
    addKeyword("Enable", optInRow2);

    // Create first row for opt-out keywords
    let optOutRow1 = document.createElement("div");
    optOutRow1.className = "keyword-row";
    optOutKeywordsContainer.appendChild(optOutRow1);

    // Create second row for opt-out keywords
    let optOutRow2 = document.createElement("div");
    optOutRow2.className = "keyword-row";
    optOutKeywordsContainer.appendChild(optOutRow2);

    // Add keywords to opt-out container
    addKeyword("No", optOutRow1);
    addKeyword("Unsubscribe", optOutRow1);
    addKeyword("Stop", optOutRow1);
    addKeyword("End", optOutRow1);

    addKeyword("Opt-out", optOutRow2);
    addKeyword("Leave", optOutRow2);
    addKeyword("Disable", optOutRow2);
  }

  // Event listener for adding a new keyword when pressing Enter
  optInKeywordInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim() !== "") {
      const keywordValue = this.value.trim();
      // Get the last row or create a new one if needed
      let lastRow = optInKeywordsContainer.querySelector(
        ".keyword-row:last-child"
      );
      // Check if we need a new row (if current row has 4+ keywords)
      const keywordCount = lastRow.querySelectorAll(".keyword").length;
      if (keywordCount >= 4) {
        lastRow = document.createElement("div");
        lastRow.className = "keyword-row";
        optInKeywordsContainer.appendChild(lastRow);
      }

      addKeyword(keywordValue, lastRow);
      this.value = "";
    }
  });

  optOutKeywordInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim() !== "") {
      const keywordValue = this.value.trim();
      // Get the last row or create a new one if needed
      let lastRow = optOutKeywordsContainer.querySelector(
        ".keyword-row:last-child"
      );
      // Check if we need a new row (if current row has 4+ keywords)
      const keywordCount = lastRow.querySelectorAll(".keyword").length;
      if (keywordCount >= 4) {
        lastRow = document.createElement("div");
        lastRow.className = "keyword-row";
        optOutKeywordsContainer.appendChild(lastRow);
      }

      addKeyword(keywordValue, lastRow);
      this.value = "";
    }
  });

  // Function to add a new keyword
  function addKeyword(text, container) {
    const keywordElement = document.createElement("span");
    keywordElement.className = "keyword";
    keywordElement.innerHTML = `${text} <i class="fas fa-times"></i>`;

    // Add click event to remove the keyword
    const removeIcon = keywordElement.querySelector("i");
    removeIcon.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event delegation issues
      const row = keywordElement.parentElement;
      keywordElement.remove();

      // If the row is now empty and it's not the last row, remove it
      if (row.children.length === 0 && row.nextElementSibling) {
        row.remove();
      }

      // If the row is empty and it's the last row, keep it for new keywords
    });

    container.appendChild(keywordElement);
  }

  // Event delegation for removing keywords
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("fa-times") &&
      e.target.parentElement.classList.contains("keyword")
    ) {
      const keywordElement = e.target.parentElement;
      const row = keywordElement.parentElement;
      keywordElement.remove();

      // If the row is now empty and it's not the last row, remove it
      if (row.children.length === 0 && row.nextElementSibling) {
        row.remove();
      }
    }
  });

  // Configure button handlers
  configureButtons.forEach((button) => {
    button.addEventListener("click", function () {
      currentType = this.getAttribute("data-type");
      openConfigureModal(currentType);
    });
  });

  // Function to open the configure modal with the appropriate type (opt-in or opt-out)
  function openConfigureModal(type) {
    // Update modal title based on the type
    const modalTitle = document.querySelector(".modal-header h1");
    modalTitle.textContent = `CONFIGURE ${type.toUpperCase()} RESPONSE`;

    // Show the modal
    configureModal.classList.add("active");
    document.body.classList.add("modal-open");

    // Get modal elements
    const closeModalBtn = document.getElementById("closeModal");
    const cancelModalBtn = document.getElementById("cancelModal");
    const saveModalBtn = document.getElementById("saveModal");

    // Add event listeners for the modal
    closeModalBtn.addEventListener("click", closeModal);
    cancelModalBtn.addEventListener("click", closeModal);
    saveModalBtn.addEventListener("click", saveModalSettings);

    // Add event listeners for content type selection
    const contentTypeRadios = document.querySelectorAll(
      'input[name="contentType"]'
    );
    contentTypeRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        updateContentTypeDisplay(this.value);
      });
    });

    // Add listeners for character count
    const textareas = document.querySelectorAll(".form-textarea");
    textareas.forEach((textarea) => {
      textarea.addEventListener("input", updateCharCount);
      // Initialize char count
      updateCharCount.call(textarea);
    });

    // Add event listeners for formatting controls
    const formatButtons = document.querySelectorAll(".format-btn");
    formatButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        formatText(this.title.toLowerCase());
      });
    });

    // Initialize the preview based on the selected content type
    const selectedContentType = document.querySelector(
      'input[name="contentType"]:checked'
    ).value;
    updateContentTypeDisplay(selectedContentType);
  }

  // Function to update character count for textareas
  function updateCharCount() {
    const count = this.value.length;
    const countDisplay = this.closest(".textarea-container").querySelector(
      ".char-count"
    );
    countDisplay.textContent = `${count}/4096`;
  }

  // Function to show/hide content type sections based on selection
  function updateContentTypeDisplay(type) {
    const textSection = document.getElementById("textContentTypeSection");
    const imageSection = document.getElementById("imageContentTypeSection");
    const videoSection = document.getElementById("videoContentTypeSection");
    const documentSection = document.getElementById(
      "documentContentTypeSection"
    );

    // Hide all sections
    textSection.classList.add("hidden");
    imageSection.classList.add("hidden");
    videoSection.classList.add("hidden");
    documentSection.classList.add("hidden");

    // Show selected section
    if (type === "text") {
      textSection.classList.remove("hidden");
    } else if (type === "image") {
      imageSection.classList.remove("hidden");
    } else if (type === "video") {
      videoSection.classList.remove("hidden");
    } else if (type === "document") {
      documentSection.classList.remove("hidden");
    }

    // Update preview based on content type - show the corresponding preview
    updatePreviewVisibility(type);
  }

  // Function to update preview visibility based on content type
  function updatePreviewVisibility(type) {
    // Get all preview containers
    const textPreview = document.getElementById("textPreview");
    const imagePreview = document.getElementById("imagePreview");
    const videoPreview = document.getElementById("videoPreview");
    const documentPreview = document.getElementById("documentPreview");

    // Hide all previews
    textPreview.classList.add("hidden");
    imagePreview.classList.add("hidden");
    videoPreview.classList.add("hidden");
    documentPreview.classList.add("hidden");

    // Show selected preview
    if (type === "text") {
      textPreview.classList.remove("hidden");
    } else if (type === "image") {
      imagePreview.classList.remove("hidden");
    } else if (type === "video") {
      videoPreview.classList.remove("hidden");
    } else if (type === "document") {
      documentPreview.classList.remove("hidden");
    }
  }

  // Function to apply text formatting
  function formatText(format) {
    const activeTextarea = document.querySelector(
      ".form-textarea:not([disabled])"
    );
    if (!activeTextarea) return;

    const start = activeTextarea.selectionStart;
    const end = activeTextarea.selectionEnd;
    const selectedText = activeTextarea.value.substring(start, end);
    let formattedText = selectedText;

    switch (format) {
      case "bold":
        formattedText = `*${selectedText}*`;
        break;
      case "italic":
        formattedText = `_${selectedText}_`;
        break;
      case "underline":
        formattedText = `~${selectedText}~`;
        break;
      // Emoji would typically open an emoji picker
      case "emoji":
        // For simplicity, we'll just insert a smiley
        formattedText = selectedText + " 😊";
        break;
    }

    // Replace the selected text with the formatted text
    if (selectedText) {
      activeTextarea.value =
        activeTextarea.value.substring(0, start) +
        formattedText +
        activeTextarea.value.substring(end);

      // Update the character count
      updateCharCount.call(activeTextarea);
    }
  }

  // Function to close the modal
  function closeModal() {
    configureModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  // Function to save the modal settings
  function saveModalSettings() {
    const messageType = document.querySelector(
      'input[name="messageType"]:checked'
    ).value;
    const contentType = document.querySelector(
      'input[name="contentType"]:checked'
    ).value;

    // Close the modal
    closeModal();
  }

  // Add event listeners for the plus icons in keyword inputs
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("fa-plus")) {
      const input = e.target.nextElementSibling;
      if (input && input.value.trim() !== "") {
        if (input.id === "opt-in-keyword-input") {
          // Get the last row or create a new one if needed
          let lastRow = optInKeywordsContainer.querySelector(
            ".keyword-row:last-child"
          );
          // Check if we need a new row (if current row has 4+ keywords)
          const keywordCount = lastRow.querySelectorAll(".keyword").length;
          if (keywordCount >= 4) {
            lastRow = document.createElement("div");
            lastRow.className = "keyword-row";
            optInKeywordsContainer.appendChild(lastRow);
          }
          addKeyword(input.value.trim(), lastRow);
        } else if (input.id === "opt-out-keyword-input") {
          // Get the last row or create a new one if needed
          let lastRow = optOutKeywordsContainer.querySelector(
            ".keyword-row:last-child"
          );
          // Check if we need a new row (if current row has 4+ keywords)
          const keywordCount = lastRow.querySelectorAll(".keyword").length;
          if (keywordCount >= 4) {
            lastRow = document.createElement("div");
            lastRow.className = "keyword-row";
            optOutKeywordsContainer.appendChild(lastRow);
          }
          addKeyword(input.value.trim(), lastRow);
        }
        input.value = "";
      }
    }
  });
});
