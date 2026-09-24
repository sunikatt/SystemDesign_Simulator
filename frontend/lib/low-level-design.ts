export const toLldSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export type LldPrinciple = {
  name: string;
  short: string;
  explanation: string;
  example: string;
};

export type DesignPattern = {
  name: string;
  family: 'Creational' | 'Structural' | 'Behavioral';
  intent: string;
  realWorld: string;
  useWhen: string;
};

export const solidPrinciples: LldPrinciple[] = [
  { name: 'S — Single Responsibility', short: 'One reason to change', explanation: 'Keep a class focused on one business responsibility. Separate booking, payment, and notification decisions instead of creating one God class.', example: 'A HotelReservationService reserves rooms; a ReceiptService formats receipts; a NotificationService sends confirmations.' },
  { name: 'O — Open/Closed', short: 'Open for extension, closed for modification', explanation: 'Add new behavior through interfaces and composition rather than editing stable, tested code.', example: 'Add UpiPayment or CardPayment by implementing PaymentMethod; checkout does not change.' },
  { name: 'L — Liskov Substitution', short: 'Subtypes must honor the contract', explanation: 'Every implementation of an abstraction should be safely usable wherever the abstraction is expected.', example: 'A FlyingBird abstraction should not force penguins to implement fly(); model capabilities separately.' },
  { name: 'I — Interface Segregation', short: 'Small interfaces beat fat interfaces', explanation: 'Clients should depend only on methods they actually need.', example: 'Split Printer into Printable, Scannable, and Faxable so a simple printer is not forced to support fax.' },
  { name: 'D — Dependency Inversion', short: 'Depend on abstractions', explanation: 'High-level policy should not be coupled to concrete infrastructure details.', example: 'OrderService depends on PaymentGateway; StripeGateway and FakePaymentGateway can be swapped in.' },
];

export const designPatterns: DesignPattern[] = [
  { name: 'Factory Method', family: 'Creational', intent: 'Create objects without coupling callers to concrete classes.', realWorld: 'A notification factory creates Email, SMS, or Push sender based on channel.', useWhen: 'Construction varies by input or configuration.' },
  { name: 'Builder', family: 'Creational', intent: 'Construct complex immutable objects step by step.', realWorld: 'An HTTP request builder assembles headers, query parameters, body, and timeout.', useWhen: 'Objects have many optional fields or validation rules.' },
  { name: 'Singleton', family: 'Creational', intent: 'Provide one coordinated instance when a single resource is truly required.', realWorld: 'A process-wide configuration registry or metrics registry.', useWhen: 'Use sparingly; prefer dependency injection for testability.' },
  { name: 'Adapter', family: 'Structural', intent: 'Translate one interface into another expected by clients.', realWorld: 'Adapt Stripe, Razorpay, and PayPal SDKs to one PaymentGateway interface.', useWhen: 'Integrating legacy code or third-party APIs.' },
  { name: 'Decorator', family: 'Structural', intent: 'Add behavior without modifying the wrapped object.', realWorld: 'Wrap a repository with caching, metrics, and retry decorators.', useWhen: 'Features should be stackable and independently selectable.' },
  { name: 'Facade', family: 'Structural', intent: 'Offer a simple API over a complicated subsystem.', realWorld: 'CheckoutFacade coordinates inventory, payment, order, and email services.', useWhen: 'Callers should not know orchestration details.' },
  { name: 'Strategy', family: 'Behavioral', intent: 'Make an algorithm interchangeable at runtime.', realWorld: 'Choose pricing, parking-slot allocation, or route strategy by configuration.', useWhen: 'Many if/else branches represent interchangeable policies.' },
  { name: 'Observer', family: 'Behavioral', intent: 'Notify subscribed objects when state changes.', realWorld: 'A cricket score update notifies scoreboards, commentary, and push clients.', useWhen: 'Consumers should react without tightly coupling to the producer.' },
  { name: 'State', family: 'Behavioral', intent: 'Change behavior when an object moves through states.', realWorld: 'Vending machine behavior changes between Idle, HasMoney, Dispensing, and OutOfStock.', useWhen: 'State-specific conditionals are growing and transitions need rules.' },
  { name: 'Chain of Responsibility', family: 'Behavioral', intent: 'Pass a request through handlers until one handles it.', realWorld: 'Logger routes DEBUG/INFO/WARN/ERROR records to eligible sinks.', useWhen: 'A request may be handled by one or more ordered processors.' },
];

export const solidExamples: Record<string, string[]> = {
  'S — Single Responsibility': ['Checkout validates an order while ReceiptService formats the invoice.', 'A React component renders UI while a hook owns data fetching.', 'A logger formats records while sinks decide where to write.'],
  'O — Open/Closed': ['Payment methods plug into PaymentGateway without editing Checkout.', 'Shipping calculators add DHL or FedEx strategies without changing Order.', 'Discount rules are new classes rather than a growing if/else block.'],
  'L — Liskov Substitution': ['Every ParkingSlot subtype honors canFit and release.', 'A read-only repository is not substituted where save is required.', 'Square and Rectangle APIs avoid surprising width/height behavior.'],
  'I — Interface Segregation': ['A Printer can implement Printable without Scanner methods.', 'A worker uses JobRunner, not a huge AdminService interface.', 'Mobile clients depend on a small FeedReader interface.'],
  'D — Dependency Inversion': ['OrderService accepts PaymentGateway instead of StripeClient.', 'NotificationService accepts Clock and Queue abstractions for tests.', 'A repository interface keeps domain logic independent of SQL.'],
};

export const patternExamples: Record<string, string[]> = {
  'Factory Method': ['NotificationFactory creates email, SMS, or push senders.', 'A game creates different Piece objects from a piece code.'],
  Builder: ['HttpRequestBuilder adds headers and timeout safely.', 'A report builder creates optional filters and sorting.'],
  Singleton: ['One metrics registry coordinates process metrics.', 'Use dependency injection instead when tests need isolation.'],
  Adapter: ['RazorpayAdapter and StripeAdapter expose one PaymentGateway.', 'A legacy date library is adapted to the application Clock.'],
  Decorator: ['CachingRepository wraps DatabaseRepository.', 'Retry, metrics, and authorization wrappers can be composed.'],
  Facade: ['CheckoutFacade coordinates inventory, payment, order, and email.', 'VideoFacade hides transcoding and storage workflows.'],
  Strategy: ['PricingStrategy chooses regular, surge, or festival pricing.', 'ParkingStrategy chooses nearest or best-fit slot.'],
  Observer: ['Scoreboard and push notifications observe a cricket match.', 'Subscribers receive order status updates.'],
  State: ['VendingMachine changes behavior after coin, selection, and dispense.', 'Trip moves from Requested to Assigned to Completed.'],
  'Chain of Responsibility': ['Logger handlers route messages by level.', 'ATM cash dispenser handlers process denominations.'],
};

export const lldTopics = [

  { title: 'SOLID principles', description: 'Five design principles with practical examples, trade-offs, and interview signals.' },
  { title: 'Design patterns', description: 'Creational, structural, and behavioral patterns mapped to real products.' },
  { title: 'UML and object modelling', description: 'Read class relationships, sequence flows, state transitions, and composition.' },
  { title: 'Clean implementation', description: 'Define responsibilities, interfaces, functions, errors, and test seams before coding.' },
];
