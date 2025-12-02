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
  if(!markdown){
    return ''
  }
  return md.render(findLinks(findMentions(markdown),repository))
}
function isValidVariableName(name) {
    // 1. Check if it's a string
    if (typeof name !== 'string') {
        return "Nome de variável inválido";
    }

    // 2. Check against JavaScript's naming rules using a regular expression
    //    - Starts with a letter, underscore, or dollar sign.
    //    - Subsequent characters can also include numbers.
    const validIdentifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (!validIdentifierRegex.test(name)) {
        return "Nome de variável inválido";
    }

    // 3. Check for reserved keywords (case-sensitive)
    const reservedKeywords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
        'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
        'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while',
        'with', 'yield', 'enum', 'implements', 'interface', 'let', 'package', 'private', 'protected',
        'public', 'static', 'await', 'abstract', 'boolean', 'byte', 'char', 'double', 'final', 'float',
        'goto', 'int', 'long', 'native', 'short', 'synchronized', 'throws', 'transient', 'volatile',
        'null', 'true', 'false', 'undefined'
    ];
    if (reservedKeywords.includes(name)) {
        return "Nome de variável inválido";
    }

    // If all checks pass, it's a valid variable name
    return true;
}

function isRequired(v,errorText='Campo obrigatório') {
    return (!v&&typeof v!= "number") ? errorText : true
}

export { parseGitMD, isValidVariableName, isRequired };
