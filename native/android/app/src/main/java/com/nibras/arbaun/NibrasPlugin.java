package com.nibras.arbaun;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.JSArray;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Tiny local bridge: copy, share (system sheet), theme of system bars, insets,
 * and on-device text-to-speech (Android TextToSpeech with an Arabic voice). No permissions.
 */
@CapacitorPlugin(name = "Nibras")
public class NibrasPlugin extends Plugin {

    @PluginMethod
    public void copy(PluginCall call) {
        String text = call.getString("text", "");
        getActivity().runOnUiThread(() -> {
            try {
                ClipboardManager cm = (ClipboardManager) getContext().getSystemService(Context.CLIPBOARD_SERVICE);
                cm.setPrimaryClip(ClipData.newPlainText("hadith", text));
                call.resolve();
            } catch (Exception e) {
                call.reject("copy failed");
            }
        });
    }

    @PluginMethod
    public void share(PluginCall call) {
        String text = call.getString("text", "");
        String title = call.getString("title", "");
        getActivity().runOnUiThread(() -> {
            try {
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("text/plain");
                send.putExtra(Intent.EXTRA_TEXT, text);
                if (!title.isEmpty()) send.putExtra(Intent.EXTRA_SUBJECT, title);
                Intent chooser = Intent.createChooser(send, title.isEmpty() ? null : title);
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(chooser);
                call.resolve();
            } catch (Exception e) {
                call.reject("share failed");
            }
        });
    }

    @PluginMethod
    public void setTheme(PluginCall call) {
        boolean dark = Boolean.TRUE.equals(call.getBoolean("dark", false));
        getActivity().runOnUiThread(() -> {
            MainActivity a = (MainActivity) getActivity();
            a.dark = dark;
            a.applyBars();
            call.resolve();
        });
    }

    @PluginMethod
    public void getInsets(PluginCall call) {
        int[] i = ((MainActivity) getActivity()).insets();
        JSObject r = new JSObject();
        r.put("top", i[0]);
        r.put("bottom", i[1]);
        r.put("left", i[2]);
        r.put("right", i[3]);
        r.put("ime", i[4]);
        call.resolve(r);
    }

    // ---------- text-to-speech ----------
    private TextToSpeech tts;
    private int ttsStatus = 1; // 1 = initialising, 0 = ready, -1 = failed
    private final List<PluginCall> waiting = new ArrayList<>();
    private int lastIndex = -1;

    private void ensureTts() {
        if (tts != null) return;
        ttsStatus = 1;
        tts = new TextToSpeech(getContext().getApplicationContext(), status -> {
            ttsStatus = status == TextToSpeech.SUCCESS ? 0 : -1;
            if (ttsStatus == 0) {
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { emit("start", idx(id)); }
                    @Override public void onDone(String id) { if (idx(id) == lastIndex) emit("end", idx(id)); }
                    @Override public void onError(String id) { emit("error", idx(id)); }
                    @Override public void onError(String id, int code) { emit("error", idx(id)); }
                });
            }
            List<PluginCall> w = new ArrayList<>(waiting);
            waiting.clear();
            for (PluginCall c : w) resolveCheck(c);
        });
    }

    private int idx(String id) {
        try { return Integer.parseInt(id.substring(1)); } catch (Exception e) { return -1; }
    }

    private void emit(String type, int index) {
        JSObject d = new JSObject();
        d.put("type", type);
        d.put("index", index);
        notifyListeners("tts", d);
    }

    /** Picks an Arabic voice, preferring one that works offline and is installed. */
    private String selectArabic() {
        Locale ar = new Locale("ar");
        int avail = tts.isLanguageAvailable(ar);
        if (avail == TextToSpeech.LANG_NOT_SUPPORTED) return "no-arabic";
        if (avail == TextToSpeech.LANG_MISSING_DATA) return "missing-data";
        Voice best = null;
        try {
            if (tts.getVoices() != null) {
                for (Voice v : tts.getVoices()) {
                    if (v.getLocale() == null || !"ar".equals(v.getLocale().getLanguage())) continue;
                    if (v.getFeatures() != null && v.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                    if (best == null || (best.isNetworkConnectionRequired() && !v.isNetworkConnectionRequired())
                        || (best.isNetworkConnectionRequired() == v.isNetworkConnectionRequired() && v.getQuality() > best.getQuality())) best = v;
                }
            }
        } catch (Exception ignored) { }
        int r = best != null ? tts.setVoice(best) : tts.setLanguage(ar);
        if (r == TextToSpeech.ERROR) r = tts.setLanguage(ar);
        if (r == TextToSpeech.LANG_MISSING_DATA) return "missing-data";
        if (r == TextToSpeech.LANG_NOT_SUPPORTED) return "no-arabic";
        return null;
    }

    private void resolveCheck(PluginCall call) {
        JSObject r = new JSObject();
        if (ttsStatus != 0 || tts == null) {
            r.put("ok", false);
            r.put("reason", "no-engine");
            call.resolve(r);
            return;
        }
        String problem = selectArabic();
        r.put("ok", problem == null);
        if (problem != null) r.put("reason", problem);
        try { r.put("engine", tts.getDefaultEngine()); } catch (Exception ignored) { }
        call.resolve(r);
    }

    @PluginMethod
    public void ttsCheck(PluginCall call) {
        ensureTts();
        if (ttsStatus == 1) waiting.add(call); else resolveCheck(call);
    }

    @PluginMethod
    public void ttsSpeak(PluginCall call) {
        if (tts == null || ttsStatus != 0) { call.reject("tts not ready"); return; }
        JSArray chunks = call.getArray("chunks", new JSArray());
        int start = call.getInt("start", 0);
        double rate = call.getDouble("rate", 0.9);
        try {
            tts.setSpeechRate((float) Math.max(0.5, Math.min(1.5, rate)));
            int n = chunks.length();
            lastIndex = start + n - 1;
            for (int i = 0; i < n; i++) {
                Bundle params = new Bundle();
                tts.speak(chunks.getString(i), i == 0 ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD, params, "u" + (start + i));
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("speak failed");
        }
    }

    @PluginMethod
    public void ttsStop(PluginCall call) {
        lastIndex = -1;
        if (tts != null) tts.stop();
        call.resolve();
    }

    /** Opens the system text-to-speech settings so the user can install an Arabic voice. */
    @PluginMethod
    public void ttsSettings(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            String[] actions = { "com.android.settings.TTS_SETTINGS", TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA, Settings.ACTION_SETTINGS };
            for (String a : actions) {
                try {
                    Intent i = new Intent(a);
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(i);
                    call.resolve();
                    return;
                } catch (Exception ignored) { }
            }
            call.reject("no settings");
        });
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); tts = null; }
        super.handleOnDestroy();
    }
}
