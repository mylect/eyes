(function () {
  const config = window.MYLECT_CONFIG || {};

  const form = document.getElementById("mylectForm");
  const openButton = document.getElementById("openButton");
  const statusEl = document.getElementById("status");
  const userIdInput = document.getElementById("userIdInput");

  function setStatus(message, type) {
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = "status";

    if (type) {
      statusEl.classList.add(type);
    }
  }

  function getCurrentMode() {
    if (!form) return "";

    const modeInput = form.querySelector('input[name="mode"]');
    return modeInput ? String(modeInput.value || "").trim() : "";
  }

  function getLiffId(mode) {
    if (mode === "basic") return config.LIFF_ID_BASIC;
    if (mode === "check") return config.LIFF_ID_CHECK;
    return "";
  }

  function disableButton() {
    if (!openButton) return;
    openButton.disabled = true;
  }

  function enableButton() {
    if (!openButton) return;
    openButton.disabled = false;
  }

  async function initialize() {
    if (!form || !openButton || !userIdInput) return;

    disableButton();

    const mode = getCurrentMode();
    const liffId = getLiffId(mode);

    if (!config.GAS_WEB_APP_URL) {
      setStatus("GAS WebアプリURLが未設定です。config.jsを確認してください。", "error");
      return;
    }

    if (!liffId) {
      setStatus("LIFF IDが未設定です。config.jsを確認してください。", "error");
      return;
    }

    /**
     * HTML formの送信先だけを設定する。
     * URLパラメータの組み立てはHTMLフォームのGET送信に任せる。
     */
    form.action = config.GAS_WEB_APP_URL;

    try {
      await liff.init({ liffId });

      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const profile = await liff.getProfile();
      const lineUserId = profile && profile.userId ? profile.userId : "";

      if (!lineUserId) {
        setStatus("LINE userIdを取得できませんでした。LINEアプリ内から開き直してください。", "error");
        return;
      }

      userIdInput.value = lineUserId;

      setStatus("準備ができました。フォームへ進んでください。", "ready");
      enableButton();

      form.addEventListener("submit", function (event) {
        if (!userIdInput.value) {
          event.preventDefault();
          setStatus("LINE userIdが未取得です。LINEアプリ内から開き直してください。", "error");
          disableButton();
          return;
        }

        if (!form.action) {
          event.preventDefault();
          setStatus("GAS WebアプリURLが未設定です。", "error");
          disableButton();
        }
      });
    } catch (error) {
      console.error(error);
      setStatus("LIFFの初期化に失敗しました。LINEアプリ内から開き直してください。", "error");
      disableButton();
    }
  }

  initialize();
})();

