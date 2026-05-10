(function () {
  const config = window.MYLECT_CONFIG || {};
  const openButton = document.getElementById("openButton");
  const statusEl = document.getElementById("status");

  let lineUserId = "";

  function setStatus(message, type) {
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = "status";

    if (type) {
      statusEl.classList.add(type);
    }
  }

  function getLiffId(mode) {
    if (mode === "basic") return config.LIFF_ID_BASIC;
    if (mode === "check") return config.LIFF_ID_CHECK;
    return "";
  }

  function buildGasUrl(mode, userId) {
    const base = String(config.GAS_WEB_APP_URL || "").trim();

    const params = new URLSearchParams({
      action: "openForm",
      mode: mode,
      userId: userId
    });

    return base + "?" + params.toString();
  }

  async function initialize() {
    if (!openButton) return;

    const mode = openButton.dataset.mode;
    const liffId = getLiffId(mode);

    openButton.disabled = true;

    if (!config.GAS_WEB_APP_URL) {
      setStatus("GAS WebアプリURLが未設定です。config.jsを確認してください。", "error");
      return;
    }

    if (!liffId) {
      setStatus("LIFF IDが未設定です。config.jsを確認してください。", "error");
      return;
    }

    try {
      await liff.init({ liffId });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const profile = await liff.getProfile();
      lineUserId = profile.userId;

      if (!lineUserId) {
        setStatus("LINE userIdを取得できませんでした。LINEアプリ内から開き直してください。", "error");
        return;
      }

      setStatus("準備ができました。フォームへ進んでください。", "ready");
      openButton.disabled = false;

      openButton.addEventListener("click", function () {
        const url = buildGasUrl(mode, lineUserId);
        window.location.href = url;
      });
    } catch (error) {
      console.error(error);
      setStatus("LIFFの初期化に失敗しました。LINEアプリ内から開き直してください。", "error");
    }
  }

  initialize();
})();

