import type { HostConfig } from "../types/hostConfig";

type Props = {
  config: HostConfig;
  supported: boolean;
};

export function NfcHeader({ config, supported }: Props) {
  const userName = config.user?.name ?? "Operador";
  return (
    <header className="glass mx-auto flex max-w-5xl flex-col gap-2 rounded-2xl px-4 py-4 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Microfront NFC
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Lector NFC (Web NFC)
        </h1>
        <p className="text-xs text-slate-400">
          Sesión: {userName} · Token válido
        </p>
        {!supported && (
          <p className="text-xs text-amber-200">
            Este dispositivo/navegador no soporta Web NFC.
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          remote: nfc
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
          expose: App
        </span>
        {config?.notify && (
          <button
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[11px] transition hover:-translate-y-0.5 hover:border-white/40"
            onClick={() =>
              config.notify?.("Lectura NFC: alerta enviada desde el MF.")
            }
          >
            Alertar host
          </button>
        )}
      </div>
    </header>
  );
}
