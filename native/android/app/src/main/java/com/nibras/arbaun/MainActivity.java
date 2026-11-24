package com.nibras.arbaun;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Edge-to-edge shell: the web page draws behind the status and navigation bars
 * and receives the exact bar/cutout/keyboard insets as CSS variables
 * (--sat, --sab, --sal, --sar, --kb), so the header colour reaches the top edge
 * and no content sits under a system bar on any Android version.
 */
public class MainActivity extends BridgeActivity {
    private int insTop, insBottom, insLeft, insRight, insIme;
    boolean dark = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NibrasPlugin.class);
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        applyBars();

        WebView wv = getBridge().getWebView();
        ViewCompat.setOnApplyWindowInsetsListener(wv, (v, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
            float d = getResources().getDisplayMetrics().density;
            insTop = Math.round(bars.top / d);
            insBottom = Math.round(bars.bottom / d);
            insLeft = Math.round(bars.left / d);
            insRight = Math.round(bars.right / d);
            insIme = Math.max(0, Math.round((ime.bottom - bars.bottom) / d));
            pushInsets();
            return WindowInsetsCompat.CONSUMED;
        });
        ViewCompat.requestApplyInsets(wv);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView w = getBridge() != null ? getBridge().getWebView() : null;
                if (w != null && w.canGoBack()) {
                    w.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                }
            }
        });
    }

    String insetsJs() {
        return "(function(){var s=document.documentElement.style;"
            + "s.setProperty('--sat','" + insTop + "px');"
            + "s.setProperty('--sab','" + insBottom + "px');"
            + "s.setProperty('--sal','" + insLeft + "px');"
            + "s.setProperty('--sar','" + insRight + "px');"
            + "s.setProperty('--kb','" + insIme + "px');})()";
    }

    void pushInsets() {
        WebView wv = getBridge() != null ? getBridge().getWebView() : null;
        if (wv != null) wv.post(() -> wv.evaluateJavascript(insetsJs(), null));
    }

    int[] insets() {
        return new int[] { insTop, insBottom, insLeft, insRight, insIme };
    }

    void applyBars() {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        // Header is the blue-green gradient in both themes: light status icons.
        c.setAppearanceLightStatusBars(false);
        // Navigation bar sits over the page background.
        c.setAppearanceLightNavigationBars(!dark);
        getWindow().getDecorView().setBackgroundColor(dark ? 0xFF0E1716 : 0xFFF5F8F7);
        if (Build.VERSION.SDK_INT >= 29) getWindow().setNavigationBarContrastEnforced(false);
    }

    @Override
    public void onResume() {
        super.onResume();
        pushInsets();
    }
}
