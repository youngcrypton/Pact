/**
 * GitHub Proof of Work Verifier
 * Validates pull request and commit links submitted by bounty contributors.
 */
export interface GitHubVerificationResult {
  isValid: boolean;
  owner: string | null;
  repo: string | null;
  prNumber: number | null;
  error?: string;
}

export class GitHubVerifier {
  private prRegex = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/pull\/([0-9]+)\/?$/;
  private commitRegex = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)\/commit\/([a-f0-9]{7,40})\/?$/;

  /**
   * Validates whether a submitted URL is a genuine GitHub Pull Request or Commit.
   */
  public parseProofUrl(url: string): GitHubVerificationResult {
    if (!url || typeof url !== 'string') {
      return { isValid: false, owner: null, repo: null, prNumber: null, error: 'Empty URL provided' };
    }

    const prMatch = url.trim().match(this.prRegex);
    if (prMatch) {
      return {
        isValid: true,
        owner: prMatch[1],
        repo: prMatch[2],
        prNumber: parseInt(prMatch[3], 10)
      };
    }

    const commitMatch = url.trim().match(this.commitRegex);
    if (commitMatch) {
      return {
        isValid: true,
        owner: commitMatch[1],
        repo: commitMatch[2],
        prNumber: null
      };
    }

    return {
      isValid: false,
      owner: null,
      repo: null,
      prNumber: null,
      error: 'URL must be a valid GitHub Pull Request (https://github.com/owner/repo/pull/123) or commit'
    };
  }
}

