import markdownit from 'markdown-it';

// const config = useRuntimeConfig();
// const { organizationName } = config.public;
const organizationName = process.env.ORGANIZATION_NAME

const md = new markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
});

function findMentions(text) {
  const regex = /@([a-zA-Z0-9_]+)/; // Matches @ followed by username chars
  return text.replace(regex, (match, username) => {
    return `<a target="_blank" class="comment-link_user" href="https://github.com/${username}">${match}</a>`;
  });
}
function findLinks(text,repository) {
  const regex = /#([0-9_]+)/; // Matches @ followed by issue number chars
  return text.replace(regex, (match, linkedIssueNumber) => {
    return `<a target="_blank" class="comment-link_issue" href="https://github.com/${organizationName}/${repository}/issues/${linkedIssueNumber}">${match}</a>`;
  });
}
function parseGitMD(markdown, repository){
  return md.render(findLinks(findMentions(markdown),repository))
}

export { parseGitMD };
