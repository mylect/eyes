(function () {
  const config = window.MYLECT_CONFIG || {};
  const openButton = document.getElementById("openButton");
  const statusEl = document.getElementById("status");

  function setStatus(message, type) {
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.classList.remove("is-error", "is-ready");

    if (type === "error") {
      statusEl.classList.add("is-error");
    }

    if (type === "ready") {
      statusEl.classList.add("is-ready");
    }
  }

  function normalizeBaseUrl(url) {
    return String(url || "").trim().replace(/\/$/, "");
  }

  function buildGasUrl(mode) {
    const baseUrl = normalizeBaseUrl(config.GAS_WEB_APP_URL);

    if (!baseUrl) {
      return "";
    }

    if (mode === "basic") {
      return baseUrl + "?mode=basic";
    }

    if (mode === "check") {
      return baseUrl + "?mode=check";
    }

    return baseUrl;
  }

  function validateConfig() {
    if (!config.GAS_WEB_APP_URL) {
      setStatus(
        "GAS_WEB_APP_URL が未設定です。config.js にGASのWebアプリURLを設定してください。",
        "error"
      );
      return false;
    }

    if (!String(config.GAS_WEB_APP_URL).includes("script.google.com/macros/s/")) {
      setStatus(
        "GAS_WEB_APP_URL の形式を確認してください。Google Apps ScriptのWebアプリURLを設定する必要があります。",
        "error"
      );
      return false;
    }

    setStatus("準備ができました。ボタンからフォーム画面に進んでください。", "ready");
    return true;
  }

  function openGasPage(mode) {
    const url = buildGasUrl(mode);

    if (!url) {
      setStatus("遷移先URLを作成できませんでした。config.js を確認してください。", "error");
      return;
    }

    window.location.href = url;
  }

  if (openButton) {
    const mode = openButton.dataset.mode;

    const valid = validateConfig();

    if (!valid) {
      openButton.disabled = true;
      openButton.classList.add("disabled");
      return;
    }

    openButton.addEventListener("click", function () {
      openGasPage(mode);
    });
  }
})();


