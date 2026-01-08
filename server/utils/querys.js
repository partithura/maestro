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
`
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
`
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
`
export const LIST_PROJECT_ISSUES = `
query (
  $org: String!
  $projectNumber: Int!
  $paginationSize: Int!
  $after: String
) {
  organization(login: $org) {
    projectV2(number: $projectNumber) {
			id
      items(first: $paginationSize, after: $after) {
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
`