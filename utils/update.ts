import Constants from 'expo-constants';
import * as Application from 'expo-application';

export const GITHUB_REPO = 'Genchou/dd5_spells_app';
const GITHUB_API = 'https://api.github.com/repos';
const RELEASE_ENDPOINT = 'releases';

type ReleaseAsset = {
  url: string;
  name: string;
  browser_download_url: string;
};

type GithubReleaseDTO = {
  url: string;
  name: string;
  tag_name: string;
  assets: ReleaseAsset[];
  published_at: string;
};

const mockReleases: GithubReleaseDTO[] = [
  {
    url: '',
    name: 'v1.1.1',
    tag_name: 'v1.1.1',
    assets: [],
    published_at: '2025-01-27T14:09:20Z',
  },
  {
    url: '',
    name: 'v1.1.2',
    tag_name: 'v1.1.2',
    assets: [],
    published_at: '2025-01-27T14:29:20Z',
  },
  {
    url: '',
    name: 'v1.1.4',
    published_at: '2025-01-31T14:09:20Z',
    tag_name: 'v1.1.4',
    assets: [],
  },
  {
    url: '',
    name: 'v1.1.3',
    tag_name: 'v1.1.3',
    assets: [],
    published_at: '2025-01-29T09:09:20Z',
  },
];

async function doHttpRequest<T>(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data as T;
}

export function getCurrentVersion() {
  return Application.nativeApplicationVersion || 'no version found';
}

function compareToCurrentVersion(versionName: string) {
  const { expoConfig } = Constants;
  const currentVersionName = `v${expoConfig?.version}`;
  return versionName > currentVersionName;
}

export async function checkForUpdate(): Promise<{ needsUpdate: boolean; latestRelease: GithubReleaseDTO }> {
  const releases = __DEV__
    ? await Promise.resolve(mockReleases)
    : await doHttpRequest<GithubReleaseDTO[]>(`${GITHUB_API}/${GITHUB_REPO}/${RELEASE_ENDPOINT}`);

  const [latestRelease] = releases.sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
  const needsUpdate = compareToCurrentVersion(latestRelease.tag_name);

  return { needsUpdate, latestRelease };
}
