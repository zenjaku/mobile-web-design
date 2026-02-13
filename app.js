const tabTriggers = document.querySelectorAll(".tab-trigger");
const panels = document.querySelectorAll(".panel");
const pageTitle = document.getElementById("pageTitle");
const app = document.getElementById("app");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const modal = document.getElementById("scanModal");
const scanTitle = document.getElementById("scanTitle");
const scanMessage = document.getElementById("scanMessage");
const cancelScan = document.getElementById("cancelScan");
const completeScan = document.getElementById("completeScan");
const scanButtons = document.querySelectorAll("[data-scan]");
const fabAction = document.getElementById("fabAction");

const tabTitles = {
  hris: "HRIS",
  payroll: "Payroll",
  employees: "Employees",
  documents: "Document Routing",
  time: "Time In/Out",
};

const completeLabelDefault = completeScan.textContent;
let modalMode = "scan";

const setActiveTab = (target) => {
  tabTriggers.forEach((trigger) => {
    trigger.classList.toggle("active", trigger.dataset.tab === target);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${target}`);
  });
  pageTitle.textContent = tabTitles[target] || "Intranet";
  app.classList.remove("nav-open");
};

tabTriggers.forEach((item) => {
  item.addEventListener("click", () => {
    const target = item.dataset.tab;
    setActiveTab(target);
  });
});

menuToggle.addEventListener("click", () => {
  app.classList.toggle("nav-open");
});

document.addEventListener("click", (event) => {
  if (!app.classList.contains("nav-open")) {
    return;
  }
  const clickedInsideSidebar = sidebar.contains(event.target);
  const clickedMenuToggle = menuToggle.contains(event.target);
  if (!clickedInsideSidebar && !clickedMenuToggle) {
    app.classList.remove("nav-open");
  }
});

scanButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.dataset.scan;
    modalMode = "scan";
    scanTitle.textContent = label;
    scanMessage.textContent = "Hold still while the system verifies your identity.";
    completeScan.textContent = completeLabelDefault;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  });
});

const closeModal = () => {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  completeScan.textContent = completeLabelDefault;
};

cancelScan.addEventListener("click", closeModal);

completeScan.addEventListener("click", () => {
  if (modalMode === "request") {
    scanMessage.textContent = "Request started. Complete the form in the next step.";
  } else {
    scanMessage.textContent = "Verified. Attendance updated.";
  }
  setTimeout(closeModal, 900);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

if (fabAction) {
  fabAction.addEventListener("click", () => {
    modalMode = "request";
    scanTitle.textContent = "New Request";
    scanMessage.textContent = "Choose a request type to continue.";
    completeScan.textContent = "Continue";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  });
}
