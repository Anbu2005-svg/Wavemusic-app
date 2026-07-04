import { useEffect } from "react";
import { usePlayerStore } from "../stores/playerStore";

/**
 * Enables / disables Android background mode so the WebView (and thus
 * the YouTube IFrame player) stays alive when the app is minimised or
 * the screen is locked.
 *
 * The plugin is loaded dynamically so the web build keeps working in a
 * normal browser where the native plugin does not exist.
 */
export function useBackgroundMode() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const current = usePlayerStore((state) => state.current);

  useEffect(() => {
    // Only attempt when a track is loaded and playing
    if (!current || !isPlaying) {
      // Disable background mode when nothing is playing
      import("@anuradev/capacitor-background-mode")
        .then(({ BackgroundMode }) => BackgroundMode.disable())
        .catch(() => {
          /* not on native – ignore */
        });
      return;
    }

    // Enable background mode so audio keeps playing
    import("@anuradev/capacitor-background-mode")
      .then(({ BackgroundMode }) =>
        BackgroundMode.enable({
          title: "MusicWave",
          text: current.title ?? "Playing music",
          icon: "ic_launcher",
          silent: false
        })
      )
      .catch(() => {
        /* not on native – ignore */
      });

    return () => {
      import("@anuradev/capacitor-background-mode")
        .then(({ BackgroundMode }) => BackgroundMode.disable())
        .catch(() => {
          /* not on native – ignore */
        });
    };
  }, [isPlaying, current]);
}
