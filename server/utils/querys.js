export const GET_USER = `
query  {
	viewer {
		id
		databaseId
		login
		name
		avatarUrl
		url
	}
}
`;
export const LIST_ISSUE_COMMENTS = `
query ($owner: String!, $repo: String!, $issueNumber: Int!) {
	repository (owner: $owner, name: $repo) {
		issue (number: $issueNumber) {
			comments (first: 100) {
				nodes {
					author {
						login
            avatarUrl
					}
					body
          id
				}
			}
		}
	}
}
`;
export const GET_ISSUE = `
query ($issueId: ID!){
  node (id: $issueId) {
		... on Issue {
			id
			title
			body
		}
	}
}
`;
export const GET_ORGANIZATIONS_BY_USER_PAT = `
query {
  viewer {
    id
    login
    avatarUrl
    organizations(first: 100) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        login
        name
        url
        avatarUrl
      }
    }
  }
}
`;
export const GET_PROJECTS_BY_ORGANIZATION = `
query($organizationLogin: String!) {
  organization(login: $organizationLogin) {
    name
    projectsV2(first: 100, query: "closed:false") {
      nodes {
        number
        id
        title
        url
      }
      totalCount
    }
  }
}
`;

export const LIST_PROJECT_ISSUES = `
query (
  $org: String!
  $projectNumber: Int!
  $paginationSize: Int!
  $after: String
  $q: String
) {
  organization(login: $org) {
    projectV2(number: $projectNumber) {
			id
      items(first: $paginationSize, after: $after, query:$q ) {
        nodes {
          id
          content {
            ... on Issue {
							id
              number
              title
              body
              state
              url
              createdAt
              updatedAt
							author {
								avatarUrl
								login
							}
							repository {
                name
                owner {
                  login
                }
              }
							issueType {
								color
								description
								name
							}
							labels (first: 10){
								nodes {
									color
									description
									id
									name						
								}
							}
							assignees (first: 10) {
								nodes {
									avatarUrl
									name
									login
								}
							}
							milestone {
								description
								number
								title
								state
							}
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
}
`;

export const LIST_PROJECT_FIELDS = `
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      fields(first: 100) {
        nodes {
          ... on ProjectV2FieldCommon {
            id
            name
          }
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
          ... on ProjectV2IterationField {
            id
            name
            configuration {
              iterations {
                id
                startDate
                duration
              }
            }
          }
        }
      }
    }
  }
}
`;
