export const SETTINGS_KEY = 'tobedone-settings';

export function getAppSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};

        return {
            darkMode: Boolean(parsed.darkMode),
            compactSidebar: Boolean(parsed.compactSidebar),
        };
    } catch (error) {
        console.error('Failed to read app settings:', error);
        return {
            darkMode: false,
            compactSidebar: false,
        };
    }
}

export function applyAppSettings(nextSettings = {}) {
    const currentSettings = getAppSettings();
    const mergedSettings = {
        ...currentSettings,
        ...nextSettings,
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(mergedSettings));
    window.dispatchEvent(
        new CustomEvent('tobedone-settings-changed', {
            detail: mergedSettings,
        }),
    );

    return mergedSettings;
}
