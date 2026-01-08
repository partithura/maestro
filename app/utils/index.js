import markdownit from "markdown-it";
import pkg from "../../package.json";
// const config = useRuntimeConfig();
// const { organizationName } = config.public;
const organizationName = process.env.ORGANIZATION_NAME;

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
function findLinks(text, repository) {
    const regex = /#([0-9_]+)/; // Matches @ followed by issue number chars
    return text.replace(regex, (match, linkedIssueNumber) => {
        return `<a target="_blank" class="comment-link_issue" href="https://github.com/${organizationName}/${repository}/issues/${linkedIssueNumber}">${match}</a>`;
    });
}
function parseGitMD(markdown, repository) {
    if (!markdown) {
        return "";
    }
    return md.render(findLinks(findMentions(markdown), repository));
}
function isValidVariableName(name) {
    // 1. Check if it's a string
    if (typeof name !== "string") {
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
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "else",
        "export",
        "extends",
        "finally",
        "for",
        "function",
        "if",
        "import",
        "in",
        "instanceof",
        "new",
        "return",
        "super",
        "switch",
        "this",
        "throw",
        "try",
        "typeof",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "enum",
        "implements",
        "interface",
        "let",
        "package",
        "private",
        "protected",
        "public",
        "static",
        "await",
        "abstract",
        "boolean",
        "byte",
        "char",
        "double",
        "final",
        "float",
        "goto",
        "int",
        "long",
        "native",
        "short",
        "synchronized",
        "throws",
        "transient",
        "volatile",
        "null",
        "true",
        "false",
        "undefined",
    ];
    if (reservedKeywords.includes(name)) {
        return "Nome de variável inválido";
    }

    // If all checks pass, it's a valid variable name
    return true;
}

function isRequired(v, errorText = "Campo obrigatório") {
    return !v && typeof v != "number" ? errorText : true;
}

function firstCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseColor(colorStr = "") {
    // Passo 1: Verificar se é um valor hexadecimal (com ou sem #)
    let hex = colorStr.trim();

    // Se não começar com #, adicionamos temporariamente para validação
    if (!hex.startsWith("#")) {
        hex = "#" + hex;
    }

    // Testa se é um valor hexadecimal válido (6 dígitos)
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
        return hex.toUpperCase();
    }

    // Passo 2: Tentar converter nome de cor para hexadecimal
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = colorStr.trim();

    // Obter o estilo computado após definir a cor
    const computedColor = ctx.fillStyle;

    // Verificar se o valor resultante é um hexadecimal
    if (/^#([A-Fa-f0-9]{6})$/.test(computedColor)) {
        return computedColor.toUpperCase();
    }

    // Caso não seja uma cor válida
    return null;
}

function timestampToTime(timestamp) {
    // If timestamp is in seconds, multiply by 1000 to convert to milliseconds
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
}

export {
    pkg as appPkg,
    firstCase,
    isRequired,
    isValidVariableName,
    parseGitMD,
    parseColor,
    timestampToTime,
};
