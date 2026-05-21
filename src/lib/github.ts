export interface GithubCredentials {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface PushOptions extends GithubCredentials {
  path: string;
  message: string;
  content: string; // The markdown string
}

export async function pushToGithub(options: PushOptions) {
  const { token, owner, repo, branch, path, message, content } = options;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // Step 1: Check if file already exists to get its SHA (required for updating)
  let sha: string | undefined;
  try {
    const getRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch (error) {
    console.warn("Could not fetch existing file, assuming new file.");
  }

  // Step 2: Push the new content
  // Note: btoa() does not properly encode utf-8 chars, need a utf8-safe base64 encoder
  // using unescape(encodeURIComponent()) trick
  const encodedContent = btoa(unescape(encodeURIComponent(content)));

  const body: any = {
    message,
    content: encodedContent,
    branch
  };
  if (sha) {
    body.sha = sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    const errorData = await putRes.json();
    throw new Error(`GitHub Error: ${errorData.message}`);
  }

  return await putRes.json();
}
