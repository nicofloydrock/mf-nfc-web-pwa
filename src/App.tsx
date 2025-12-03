import { useMemo, useState } from "react";
import { NfcHeader } from "./components/NfcHeader";
import { NfcPanel } from "./components/NfcPanel";
import type { HostConfig } from "./types/hostConfig";
import { createId } from "./utils/id";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const valid = config?.token === "NICORIVERA";
  const [lastPayload, setLastPayload] = useState<string | null>(null);
  const [sessionId] = useState(() => createId());
  const supported = useMemo(() => "NDEFReader" in window, []);

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-center text-slate-200 sm:px-8">
        Config no recibida o token inválido.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <NfcHeader config={config} supported={supported} />

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <NfcPanel
          onResult={(text) => {
            setLastPayload(text);
            config.notify?.(`Tag NFC leída: ${text.slice(0, 60)}`);
          }}
        />

        <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Resultado
          </p>
          <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            {lastPayload ? (
              <>
                <p className="text-xs text-slate-400">Sesión: {sessionId}</p>
                <p className="mt-1 whitespace-pre-wrap">{lastPayload}</p>
              </>
            ) : (
              <p className="text-slate-400">Aún no se ha leído ninguna tag.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
