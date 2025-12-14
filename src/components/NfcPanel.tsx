// Panel de lectura NFC con manejo de estados y errores.
import { useState } from "react";

type Props = {
  copy: {
    subtitle: string;
    title: string;
    description: string;
    cta: { idle: string; requesting: string; reading: string };
    errorGeneric: string;
  };
  onResult: (text: string) => void;
};

export function NfcPanel({ onResult, copy }: Props) {
  const [status, setStatus] = useState<"idle" | "requesting" | "reading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setError(null);
    setStatus("requesting");
    if (!("NDEFReader" in window)) {
      setStatus("error");
      setError(copy.errorGeneric);
      return;
    }

    try {
      // @ts-expect-error Web NFC experimental
      const reader = new NDEFReader();
      await reader.scan();
      setStatus("reading");
      reader.onreading = (event: { message?: { records?: Array<{ recordType?: string; data?: BufferSource; encoding?: string }> } }) => {
        const records = event.message?.records || [];
        const record = records[0];
        let text = "Tag leída (sin payload legible).";
        if (record?.recordType === "text") {
          const decoder = new TextDecoder(record.encoding || "utf-8");
          text = decoder.decode(record.data);
        } else if (record?.data) {
          try {
            text = new TextDecoder().decode(record.data);
          } catch {
            text = "Tag leída (payload binario).";
          }
        }
        onResult(text);
        setStatus("idle");
      };
      reader.onerror = (e: { message?: string }) => {
        setStatus("error");
        setError(e?.message || copy.errorGeneric);
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus("error");
      setError(message || copy.errorGeneric);
    }
  };

  return (
    <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {copy.subtitle}
          </p>
          <h2 className="text-xl font-semibold text-white">{copy.title}</h2>
          <p className="text-xs text-slate-300">{copy.description}</p>
        </div>
        <button
          className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-emerald-950 shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleScan}
          disabled={status === "requesting" || status === "reading"}
        >
          {status === "reading"
            ? copy.cta.reading
            : status === "requesting"
            ? copy.cta.requesting
            : copy.cta.idle}
        </button>
      </div>
      {error && (
        <div className="mt-3 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
          {error}
        </div>
      )}
    </section>
  );
}
