export const ADD_ISSUE_COMMENT = `
mutation ($issueId: ID!, $body: String!) {
	addComment (input: {
		subjectId: $issueId
		body: $body
	}) {
		commentEdge {
			node {
				id
				body
				createdAt
				author {
					login
				}
			}
		}
	}
}
`
export const DELETE_ISSUE_COMMENT = `
mutation ($commentId: ID!) {
	deleteIssueComment (input: {
		id: $commentId
	}) {
		clientMutationId
	}
}
`
export const UPDATE_ISSUE_COMMENT = `
mutation ($commentId: ID!, $body: String!) {
	updateIssueComment (input: {
		id: $commentId
		body: $body
	}) {
		issueComment {
			body
			createdAt
			updatedAt
			author {
				login
				avatarUrl
			}
			
		}
	}
}
`
export const UPDATE_ISSUE_FIELD_DIFICULDADE = `
mutation ($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: Float!) {
	updateProjectV2ItemFieldValue (input: {
		projectId: $projectId,
		itemId: $itemId,
		fieldId: $fieldId,
		value: { number: $value }
	}) {
		projectV2Item {
			id
		}
	}
}
`