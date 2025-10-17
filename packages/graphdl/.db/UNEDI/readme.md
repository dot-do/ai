# UN/EDIFACT - Electronic Data Interchange

UN/EDIFACT (United Nations Electronic Data Interchange For Administration, Commerce and Transport) is an international EDI standard developed under the United Nations.

## Data Schema

Each UN/EDIFACT message type is stored as an MDX file with the following frontmatter schema:

```yaml
$id: unedi:{code} # Semantic identifier (e.g., unedi:ORDERS)
$type: EDIMessage # Schema.org type
code: string # Message code (e.g., "ORDERS")
name: string # Full message name
description: string # Message description
version: string # UN/EDIFACT version (e.g., "D.96A")
category: string # Message category
segments: string[] # Array of segment codes
```

## Message Categories

### Commercial Messages

- **ORDERS**: Purchase Order
- **ORDRSP**: Purchase Order Response
- **DESADV**: Despatch Advice
- **RECADV**: Receiving Advice
- **PRICAT**: Price/Sales Catalogue
- **INVRPT**: Inventory Report
- **SLSRPT**: Sales Data Report
- **DELFOR**: Delivery Schedule

### Financial Messages

- **INVOIC**: Invoice
- **REMADV**: Remittance Advice

### Transport Messages

- **IFTMAN**: Arrival Notice
- **IFTMBC**: Booking Confirmation
- **IFTMBF**: Firm Booking
- **IFTMIN**: Instruction Message
- **IFTSTA**: Status Report

## Current Coverage

- **Total Messages**: 15 common message types
- **Categories**: Commercial (9), Financial (2), Transport (5)
- **Full Directory**: 200+ messages available in UN/EDIFACT standard

## Segment Structure

Common segments used across messages:

- **UNH**: Message Header (required)
- **UNT**: Message Trailer (required)
- **BGM**: Beginning of Message
- **DTM**: Date/Time/Period
- **RFF**: Reference
- **NAD**: Name and Address
- **LIN**: Line Item
- **QTY**: Quantity
- **PRI**: Price Details
- **MOA**: Monetary Amount

## File Naming Convention

Files are named using the message code with `.mdx` extension:

- `orders.mdx` - Purchase Order Message
- `invoic.mdx` - Invoice Message
- `desadv.mdx` - Despatch Advice Message

## Usage Examples

### Import in TypeScript

```typescript
import { db } from 'sdk.do'

// List all UN/EDIFACT messages
const messages = await db.list('UNEDI')

// Get specific message type
const orders = await db.get('UNEDI', 'orders')

// Find by category
const transport = await db.search('UNEDI', { category: 'Transport' })
```

### Semantic Queries

```typescript
// Using semantic identifiers
const message = await db.get('unedi:ORDERS')

// Message flow relationships
await db.relate('unedi:ORDERS', 'triggers', 'unedi:ORDRSP')
await db.relate('unedi:ORDRSP', 'confirms', 'unedi:ORDERS')
await db.relate('unedi:DESADV', 'fulfills', 'unedi:ORDERS')
```

## Integration with Business-as-Code

Map UN/EDIFACT messages to Business-as-Code events:

```typescript
import { $, on, send, api } from 'sdk.do'

// Process incoming ORDERS message
on($.UNEDI.ORDERS.received, async (edi) => {
  // Parse EDI message
  const order = parseEDI(edi.content)

  // Create order in system
  const newOrder = await $.db.create('Order', order)

  // Generate ORDRSP response
  const response = await generateEDI('ORDRSP', {
    orderNumber: newOrder.orderNumber,
    status: 'accepted',
  })

  // Send response via EDI
  await api.send('edi-partner', response)

  // Trigger internal workflow
  await send($.Order.created, newOrder)
})

// Generate INVOIC when order ships
on($.Order.shipped, async (order) => {
  const invoice = await generateEDI('INVOIC', order)
  await api.send('edi-partner', invoice)
})
```

## Data Source

- **Official Site**: https://unece.org/trade/uncefact/
- **Standards**: https://unece.org/trade/uncefact/unedifact-directories
- **Version**: D.96A (commonly used)
- **Update Frequency**: Bi-annual releases

## Related Standards

- **ANSI X12**: North American EDI standard
- **GS1 EANCOM**: Subset of UN/EDIFACT for retail/consumer goods
- **TRADACOMS**: UK-specific EDI standard
- **ebXML**: XML-based successor

## Technical Resources

- **Segment Directory**: https://unece.org/trade/uncefact/unedifact-segments
- **Code Lists**: https://unece.org/trade/uncefact/unedifact-code-lists
- **Implementation Guidelines**: https://unece.org/trade/uncefact/implementation

## License

UN/EDIFACT standards are developed and maintained by UN/CEFACT and are available for public use under the UN/CEFACT IPR Policy.
