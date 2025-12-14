// Muestra el resultado de la última lectura NFC.
type Props = {
  sessionId: string;
  payload: string | null;
  copy: { resultTitle: string; noPayload: string; sessionLabel: string };
};

export function NfcResult({ sessionId, payload, copy }: Props) {
  return (
    <section className="glass rounded-2xl border border-white/10 p-4 sm:p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{copy.resultTitle}</p>
      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
        {payload ? (
          <>
            <p className="text-xs text-slate-400">
              {copy.sessionLabel}: {sessionId}
            </p>
            <p className="mt-1 whitespace-pre-wrap">{payload}</p>
          </>
        ) : (
          <p className="text-slate-400">{copy.noPayload}</p>
        )}
      </div>
    </section>
  );
}
