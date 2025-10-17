import { workflow, on, every } from 'ai-workflows'

export default workflow({
  name: 'Order Fulfillment',
  description: 'Process high-value orders and send notifications',
  triggers: [on.Order.created(($) => ({ context: { workflowId: 'order-fulfillment' } })), every('0 */4 * * *')],
  async execute({ trigger, context, $, metadata }) {
    // Step execution
    let currentStep = 'check-inventory'
    const stepOutputs: Record<string, any> = {}

    while (currentStep) {
      switch (currentStep) {
        case 'check-inventory':
          try {
            // Execute: $.Inventory.check
            const result = await $.Inventory.check({ orderId: '{{context.orderId}}' })
            stepOutputs['check-inventory'] = result
            currentStep = 'process-payment'
          } catch (error) {
            currentStep = 'notify-team'
          }
          break

        case 'process-payment':
          try {
            // Execute: $.Payment.process
            const result = await $.Payment.process({ orderId: '{{context.orderId}}' })
            stepOutputs['process-payment'] = result
            currentStep = 'send-confirmation'
          } catch (error) {
            currentStep = 'notify-team'
          }
          break

        case 'send-confirmation':
          try {
            // Execute: $.Email.send
            const result = await $.Email.send({ to: '{{customer.email}}', template: 'order-confirmation' })
            stepOutputs['send-confirmation'] = result
            currentStep = null
          } catch (error) {
            throw error
          }
          break

        case 'notify-team':
          try {
            // Execute: $.Slack.send
            const result = await $.Slack.send({ channel: '#alerts', message: 'Order processing failed' })
            stepOutputs['notify-team'] = result
            currentStep = null
          } catch (error) {
            throw error
          }
          break

        default:
          currentStep = null
      }
    }

    return stepOutputs
  },
})
