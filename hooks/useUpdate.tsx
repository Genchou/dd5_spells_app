import { checkForUpdate } from '@/utils/update';
import { useObservable } from '@legendapp/state/react';
import { useEffect } from 'react';

export function useUpdate() {
  const needsUpdate = useObservable(false);
  const latestVersion = useObservable('');

  useEffect(() => {
    checkForUpdate().then(({ needsUpdate: updateAvailable, latestRelease }) => {
      needsUpdate.set(updateAvailable);
      latestVersion.set(latestRelease.name);
    });
  }, [latestVersion, needsUpdate]);

  return { needsUpdate: needsUpdate.get(), latestVersion: latestVersion.get() };
}
