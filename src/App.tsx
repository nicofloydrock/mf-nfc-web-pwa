// Entrada del MF NFC: valida config y decide entre tester o vista principal.
import { useMemo, useState } from "react";
import { NfcHeader } from "./components/NfcHeader";
import { NfcPanel } from "./components/NfcPanel";
import { NfcResult } from "./components/NfcResult";
import { ConfigTester } from "./components/ConfigTester";
import copy from "./content/nfc.json";
import type { HostConfig } from "./types/hostConfig";
import { createId } from "./utils/id";

type AppProps = {
  config?: HostConfig;
};

export default function App({ config }: AppProps) {
  const [localConfig, setLocalConfig] = useState<HostConfig | undefined>(config);
  const effectiveConfig = localConfig ?? config;
  const valid = effectiveConfig?.token === "NICORIVERA";
  const [lastPayload, setLastPayload] = useState<string | null>(null);
  const [sessionId] = useState(() => createId());
  const supported = useMemo(() => "NDEFReader" in window, []);

  if (!valid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-200 sm:px-8">
        <ConfigTester copy={copy.tester} onApply={(cfg) => setLocalConfig(cfg)} />
      </div>
    );
  }

  const userName =
    effectiveConfig?.auth?.user?.name ??
    effectiveConfig?.user?.name ??
    copy.app.anonymousUser;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8">
      <NfcHeader
        config={effectiveConfig}
        supported={supported}
        copy={copy.header}
        userName={userName}
      />

      <main className="mx-auto mt-6 flex max-w-5xl flex-col gap-4">
        <NfcPanel
          copy={copy.panel}
          onResult={(text) => {
            setLastPayload(text);
            effectiveConfig?.notify?.(`Tag NFC leída: ${text.slice(0, 60)}`);
          }}
        />

        <NfcResult
          sessionId={sessionId}
          payload={lastPayload}
          copy={{
            resultTitle: copy.panel.resultTitle,
            noPayload: copy.panel.noPayload,
            sessionLabel: copy.panel.sessionLabel,
          }}
        />
      </main>
    </div>
  );
}
