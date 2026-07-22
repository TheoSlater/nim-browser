pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// Empty, quiet browser shell.
pref("browser.newtabpage.enabled", true);
pref("browser.newtab.preload", false);
pref("browser.startup.homepage.abouthome_cache.enabled", false);
pref("browser.aboutwelcome.enabled", false);
pref("browser.startup.homepage", "about:home");
pref("browser.startup.homepage_override.mstone", "ignore");
pref("browser.shell.checkDefaultBrowser", false);
pref("browser.crashReports.unsubmittedCheck.enabled", false);
pref("browser.preferences.moreFromMozilla", false);

// Native vertical tabs by default; users can switch back in sidebar settings.
pref("sidebar.revamp", true);
pref("sidebar.verticalTabs", true);
pref("sidebar.visibility", "always-show");

// No newtab content feeds, sponsored content, or promos.
pref("browser.newtabpage.activity-stream.discoverystream.enabled", false);
pref("browser.newtabpage.activity-stream.showSponsored", false);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.showSponsoredCheckboxes", false);
pref("browser.newtabpage.activity-stream.unifiedAds.tiles.enabled", false);
pref("browser.newtabpage.activity-stream.unifiedAds.spocs.enabled", false);
pref("browser.newtabpage.activity-stream.discoverystream.promoCard.visible", false);
pref("browser.topsites.contile.enabled", false);
pref("browser.partnerlink.attributionURL", "");

// Lower idle memory without weakening site isolation.
pref("dom.ipc.processCount", 4);
pref("dom.ipc.processCount.webIsolated", 2);
pref("dom.ipc.processPrelaunch.enabled", false);
pref("dom.ipc.processPrelaunch.fission.number", 0);
pref("dom.ipc.keepProcessesAlive.privilegedabout", 0);
pref("browser.tabs.unloadOnLowMemory", true);
pref("browser.tabs.min_inactive_duration_before_unload", 300000);
pref("browser.cache.memory.capacity", 65536);
pref("media.memory_caches_combined_limit_kb", 131072);

// Reduce session bookkeeping and defer inactive pinned tabs after restart.
pref("browser.sessionstore.interval", 60000);
pref("browser.sessionstore.restore_pinned_tabs_on_demand", true);
pref("browser.sessionstore.max_tabs_undo", 10);
pref("browser.sessionstore.max_windows_undo", 3);
pref("browser.sessionstore.max_serialize_forward", 3);

// Avoid speculative background connections and prefetching.
pref("network.prefetch-next", false);
pref("network.dns.disablePrefetch", true);
pref("network.http.speculative-parallel-limit", 0);
pref("browser.urlbar.speculativeConnect.enabled", false);
pref("browser.places.speculativeConnect.enabled", false);

// No Mozilla-fed suggestions, experiments, popups, or promos.
pref("browser.discovery.enabled", false);
pref("browser.urlbar.quicksuggest.enabled", false);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
pref("browser.urlbar.suggest.topsites", false);
pref("browser.urlbar.suggest.trending", false);
pref("browser.urlbar.suggest.weather", false);
pref("browser.newtabpage.activity-stream.showWeather", false);
pref("browser.urlbar.merino.endpointURL", "");
pref("app.normandy.enabled", false);
pref("app.shield.optoutstudies.enabled", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);
pref("extensions.htmlaboutaddons.recommendations.enabled", false);
pref("browser.startup.upgradeDialog.enabled", false);
pref("browser.vpn_promo.enabled", false);
pref("browser.promo.focus.enabled", false);
pref("browser.promo.pin.enabled", false);

// No background telemetry submission or local ping archive.
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("datareporting.usage.uploadEnabled", false);
pref("toolkit.telemetry.enabled", false);
pref("toolkit.telemetry.unified", false);
pref("toolkit.telemetry.archive.enabled", false);
pref("toolkit.telemetry.shutdownPingSender.enabled", false);
pref("toolkit.telemetry.shutdownPingSender.backgroundtask.enabled", false);
pref("toolkit.telemetry.shutdownPingSender.enabledFirstSession", false);
pref("toolkit.telemetry.firstShutdownPing.enabled", false);
pref("toolkit.telemetry.newProfilePing.enabled", false);
pref("toolkit.telemetry.updatePing.enabled", false);
pref("toolkit.telemetry.bhrPing.enabled", false);
pref("toolkit.telemetry.server", "");
pref("browser.newtabpage.activity-stream.telemetry", false);
pref("browser.newtabpage.activity-stream.telemetry.privatePing.enabled", false);
pref("browser.search.serpEventTelemetryCategorization.enabled", false);
pref("identity.fxaccounts.telemetry.clientAssociationPing.enabled", false);
pref("nimbus.telemetry.targetingContextEnabled", false);
pref("nimbus.rollouts.enabled", false);

// No AI, local models, or AI-backed UI.
pref("browser.ml.enable", false);
pref("browser.ml.chat.enabled", false);
pref("browser.ml.chat.menu", false);
pref("browser.ml.chat.page", false);
pref("browser.ml.chat.shortcuts", false);
pref("browser.ml.chat.sidebar", false);
pref("browser.ml.linkPreview.enabled", false);
pref("browser.ml.pageAssist.enabled", false);
pref("browser.preferences.aiControls", false);
pref("browser.smartwindow.enabled", false);
pref("browser.smartwindow.memories.generateFromHistory", false);
pref("browser.smartwindow.memories.generateFromConversation", false);
pref("browser.smartwindow.worldcup.enabled", false);
pref("browser.tabs.groups.smart.enabled", false);
pref("browser.tabs.groups.smart.userEnabled", false);
pref("browser.urlbar.quicksuggest.mlEnabled", false);
pref("browser.urlbar.quicksuggest.rustEnabled", false);
pref("places.semanticHistory.featureGate", false);
pref("places.semanticHistory.smartwindow.featureGate", false);
pref("pdfjs.enableAltText", false);
pref("pdfjs.enableAltTextModelDownload", false);
pref("pdfjs.enableGuessAltText", false);
pref("browser.preferences.experimental.hidden", true);

pref("privacy.globalprivacycontrol.enabled", true);
pref("privacy.globalprivacycontrol.functionality.enabled", true);
pref("privacy.globalprivacycontrol.pbmode.enabled", true);

// Bound disposable profile growth without increasing memory use.
pref("browser.cache.disk.smart_size.enabled", false);
pref("browser.cache.disk.capacity", 65536);
