package com.nibras.arbaun;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Tiny local bridge: copy, share (system sheet), theme of system bars, insets. No permissions.
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
}
