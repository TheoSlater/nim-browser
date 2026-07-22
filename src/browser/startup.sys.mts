export async function startup(window: any) {
  // Remove this onboarding block to disable the welcome UI.
  const seenPref = "geckokit.onboarding.seen";
  if (Services.prefs.getBoolPref(seenPref, false)) {
    return;
  }

  await window.gNotificationBox.appendNotification(
    "geckokit-onboarding",
    {
      label: "Welcome to Nim Browser. Start with README.md. Edit this UI in src/browser/startup.sys.mts.",
      image: "chrome://branding/content/icon64.png",
      priority: window.gNotificationBox.PRIORITY_INFO_MEDIUM,
    },
    [],
  );
  Services.prefs.setBoolPref(seenPref, true);
}
