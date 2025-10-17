/**
 * UN/EDIFACT (United Nations Electronic Data Interchange For Administration, Commerce and Transport)
 * Data Ingestion
 * Source: https://unece.org/trade/uncefact/
 */

import { join } from 'path'
import type { IngestionResult, UNEDIMessage, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'UNEDI')

/**
 * Common UN/EDIFACT Message Types
 * Based on UN/EDIFACT Standard Message Directory
 *
 * TODO: Future enhancement - fetch from UN/CEFACT repository
 * Repository: https://unece.org/trade/uncefact/xml-schemas
 */
const UNEDI_MESSAGES: UNEDIMessage[] = [
  {
    code: 'ORDERS',
    name: 'Purchase Order Message',
    description: 'A message specifying details for goods or services ordered under conditions agreed between the seller and the buyer.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'LIN', 'QTY', 'PRI', 'UNT'],
  },
  {
    code: 'ORDRSP',
    name: 'Purchase Order Response Message',
    description: 'A message sent by a supplier to a buyer in response to a purchase order, indicating acceptance, rejection, or proposed changes.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'LIN', 'QTY', 'PRI', 'UNT'],
  },
  {
    code: 'DESADV',
    name: 'Despatch Advice Message',
    description: 'A message sent by a supplier to a buyer informing about the despatch of goods.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'MEA', 'RFF', 'NAD', 'CPS', 'PAC', 'LIN', 'QTY', 'UNT'],
  },
  {
    code: 'INVOIC',
    name: 'Invoice Message',
    description: 'A message claiming payment for goods or services supplied under conditions agreed between seller and buyer.',
    version: 'D.96A',
    category: 'Financial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'CUX', 'PAT', 'LIN', 'QTY', 'MOA', 'TAX', 'UNS', 'UNT'],
  },
  {
    code: 'REMADV',
    name: 'Remittance Advice Message',
    description: 'A message providing details of payments made or to be made to settle one or more invoice(s).',
    version: 'D.96A',
    category: 'Financial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'FII', 'NAD', 'CUX', 'DOC', 'MOA', 'UNT'],
  },
  {
    code: 'RECADV',
    name: 'Receiving Advice Message',
    description: 'A message sent by a receiver to a sender to confirm receipt of goods.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'MEA', 'RFF', 'NAD', 'LIN', 'QTY', 'UNT'],
  },
  {
    code: 'PRICAT',
    name: 'Price/Sales Catalogue Message',
    description: 'A message to enable the transmission of information regarding pricing and catalogue details for goods and services.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'CUX', 'LIN', 'PRI', 'TAX', 'UNT'],
  },
  {
    code: 'IFTMAN',
    name: 'Arrival Notice Message',
    description: 'A message advising a consignee about the arrival of goods described in the message.',
    version: 'D.96A',
    category: 'Transport',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'LOC', 'NAD', 'CNI', 'GID', 'UNT'],
  },
  {
    code: 'IFTMBC',
    name: 'Booking Confirmation Message',
    description: 'A message confirming the booking of cargo space for goods to be transported.',
    version: 'D.96A',
    category: 'Transport',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'LOC', 'NAD', 'TDT', 'GID', 'EQD', 'UNT'],
  },
  {
    code: 'IFTMBF',
    name: 'Firm Booking Message',
    description: 'A message containing firm booking information for cargo space on a means of transport.',
    version: 'D.96A',
    category: 'Transport',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'LOC', 'NAD', 'TDT', 'GID', 'EQD', 'UNT'],
  },
  {
    code: 'IFTMIN',
    name: 'Instruction Message',
    description: 'A message containing instructions from a shipper or forwarder to a carrier or forwarder.',
    version: 'D.96A',
    category: 'Transport',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'LOC', 'NAD', 'TDT', 'GID', 'EQD', 'UNT'],
  },
  {
    code: 'IFTSTA',
    name: 'International Multimodal Status Report Message',
    description: 'A message reporting the transport status and/or change in status of goods.',
    version: 'D.96A',
    category: 'Transport',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'LOC', 'NAD', 'CNI', 'STS', 'UNT'],
  },
  {
    code: 'INVRPT',
    name: 'Inventory Report Message',
    description: 'A message specifying information relating to held inventories.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'LOC', 'LIN', 'QTY', 'INV', 'UNT'],
  },
  {
    code: 'SLSRPT',
    name: 'Sales Data Report Message',
    description: 'A message to enable the transmission of sales data for products or services.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'CUX', 'LIN', 'QTY', 'MOA', 'UNT'],
  },
  {
    code: 'DELFOR',
    name: 'Delivery Schedule Message',
    description: 'A message providing delivery schedule information in terms of location and time.',
    version: 'D.96A',
    category: 'Commercial',
    segments: ['UNH', 'BGM', 'DTM', 'FTX', 'RFF', 'NAD', 'LIN', 'QTY', 'SCC', 'UNT'],
  },
]

/**
 * Converts UN/EDIFACT message to frontmatter and content
 */
function unediToDocument(message: UNEDIMessage): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatter = {
    $id: `unedi:${message.code}`,
    $type: 'EDIMessage',
    code: message.code,
    name: message.name,
    description: message.description,
    version: message.version,
    category: message.category,
    segments: message.segments,
  }

  const content = `# ${message.code} - ${message.name}

${message.description}

## Message Details

- **Message Code**: ${message.code}
- **Message Name**: ${message.name}
- **Version**: ${message.version}
- **Category**: ${message.category}
- **Segments**: ${message.segments.length}

## Message Structure

### Key Segments

${message.segments
  .map((seg) => {
    const segmentDescriptions: Record<string, string> = {
      UNH: 'Message Header - Start of message',
      BGM: 'Beginning of Message - Message identification',
      DTM: 'Date/Time/Period - Date and time information',
      FTX: 'Free Text - Additional textual information',
      RFF: 'Reference - Reference numbers',
      NAD: 'Name and Address - Party identification',
      LIN: 'Line Item - Item identification',
      QTY: 'Quantity - Quantities',
      PRI: 'Price Details - Pricing information',
      MOA: 'Monetary Amount - Financial amounts',
      TAX: 'Duty/Tax/Fee Details - Tax information',
      CUX: 'Currencies - Currency information',
      PAT: 'Payment Terms - Payment conditions',
      UNS: 'Section Control - Section separator',
      UNT: 'Message Trailer - End of message',
      MEA: 'Measurements - Measurement details',
      PAC: 'Package - Package information',
      CPS: 'Consignment Packing Sequence - Packing details',
      FII: 'Financial Institution Information - Banking details',
      DOC: 'Document/Message Details - Document references',
      LOC: 'Place/Location Identification - Location details',
      CNI: 'Consignment Information - Shipment details',
      GID: 'Goods Item Details - Item descriptions',
      TDT: 'Transport Details - Transportation information',
      EQD: 'Equipment Details - Container/equipment info',
      STS: 'Status - Status information',
      INV: 'Inventory Management - Inventory details',
      SCC: 'Scheduling Conditions - Schedule information',
    }

    return `- **${seg}**: ${segmentDescriptions[seg] || 'Segment information'}`
  })
  .join('\n')}

## Use Cases

This message is commonly used for:
- Electronic data interchange between trading partners
- Automated order processing and fulfillment
- Supply chain integration and visibility
- Financial transaction processing
- Regulatory compliance and documentation

## Implementation

### Message Flow

1. Message is generated by sending system
2. Message is validated against UN/EDIFACT standards
3. Message is transmitted via EDI network (AS2, SFTP, etc.)
4. Receiving system validates and processes message
5. Acknowledgment (CONTRL) may be sent back

### Integration Points

- ERP systems (SAP, Oracle, Microsoft Dynamics)
- Supply chain management platforms
- Transportation management systems
- Financial systems and banking networks
- Customs and regulatory systems

## Standards and Compliance

- **Standard**: UN/EDIFACT
- **Maintained by**: UN/CEFACT (United Nations Centre for Trade Facilitation and Electronic Business)
- **Version**: ${message.version}
- **Compliance**: ISO 9735

## Resources

- [UN/EDIFACT Standards](https://unece.org/trade/uncefact/introducing-unedifact)
- [Message Directory](https://unece.org/trade/uncefact/unedifact-directories)
- [Implementation Guidelines](https://unece.org/trade/uncefact/implementation)
- [UN/CEFACT](https://unece.org/trade/uncefact)
`

  return { frontmatter, content }
}

/**
 * Ingests UN/EDIFACT data into .db/UNEDI/
 */
export async function ingestUNEDI(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'UN/EDIFACT',
    totalRecords: UNEDI_MESSAGES.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each UN/EDIFACT message type
    for (const message of UNEDI_MESSAGES) {
      try {
        const filename = `${toFilename(message.code)}.mdx`
        const { frontmatter, content } = unediToDocument(message)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process UN/EDIFACT ${message.code} (${message.name}): ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  } catch (error) {
    result.errorCount++
    result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  }

  result.duration = Date.now() - startTime
  logResult(result)

  return result
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestUNEDI().catch(console.error)
}
