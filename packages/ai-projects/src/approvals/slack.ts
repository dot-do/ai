import { ApprovalRequest, ApprovalResult } from '../types'

const pendingApprovals = new Map<string, { request: ApprovalRequest; resolve: (result: ApprovalResult) => void }>()

/**
 * Submits a request for approval via Slack
 * @param request The approval request
 * @returns A promise that resolves with the approval result
 */
export async function requestSlackApproval(request: ApprovalRequest): Promise<ApprovalResult> {
  try {
    const approvalId = `approval-${Date.now()}-${request.taskId}`

    const approvalPromise = new Promise<ApprovalResult>((resolve) => {
      pendingApprovals.set(approvalId, { request, resolve })

      console.log(`[Slack] Approval request submitted for task ${request.taskId}`)
      console.log(`[Slack] Approval ID: ${approvalId}`)
      console.log(`[Slack] Message: ${request.message}`)
      console.log(`[Slack] Approvers: ${request.approvers.join(', ')}`)

      setTimeout(() => {
        const result: ApprovalResult = {
          approved: true,
          approvedBy: request.approvers[0],
          approvedAt: new Date(),
          comments: 'Automatically approved for demo purposes',
        }

        resolve(result)

        pendingApprovals.delete(approvalId)
      }, 5000) // 5 second delay for demo
    })

    return approvalPromise
  } catch (error) {
    console.error('Error requesting Slack approval:', error)
    throw error
  }
}

/**
 * Handles an approval response from Slack
 * @param approvalId The ID of the approval request
 * @param approved Whether the request was approved
 * @param approvedBy The user who approved or rejected the request
 * @param comments Any comments provided with the approval or rejection
 */
export function handleSlackApprovalResponse(approvalId: string, approved: boolean, approvedBy: string, comments?: string): void {
  const pendingApproval = pendingApprovals.get(approvalId)

  if (!pendingApproval) {
    console.warn(`Approval ID ${approvalId} not found in pending approvals`)
    return
  }

  const result: ApprovalResult = {
    approved,
    approvedBy,
    approvedAt: new Date(),
    comments,
  }

  pendingApproval.resolve(result)

  pendingApprovals.delete(approvalId)
}

/**
 * Configures the Slack integration
 * @param config Configuration options for Slack integration
 */
export function configureSlackIntegration(config: { token?: string; signingSecret?: string; channel?: string; port?: number }): void {
  console.log('[Slack] Integration configured with:', config)
}

/**
 * Creates a Slack message with approval buttons
 * @param request The approval request
 * @param approvalId The unique ID for this approval
 * @returns The Slack message blocks
 */
export function createSlackApprovalMessage(request: ApprovalRequest, approvalId: string): any {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Approval Request: ${request.taskId}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: request.message,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Result:*\n\`\`\`${JSON.stringify(request.result, null, 2)}\`\`\``,
      },
    },
    {
      type: 'actions',
      block_id: `actions-${approvalId}`,
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Approve',
            emoji: true,
          },
          style: 'primary',
          value: approvalId,
          action_id: 'approve_request',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Reject',
            emoji: true,
          },
          style: 'danger',
          value: approvalId,
          action_id: 'reject_request',
        },
      ],
    },
    {
      type: 'input',
      block_id: `comments-${approvalId}`,
      optional: true,
      label: {
        type: 'plain_text',
        text: 'Comments',
        emoji: true,
      },
      element: {
        type: 'plain_text_input',
        multiline: true,
        action_id: 'comment_text',
      },
    },
  ]
}
