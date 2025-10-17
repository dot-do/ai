# gs1.org.ai

GS1 EPCIS (Electronic Product Code Information Services), CBV (Core Business Vocabulary), GLN (Global Location Number), and product hierarchy types with tree-shakeable exports.

## Installation

```bash
pnpm add gs1.org.ai
```

## Usage

```typescript
// Import EPCIS types
import type { ObjectEvent, AggregationEvent, TransformationEvent } from 'gs1.org.ai'

// Create an EPCIS Object Event
const event: ObjectEvent = {
  type: 'ObjectEvent',
  eventTime: '2024-01-15T10:30:00Z',
  eventTimeZoneOffset: '+00:00',
  epcList: ['urn:epc:id:sgtin:0614141.107346.2017'],
  action: 'OBSERVE',
  bizStep: 'shipping',
  disposition: 'inTransit',
  readPoint: {
    id: 'urn:epc:id:sgln:0614141.00777.0',
  },
}

// Import CBV vocabularies
import { getBizSteps, getDispositions, bizSteps, dispositions } from 'gs1.org.ai/data'

// Get all business steps
const allBizSteps = getBizSteps()

// Use specific vocabulary values (camelCase)
console.log(bizSteps.includes('shipping')) // true
console.log(dispositions.includes('inTransit')) // true
console.log(dispositions.includes('retailSold')) // true
console.log(bizSteps.includes('stagingOutbound')) // true
```

## Tree-Shaking

This package is designed to be tree-shakeable:

```typescript
// Only imports the ObjectEvent type (compile-time)
import type { ObjectEvent } from 'gs1.org.ai'

// Only imports getBizSteps function and its data
import { getBizSteps } from 'gs1.org.ai/data'

// Note: All constants use camelCase
// inTransit (not in_transit)
// retailSelling (not retail_selling)
// creatingClassInstance (not creating_class_instance)
```

## EPCIS Event Types

- `ObjectEvent` - Events about objects (e.g., scanning, shipping)
- `AggregationEvent` - Aggregation/disaggregation events (e.g., palletizing)
- `TransactionEvent` - Business transaction events (e.g., purchase orders)
- `TransformationEvent` - Transformation events (e.g., manufacturing)
- `AssociationEvent` - Association events between objects

## CBV Vocabularies

- Business Steps (`bizSteps`)
- Dispositions (`dispositions`)
- Business Transaction Types (`bizTransactionTypes`)
- Source/Destination Types (`sourceDestTypes`)
- Error Reasons (`errorReasons`)
- Sensor Measurement Types (`sensorMeasurementTypes`)

## API

### Types

Import from `gs1.org.ai` or `gs1.org.ai/types`:

```typescript
import type { ObjectEvent, AggregationEvent, TransactionEvent, TransformationEvent, AssociationEvent, BizStep, Disposition } from 'gs1.org.ai'
```

### Data

Import from `gs1.org.ai/data`:

```typescript
import { getBizSteps, getDispositions, getBizTransactionTypes, getCBVVocabulary } from 'gs1.org.ai/data'
```

## GLN Location Types

Global Location Numbers (GLN) identify physical, functional, or legal entities:

```typescript
import type { Location, Warehouse, Store, DistributionCenter } from 'gs1.org.ai'
import { isValidGLN, glnToEpcUri } from 'gs1.org.ai'

// Define a warehouse location
const warehouse: Warehouse = {
  $type: 'Location',
  $id: 'urn:epc:id:sgln:0614141.00001.0',
  gln: '0614141000012',
  name: 'Main Distribution Center',
  locationType: 'warehouse',
  address: {
    street: '123 Supply Chain Ave',
    city: 'Commerce City',
    state: 'CO',
    postalCode: '80022',
    country: 'US',
  },
  capacity: {
    palletPositions: 5000,
    squareFeet: 100000,
  },
}

// Validate GLN
if (isValidGLN(warehouse.gln)) {
  console.log('Valid GLN')
}

// Convert GLN to EPC URI
const epcUri = glnToEpcUri('0614141000012')
// Returns: 'urn:epc:id:sgln:0614141.00001.0'
```

**Location Types**: `warehouse`, `store`, `distributionCenter`, `manufacturingPlant`, `depot`, `terminal`, `port`, `airport`, `railyard`, `office`, `farm`, `facility`

## Product Packaging Hierarchy

Hierarchical packaging relationships (Item → Case → Pallet → Container):

```typescript
import type { Item, Case, Pallet, Container, ProductHierarchy } from 'gs1.org.ai'
import { isValidSSCC, ssccToEpcUri, gtinToEpcUri } from 'gs1.org.ai'

// Define a product item
const item: Item = {
  $type: 'Item',
  $id: 'urn:epc:id:sgtin:0614141.107346.2017',
  gtin: '00614141107346',
  name: 'Product Name',
  serialNumber: '2017',
}

// Define a case containing items
const productCase: Case = {
  $type: 'Case',
  $id: 'urn:epc:id:sscc:0614141.1234567890',
  sscc: '106141411234567897',
  containedItems: [
    {
      gtin: '00614141107346',
      quantity: 24,
    },
  ],
  packDate: '2024-01-15',
}

// Define a pallet containing cases
const pallet: Pallet = {
  $type: 'Pallet',
  $id: 'urn:epc:id:sscc:0614141.2345678901',
  sscc: '106141412345678908',
  containedCases: ['106141411234567897'],
  palletType: 'standard',
  weight: {
    value: 500,
    unit: 'kg',
  },
}

// Define a container with pallets
const container: Container = {
  $type: 'Container',
  $id: 'urn:epc:id:sscc:0614141.3456789012',
  sscc: '106141413456789019',
  containerType: 'shipping',
  containedPallets: ['106141412345678908'],
  sealNumber: 'SEAL123456',
}

// Complete hierarchy
const hierarchy: ProductHierarchy = {
  item,
  case: productCase,
  pallet,
  container,
}

// Validate SSCC
if (isValidSSCC(productCase.sscc)) {
  console.log('Valid SSCC')
}

// Convert identifiers to EPC URIs
const itemUri = gtinToEpcUri('00614141107346', '2017')
const caseUri = ssccToEpcUri('106141411234567897')
```

## Semantic Event Patterns

Use hierarchy levels with business steps and dispositions for semantic patterns:

```typescript
import type { ObjectEvent, BizStep, Disposition } from 'gs1.org.ai'

// Product receiving event
const receivingEvent: ObjectEvent = {
  type: 'ObjectEvent',
  eventTime: '2024-01-15T10:30:00Z',
  eventTimeZoneOffset: '+00:00',
  epcList: ['urn:epc:id:sgtin:0614141.107346.2017'],
  bizLocation: { id: 'urn:epc:id:sgln:0614141.00001.0' }, // Warehouse GLN
  bizStep: 'receiving',
  disposition: 'inProgress',
  action: 'OBSERVE',
}

// Case shipping event
const shippingEvent: ObjectEvent = {
  type: 'ObjectEvent',
  eventTime: '2024-01-15T14:00:00Z',
  eventTimeZoneOffset: '+00:00',
  epcList: ['urn:epc:id:sscc:0614141.1234567890'], // Case SSCC
  bizLocation: { id: 'urn:epc:id:sgln:0614141.00001.0' },
  bizStep: 'shipping',
  disposition: 'inTransit',
  action: 'OBSERVE',
}

// Pallet arrived event
const arrivedEvent: ObjectEvent = {
  type: 'ObjectEvent',
  eventTime: '2024-01-16T09:00:00Z',
  eventTimeZoneOffset: '+00:00',
  epcList: ['urn:epc:id:sscc:0614141.2345678901'], // Pallet SSCC
  bizLocation: { id: 'urn:epc:id:sgln:0614141.00002.0' }, // Store GLN
  bizStep: 'arriving',
  disposition: 'available',
  action: 'OBSERVE',
}
```

**Semantic Patterns**: `$.Product.receiving`, `$.Case.shipping`, `$.Pallet.inTransit`, `$.Container.arrived`

## Limitations

### Company Prefix Length

The EPC URI conversion functions (`glnToEpcUri`, `ssccToEpcUri`, `gtinToEpcUri`) currently assume a 7-digit GS1 company prefix. In reality, GS1 company prefixes can vary from 6 to 12 digits depending on the organization.

**Current Behavior:**

- All conversion functions use a fixed 7-digit company prefix split
- This produces correct URIs for companies with 7-digit prefixes
- Companies with other prefix lengths will have incorrect EPC URIs

**Workaround:**

- Use the validation functions (`isValidGLN`, `isValidSSCC`, `isValidGTIN`) which work correctly for all prefix lengths
- Construct EPC URIs manually if you know your company prefix length
- A future update will add company prefix length detection or configuration

**Example:**

```typescript
// Works correctly for validation (any prefix length)
isValidGLN('0614141000012') // true

// EPC URI assumes 7-digit prefix
glnToEpcUri('0614141000012')
// Returns: 'urn:epc:id:sgln:0614141.00001.0' (correct if prefix is 7 digits)
```

## License

MIT
