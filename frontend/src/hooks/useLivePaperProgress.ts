import {
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { subscribePaperProgress } from "../lib/api";
import type { Paper } from "../types";

function isTrackableStatus(status: string) {
  return status === "pending" || status === "processing";
}

function applyProgressUpdate(paper: Paper, pct: number, step: string): Paper {
  return {
    ...paper,
    status: paper.status === "pending" && pct > 0 ? "processing" : paper.status,
    progress_pct: pct,
    progress_step: step,
  };
}

export function useLivePaperListProgress(
  papers: Paper[],
  setPapers: Dispatch<SetStateAction<Paper[]>>,
  reload: () => Promise<boolean>,
) {
  const subscriptionsRef = useRef(new Map<string, () => void>());
  const [retryTick, retrySubscription] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    const activeIds = new Set(
      papers.filter((paper) => isTrackableStatus(paper.status)).map((paper) => paper.id),
    );

    for (const [paperId, unsubscribe] of subscriptionsRef.current) {
      if (!activeIds.has(paperId)) {
        unsubscribe();
        subscriptionsRef.current.delete(paperId);
      }
    }

    for (const paper of papers) {
      if (!isTrackableStatus(paper.status) || subscriptionsRef.current.has(paper.id)) {
        continue;
      }

      const unsubscribe = subscribePaperProgress(
        paper.id,
        (pct, step) => {
          setPapers((current) =>
            current.map((item) =>
              item.id === paper.id ? applyProgressUpdate(item, pct, step) : item,
            ),
          );
        },
        () => {
          subscriptionsRef.current.get(paper.id)?.();
          subscriptionsRef.current.delete(paper.id);
          void (async () => {
            const ok = await reload();
            if (!ok) {
              retrySubscription();
            }
          })();
        },
      );

      subscriptionsRef.current.set(paper.id, unsubscribe);
    }
  }, [papers, reload, retryTick, setPapers]);

  useEffect(() => {
    const subscriptions = subscriptionsRef.current;

    return () => {
      for (const unsubscribe of subscriptions.values()) {
        unsubscribe();
      }
      subscriptions.clear();
    };
  }, []);
}

export function useLivePaperProgress(
  paperId: string | undefined,
  paper: Paper | null,
  setPaper: Dispatch<SetStateAction<Paper | null>>,
  reload: () => Promise<boolean>,
) {
  const activeIdRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [retryTick, retrySubscription] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    if (!paperId || !paper || !isTrackableStatus(paper.status)) {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      activeIdRef.current = null;
      return;
    }

    if (activeIdRef.current === paper.id) {
      return;
    }

    unsubscribeRef.current?.();

    const unsubscribe = subscribePaperProgress(
      paper.id,
      (pct, step) => {
        setPaper((current) => {
          if (!current || current.id !== paper.id) {
            return current;
          }
          return applyProgressUpdate(current, pct, step);
        });
      },
      () => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
        activeIdRef.current = null;
        void (async () => {
          const ok = await reload();
          if (!ok) {
            retrySubscription();
          }
        })();
      },
    );

    unsubscribeRef.current = unsubscribe;
    activeIdRef.current = paper.id;
  }, [paper, paperId, reload, retryTick, setPaper]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
      activeIdRef.current = null;
    };
  }, []);
}
