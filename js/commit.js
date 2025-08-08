u(document).on('DOMContentLoaded', function() {

	function fetchCommit() {
		const githubRepoPath = "https://api.github.com/repos/benalleng/benalleng.github.io/commits/master"

		fetch(githubRepoPath).then(r => r.json()).then(githubRepoData => {
			const link = document.getElementById('commit-link');
			link.href = githubRepoData.html_url

			const githubCommitDate = new Date(githubRepoData.commit.author.date).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric"
			});

			const githubCommitSHA = githubRepoData.sha.substring(0, 7);

			u("#paragraph-final")
				.replace(`<span id="paragraph-final" class="paragraph-internal last">Updated on ${githubCommitDate}</span>`);
			u("#commit-link")
				.replace(`<a id="commit-link" class="commit-link" target="_self"
					href="https://github.com/benalleng/benalleng.github.io/commit/${githubRepoData.sha}">${githubCommitSHA}</a>`);
		}).catch(err => console.error("Failed to fetch commit data.", err)
		);
	}
	fetchCommit();
});
